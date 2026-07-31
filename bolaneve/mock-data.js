// ═══════════════════════════════════════════════════════════════
// BOLA DE NEVE SOROCABA · dados mock do demo (sem backend)
// Tudo ficticio e plausivel. Trocar aqui alimenta todas as telas.
// ═══════════════════════════════════════════════════════════════

window.MOCK = (function () {

  const igreja = {
    nome: 'Bola de Neve Sorocaba',
    cidade: 'Sorocaba, SP',
    pastor: 'Pastor Igor',
    versiculoAno: 'Porque onde estiverem dois ou tres reunidos em meu nome, ali estou no meio deles.',
    refAno: 'Mateus 18.20',
  };

  // Nucleos / frentes da igreja (lista a validar com a igreja).
  // A cor referencia um token de tokens.css.
  const nucleos = [
    { id: 'louvor',      nome: 'Louvor',      cor: 'var(--bn-nucleo-louvor)' },
    { id: 'tecnologia',  nome: 'Tecnologia',  cor: 'var(--bn-nucleo-tecnologia)' },
    { id: 'ministracao', nome: 'Ministracao', cor: 'var(--bn-nucleo-ministracao)' },
    { id: 'audiovisual', nome: 'Audiovisual', cor: 'var(--bn-nucleo-audiovisual)' },
    { id: 'acolhimento', nome: 'Acolhimento', cor: 'var(--bn-nucleo-acolhimento)' },
  ];
  const nucleoById = Object.fromEntries(nucleos.map(n => [n.id, n]));

  // Metricas do painel (numeros vivos do rebanho).
  const painel = {
    destaques: [
      { id: 'novas',   label: 'Pessoas novas na semana', valor: 34,  tendencia: '+12%', tom: 'accent', icon: 'UserPlus' },
      { id: 'celula',  label: 'Ja foram para uma celula', valor: 21,  tendencia: '+8%',  tom: 'good',   icon: 'UserCheck' },
      { id: 'visita',  label: 'Sumiram, precisam de visita', valor: 9, tendencia: '-3',  tom: 'alert',  icon: 'Heart' },
      { id: 'ativos',  label: 'Rebanho ativo no mes', valor: 486, tendencia: '+34',      tom: 'muted',  icon: 'Users' },
    ],
    porFrente: [
      { nucleo: 'louvor',      pessoas: 62 },
      { nucleo: 'tecnologia',  pessoas: 28 },
      { nucleo: 'ministracao', pessoas: 74 },
      { nucleo: 'audiovisual', pessoas: 33 },
      { nucleo: 'acolhimento', pessoas: 41 },
    ],
    porSetor: [
      { setor: 'Zona Norte',  pessoas: 128, celulas: 6 },
      { setor: 'Campolim',    pessoas: 96,  celulas: 5 },
      { setor: 'Alem Ponte',  pessoas: 84,  celulas: 4 },
      { setor: 'Eden',        pessoas: 71,  celulas: 3 },
      { setor: 'Wanel Ville', pessoas: 58,  celulas: 3 },
    ],
    caminhada: [
      { etapa: 'Chegou essa semana', qtd: 34 },
      { etapa: 'Voltou no culto',    qtd: 26 },
      { etapa: 'Entrou numa celula', qtd: 21 },
      { etapa: 'Batizou',            qtd: 7 },
    ],
  };

  // Celulas com posicao no mapa (coordenadas relativas 0..100 sobre o grid).
  const celulas = [
    { id: 'c1', nome: 'Celula Farol',       nucleo: 'louvor',      bairro: 'Campolim',    lider: 'Tiago e Rebeca',  membros: 14, x: 62, y: 40, dia: 'Terca 20h' },
    { id: 'c2', nome: 'Celula Videira',     nucleo: 'ministracao', bairro: 'Zona Norte',  lider: 'Marcos',          membros: 18, x: 44, y: 22, dia: 'Quarta 20h' },
    { id: 'c3', nome: 'Celula Rocha',       nucleo: 'acolhimento', bairro: 'Alem Ponte',  lider: 'Ana e Pedro',     membros: 11, x: 30, y: 52, dia: 'Quinta 20h' },
    { id: 'c4', nome: 'Celula Betel',       nucleo: 'tecnologia',  bairro: 'Eden',        lider: 'Lucas',           membros: 9,  x: 74, y: 64, dia: 'Sexta 20h' },
    { id: 'c5', nome: 'Celula Manancial',   nucleo: 'audiovisual', bairro: 'Wanel Ville', lider: 'Priscila',        membros: 13, x: 20, y: 74, dia: 'Terca 19h30' },
    { id: 'c6', nome: 'Celula Semear',      nucleo: 'ministracao', bairro: 'Aparecidinha',lider: 'Joao e Sara',     membros: 16, x: 56, y: 78, dia: 'Quarta 20h' },
    { id: 'c7', nome: 'Celula Nova Vida',   nucleo: 'louvor',      bairro: 'Vila Hortencia', lider: 'Gabriel',      membros: 12, x: 82, y: 32, dia: 'Quinta 20h' },
    { id: 'c8', nome: 'Celula Refugio',     nucleo: 'acolhimento', bairro: 'Jardim Vergueiro', lider: 'Marina',    membros: 10, x: 38, y: 40, dia: 'Sexta 19h30' },
  ];

  // Visitantes / acolhimento (o que chega do WhatsApp).
  const momentos = ['Primeira vez', 'Voltando a Deus', 'Passando por luto', 'Buscando celula', 'Novo convertido'];
  const visitantes = [
    { id: 'v1', nome: 'Camila Andrade',   telefone: '(15) 99123-4501', bairro: 'Campolim',    momento: 'Primeira vez',     status: 'novo',      celulaSugerida: 'c1', quando: 'ha 8 min',  ultima: 'Oi, fui no culto domingo e queria conhecer uma celula perto de casa.' },
    { id: 'v2', nome: 'Rafael Nunes',     telefone: '(15) 99230-7788', bairro: 'Zona Norte',  momento: 'Novo convertido',  status: 'acolhido',  celulaSugerida: 'c2', quando: 'ha 40 min', ultima: 'Aceitei Jesus ontem, o que eu faco agora?' },
    { id: 'v3', nome: 'Juliana Prado',   telefone: '(15) 99876-1020', bairro: 'Alem Ponte',  momento: 'Buscando celula',  status: 'novo',      celulaSugerida: 'c3', quando: 'ha 1 h',    ultima: 'Me mudei pra Sorocaba e quero uma igreja perto.' },
    { id: 'v4', nome: 'Diego Martins',    telefone: '(15) 99411-3322', bairro: 'Eden',        momento: 'Voltando a Deus',  status: 'novo',      celulaSugerida: 'c4', quando: 'ha 2 h',    ultima: 'Fiquei um tempo afastado e quero voltar.' },
    { id: 'v5', nome: 'Beatriz Rocha',    telefone: '(15) 99155-8890', bairro: 'Wanel Ville', momento: 'Passando por luto',status: 'visita',    celulaSugerida: 'c5', quando: 'ha 5 h',    ultima: 'Perdi meu pai essa semana, estou precisando de oracao.' },
    { id: 'v6', nome: 'Henrique Alves',   telefone: '(15) 99677-2201', bairro: 'Aparecidinha',momento: 'Primeira vez',     status: 'acolhido',  celulaSugerida: 'c6', quando: 'ontem',     ultima: 'Um amigo me chamou pro culto de jovens.' },
  ];

  // Roteiro simulado do agente de acolhimento (WhatsApp).
  const conversaAcolhimento = [
    { de: 'pessoa', txt: 'Oi, fui no culto domingo e queria conhecer uma celula perto de casa.', hora: '19:02' },
    { de: 'agente', txt: 'Que alegria te receber. Aqui e o acolhimento da Bola de Neve Sorocaba. Como voce se chama?', hora: '19:02' },
    { de: 'pessoa', txt: 'Camila', hora: '19:03' },
    { de: 'agente', txt: 'Seja muito bem-vinda, Camila. Voce chegou pela primeira vez ou ja conhecia a igreja?', hora: '19:03' },
    { de: 'pessoa', txt: 'Primeira vez, gostei bastante', hora: '19:04' },
    { de: 'agente', txt: 'Fico feliz demais. Me diz o bairro que voce mora que eu te mostro a celula mais pertinho.', hora: '19:04' },
    { de: 'pessoa', txt: 'Campolim', hora: '19:05' },
    { de: 'agente', txt: 'Tem a Celula Farol no Campolim, as tercas 20h, com o Tiago e a Rebeca. Posso avisar eles que voce vai?', hora: '19:05' },
  ];

  // Biblia: livros e um trecho carregado (Salmos 23) + Joao 1.
  const bibliaLivros = {
    antigo: ['Genesis', 'Exodo', 'Levitico', 'Numeros', 'Deuteronomio', 'Salmos', 'Proverbios', 'Isaias', 'Jeremias'],
    novo:   ['Mateus', 'Marcos', 'Lucas', 'Joao', 'Atos', 'Romanos', 'Corintios', 'Efesios', 'Apocalipse'],
  };
  const bibliaTexto = {
    livro: 'Salmos', capitulo: 23,
    versiculos: [
      { n: 1, txt: 'O Senhor e o meu pastor, nada me faltara.' },
      { n: 2, txt: 'Deitar-me faz em verdes pastos, guia-me mansamente a aguas tranquilas.' },
      { n: 3, txt: 'Refrigera a minha alma, guia-me pelas veredas da justica por amor do seu nome.' },
      { n: 4, txt: 'Ainda que eu andasse pelo vale da sombra da morte, nao temeria mal algum, porque tu estas comigo; a tua vara e o teu cajado me consolam.' },
      { n: 5, txt: 'Preparas uma mesa perante mim na presenca dos meus inimigos, unges a minha cabeca com oleo, o meu calice transborda.' },
      { n: 6, txt: 'Certamente que a bondade e a misericordia me seguirao todos os dias da minha vida, e habitarei na casa do Senhor por longos dias.' },
    ],
    // Leitura sob a otica de hoje (mock do agente da Biblia).
    oticaHoje: 'Davi escreve isso como pastor de ovelhas, entao ele sabe do que fala. O ponto nao e ausencia de vale escuro, e a presenca de quem caminha junto. Hoje: quando o dia aperta, a promessa nao e uma vida sem sombra, e um Deus que nao larga a sua mao no meio dela.',
  };

  // Devocionais gerados a partir de versiculos grifados.
  const devocionais = [
    { id: 'd1', titulo: 'O pastor que vai atras', ref: 'Salmos 23.4', trecho: 'a tua vara e o teu cajado me consolam', corpo: 'O cajado nao empurra, ele resgata. Deus nao te acompanha de longe: ele desce ao vale com voce. Onde voce tem sentido a mao dele hoje?', data: 'Hoje', lido: false },
    { id: 'd2', titulo: 'Aguas tranquilas', ref: 'Salmos 23.2', trecho: 'guia-me mansamente a aguas tranquilas', corpo: 'Descanso nao e premio por produtividade, e cuidado do pastor. Reserve cinco minutos hoje so para respirar diante de Deus.', data: 'Ontem', lido: true },
    { id: 'd3', titulo: 'Nada me faltara', ref: 'Salmos 23.1', trecho: 'nada me faltara', corpo: 'Falta nao e ausencia de tudo, e confianca de que o essencial esta garantido. O que voce pode entregar hoje?', data: 'Ha 2 dias', lido: true },
  ];

  const planos = [
    { id: 'p1', nome: 'Salmos em 30 dias', progresso: 12, total: 30, ativo: true },
    { id: 'p2', nome: 'Quem e Jesus (Joao)', progresso: 4, total: 21, ativo: false },
    { id: 'p3', nome: 'Primeiros passos na fe', progresso: 7, total: 14, ativo: false },
  ];

  // Contribua / Faca Parte (campanha Em Marcha da igreja). Dados do cartaz oficial.
  const contribuicao = {
    campanha: 'Em Marcha',
    lema: 'Juntos rumo a promessa',
    grito: ['Nao paramos.', 'Nao voltamos.', 'Estamos em marcha.'],
    texto: 'Esse e o chamado de uma igreja que decidiu continuar avancando em unidade, fe e obediencia a direcao de Deus. Estamos vivendo um tempo de travessia, crescimento e construcao. Como povo, seguimos juntos rumo a promessa, confiando que aquele que comecou a obra e fiel para completar.',
    chamada: 'Contribua com seus dizimos e ofertas para o avanco da igreja.',
    pixTipo: 'CNPJ',
    pixChave: 'tesouraria.sorocaba@boladeneve.com',
    banco: { titular: 'Igreja Bola de Neve Sorocaba', agencia: '3393-6', conta: '132484-5' },
  };

  // Ambientes do ecossistema (usado no hub e na sidebar).
  const ambientes = [
    { id: 'painel',      rota: 'painel',      nome: 'Painel',       icon: 'LayoutDashboard', desc: 'O olhar do pastor sobre o rebanho inteiro, em numeros vivos.' },
    { id: 'acolhimento', rota: 'acolhimento', nome: 'Acolhimento',  icon: 'Inbox',           desc: 'Cada visitante recebido no WhatsApp e conectado a uma celula.' },
    { id: 'celulas',     rota: 'celulas',     nome: 'Mapa',         icon: 'MapPin',          desc: 'A geografia do rebanho: onde cada pessoa esta.' },
    { id: 'biblia',      rota: 'biblia',      nome: 'Biblia',       icon: 'BookOpen',        desc: 'A Palavra no dia a dia: leitura, grifos e devocional.' },
    { id: 'devocionais', rota: 'devocionais', nome: 'Devocionais',  icon: 'Sparkles',        desc: 'A caminhada com Deus: planos e reflexao gerada da leitura.' },
    { id: 'contribua',   rota: 'contribua',   nome: 'Contribua',    icon: 'HeartHandshake',  desc: 'Faca parte da campanha Em Marcha com seus dizimos e ofertas.' },
  ];

  return {
    igreja, nucleos, nucleoById, painel, celulas, visitantes, momentos,
    conversaAcolhimento, bibliaLivros, bibliaTexto, devocionais, planos, contribuicao, ambientes,
  };
})();
