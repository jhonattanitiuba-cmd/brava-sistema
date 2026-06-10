// Valida que os blocos <script type="text/babel"> inline compilam (pega erro de sintaxe JSX).
const fs = require('fs');
const path = require('path');

const Babel = require('@babel/standalone');

const file = path.join(__dirname, '..', 'admin', 'index.html');
const html = fs.readFileSync(file, 'utf8');

// Captura TODOS os <script type="text/babel"> SEM atributo src (blocos inline).
const re = /<script\b[^>]*type=["']text\/babel["'][^>]*>([\s\S]*?)<\/script>/gi;
let m, idx = 0, erros = 0;
while ((m = re.exec(html)) !== null) {
  const full = m[0];
  if (/\bsrc=/.test(full.slice(0, full.indexOf('>')))) continue; // pula os com src
  idx++;
  const code = m[1];
  // linha onde o bloco começa no HTML (pra mapear o erro)
  const startLine = html.slice(0, m.index).split('\n').length;
  try {
    Babel.transform(code, { presets: ['react'], filename: `inline-${idx}.jsx` });
    console.log(`OK   bloco inline #${idx} (inicia na linha ${startLine} do HTML) — ${code.split('\n').length} linhas compilam`);
  } catch (e) {
    erros++;
    const loc = e.loc ? ` [linha ${startLine + e.loc.line - 1}, col ${e.loc.column}]` : '';
    console.log(`ERRO bloco inline #${idx}${loc}: ${e.message.split('\n')[0]}`);
  }
}
if (idx === 0) console.log('Nenhum bloco inline text/babel encontrado.');
console.log(erros === 0 ? '\n==> TUDO OK: JSX compila sem erros de sintaxe.' : `\n==> ${erros} bloco(s) com erro.`);
process.exit(erros === 0 ? 0 : 1);
