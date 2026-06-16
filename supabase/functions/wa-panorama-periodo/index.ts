// Panorama de período: quinzenal (dia 15) ou mensal (dia 30) do mês corrente.
// Envia ao Jhonattan via instância Brava Principal (SistemaBravaCompany).
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const SUPA_URL = Deno.env.get('SUPABASE_URL')!;
const SUPA_SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supa = createClient(SUPA_URL, SUPA_SERVICE, { auth: { persistSession: false } });

const cors = { 'access-control-allow-origin': '*' };
const json = (s: number, b: unknown) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, 'content-type': 'application/json' } });

function fmtBRL(n: number): string {
  return 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtDDMM(iso: string): string {
  const [, , m, d] = iso.match(/^(\d{4})-(\d{2})-(\d{2})/) || [];
  return d && m ? `${d}/${m}` : iso;
}
function isoDate(d: Date): string { return d.toISOString().slice(0, 10); }

async function montarPanorama(tipo: 'quinzenal' | 'mensal'): Promise<string> {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth(); // 0-based
  const ini = isoDate(new Date(ano, mes, 1));
  const fim = isoDate(hoje);
  const diasNoPeriodo = hoje.getDate();
  const nomeMes = hoje.toLocaleDateString('pt-BR', { month: 'long' });

  // Período anterior (mesmo recorte do mês passado)
  const inicioMesAnt = new Date(ano, mes - 1, 1);
  const finalRecorteAnt = new Date(ano, mes - 1, hoje.getDate());
  const iniAnt = isoDate(inicioMesAnt);
  const fimAnt = isoDate(finalRecorteAnt);

  // 1) Entradas reais via extrato bancário (categoria não "Repasse Trafego" e não despesa)
  const { data: extratoPeriodo } = await supa.from('fin_extrato_bancario')
    .select('valor, categoria, cliente_id, data, descricao')
    .gt('valor', 0).gte('data', ini).lte('data', fim);
  const { data: extratoAnt } = await supa.from('fin_extrato_bancario')
    .select('valor, categoria')
    .gt('valor', 0).gte('data', iniAnt).lte('data', fimAnt);

  const semRepasse = (arr: any[] | null) => (arr || []).filter((p: any) => p.categoria !== 'Repasse Trafego' && (p.categoria || '').toLowerCase() !== 'repasse_traf');
  const totalRecebido = semRepasse(extratoPeriodo).reduce((s: number, p: any) => s + Number(p.valor || 0), 0);
  const totalRecebidoAnt = semRepasse(extratoAnt).reduce((s: number, p: any) => s + Number(p.valor || 0), 0);
  const varReceita = totalRecebidoAnt > 0 ? ((totalRecebido - totalRecebidoAnt) / totalRecebidoAnt * 100) : null;

  // 2) Parcelas: pagas no período vs previstas no período
  const { data: parcelasPagas } = await supa.from('projeto_parcelas')
    .select('valor_recebido, descricao, projeto_id, data_pagamento')
    .eq('pago', true).gte('data_pagamento', ini).lte('data_pagamento', fim);
  const { data: parcelasPrevistas } = await supa.from('projeto_parcelas')
    .select('valor_esperado, descricao, projeto_id, data_vencimento_esperada, pago')
    .gte('data_vencimento_esperada', ini).lte('data_vencimento_esperada', fim);

  const totalParcelasPagas = (parcelasPagas || []).reduce((s: number, p: any) => s + Number(p.valor_recebido || 0), 0);
  const totalParcelasPrevistas = (parcelasPrevistas || []).reduce((s: number, p: any) => s + Number(p.valor_esperado || 0), 0);
  const previstasNaoPagas = (parcelasPrevistas || []).filter((p: any) => !p.pago);
  const naoEntrouValor = previstasNaoPagas.reduce((s: number, p: any) => s + Number(p.valor_esperado || 0), 0);

  // 3) Top 5 clientes no período
  const clienteIds = [...new Set([
    ...(extratoPeriodo || []).map((p: any) => p.cliente_id),
    ...(parcelasPagas || []).map((p: any) => p.projeto_id),
  ].filter(Boolean))];
  const { data: clientes } = await supa.from('clientes').select('id, nome').in('id', clienteIds as any);
  const clMap: Record<string, string> = {};
  (clientes || []).forEach((c: any) => { clMap[c.id] = c.nome; });

  const allProjIds = [...new Set((parcelasPagas || []).map((p: any) => p.projeto_id).filter(Boolean))];
  const { data: projs } = await supa.from('projetos').select('id, cliente, cliente_id').in('id', allProjIds as any);
  const projToClNome: Record<string, string> = {};
  (projs || []).forEach((p: any) => { projToClNome[p.id] = (p.cliente_id && clMap[p.cliente_id]) || p.cliente; });

  const porCliente: Record<string, number> = {};
  semRepasse(extratoPeriodo).forEach((p: any) => {
    const nome = (p.cliente_id && clMap[p.cliente_id]) || (p.descricao || '').slice(0, 30) || '?';
    porCliente[nome] = (porCliente[nome] || 0) + Number(p.valor);
  });
  const topClientes = Object.entries(porCliente).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // 4) Estado atual: atrasados, pendentes, saúde
  const hojeISO = isoDate(hoje);
  const { data: atrasadasAtuais } = await supa.from('projeto_parcelas')
    .select('valor_esperado').eq('pago', false).lt('data_vencimento_esperada', hojeISO);
  const totalAtrasado = (atrasadasAtuais || []).reduce((s: number, p: any) => s + Number(p.valor_esperado || 0), 0);

  // 5) Despesas (extrato saídas, excluindo repasse)
  const { data: saidas } = await supa.from('fin_extrato_bancario')
    .select('valor, categoria').lt('valor', 0).gte('data', ini).lte('data', fim);
  const totalSaidas = semRepasse(saidas).reduce((s: number, p: any) => s + Math.abs(Number(p.valor || 0)), 0);
  const resultado = totalRecebido - totalSaidas;

  // Monta texto
  const titulo = tipo === 'quinzenal' ? 'Panorama Quinzenal' : 'Panorama Mensal';
  const subtitulo = tipo === 'quinzenal'
    ? `1 a ${diasNoPeriodo} de ${nomeMes} (primeira metade)`
    : `Fechamento de ${nomeMes} (${diasNoPeriodo} dias)`;

  const linhas: string[] = [];
  linhas.push(`*BRAVA · ${titulo}*`);
  linhas.push(subtitulo);
  linhas.push('');

  linhas.push('*Receita do período*');
  linhas.push(`Total efetivamente recebido: *${fmtBRL(totalRecebido)}*`);
  if (varReceita !== null) {
    const sinal = varReceita >= 0 ? '+' : '';
    linhas.push(`Vs mesmo recorte do mês anterior: ${sinal}${varReceita.toFixed(1)}% (era ${fmtBRL(totalRecebidoAnt)}).`);
  }
  if (totalParcelasPrevistas > 0) {
    const taxaConv = (totalParcelasPagas / totalParcelasPrevistas * 100).toFixed(0);
    linhas.push(`Parcelas previstas no período: ${fmtBRL(totalParcelasPrevistas)}. Recebidas: ${fmtBRL(totalParcelasPagas)} (${taxaConv}%).`);
  }
  if (naoEntrouValor > 0) {
    linhas.push(`Previsto e ainda não entrou: *${fmtBRL(naoEntrouValor)}* (${previstasNaoPagas.length} parcela${previstasNaoPagas.length > 1 ? 's' : ''}).`);
  }
  linhas.push('');

  if (topClientes.length > 0) {
    linhas.push('*Top clientes do período*');
    topClientes.forEach(([nome, v], i) => {
      linhas.push(`${i + 1}. ${nome}: ${fmtBRL(v)}`);
    });
    linhas.push('');
  }

  linhas.push('*Resultado do período*');
  linhas.push(`Saídas (excluindo repasses): ${fmtBRL(totalSaidas)}`);
  linhas.push(`Resultado bruto (entradas - saídas): *${fmtBRL(resultado)}*`);
  linhas.push('');

  if (totalAtrasado > 0) {
    linhas.push(`*Atrasados acumulados*: ${fmtBRL(totalAtrasado)} em ${(atrasadasAtuais || []).length} parcela${(atrasadasAtuais || []).length > 1 ? 's' : ''}.`);
    linhas.push('');
  }

  linhas.push('Atenciosamente,');
  linhas.push('Desenvolvimento · Brava');

  return linhas.join('\n');
}

async function enviarParaJhonattan(texto: string) {
  const operadores = (Deno.env.get('BRAVA_OPERADOR_JIDS') || '5511991612610').split(',').map(s => s.replace(/\D/g, '')).filter(Boolean);
  if (operadores.length === 0) throw new Error('BRAVA_OPERADOR_JIDS vazio');
  const last8 = (n: string) => (n || '').replace(/\D/g, '').slice(-8);
  const { data: insts } = await supa.from('wa_instancias').select('*').eq('status', 'open');
  if (!insts || insts.length === 0) throw new Error('Nenhuma instância open');
  let inst: any = insts.find((i: any) => i.evolution_instance_name === 'SistemaBravaCompany');
  if (!inst) inst = insts.find((i: any) => !operadores.some(o => last8(i.owner_jid || '') === last8(o)));
  if (!inst) inst = insts[0];
  const url = inst.evolution_url.replace(/\/+$/, '') + `/message/sendText/${encodeURIComponent(inst.evolution_instance_name)}`;
  const results: any[] = [];
  for (const num of operadores) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', apikey: inst.evolution_apikey },
        body: JSON.stringify({ number: num, text: texto }),
      });
      results.push({ num, status: res.status });
    } catch (e) {
      results.push({ num, error: String(e).slice(0, 100) });
    }
  }
  return { instancia: inst.evolution_instance_name, results };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST' && req.method !== 'GET') return json(405, { error: 'method_not_allowed' });
  try {
    let tipo: 'quinzenal' | 'mensal' = 'quinzenal';
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        if (body?.tipo === 'mensal' || body?.tipo === 'quinzenal') tipo = body.tipo;
      } catch { /* ignora */ }
    } else {
      const url = new URL(req.url);
      const t = url.searchParams.get('tipo');
      if (t === 'mensal' || t === 'quinzenal') tipo = t;
    }
    const texto = await montarPanorama(tipo);
    const env = await enviarParaJhonattan(texto);
    await supa.from('wa_eventos_log').insert({
      event_type: 'panorama.enviado',
      payload: { tipo, preview: texto.slice(0, 600), destinatarios: env.results, instancia: env.instancia },
      processed: true,
    });
    return json(200, { ok: true, tipo, instancia: env.instancia, destinatarios: env.results });
  } catch (e) {
    await supa.from('wa_eventos_log').insert({ event_type: 'panorama.erro', payload: {}, error: String(e).slice(0, 500) });
    return json(500, { error: String(e) });
  }
});
