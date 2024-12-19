const readline = require('readline');
const Table = require('cli-table');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const alunos = [];

function adicionarAluno(nome, nota) {
  alunos.push({ nome, nota });
}

function exibirTabela() {
  console.clear();
  const table = new Table({
    head: ['Nome', 'Nota'],
    colWidths: [30, 10]
  });

  alunos.sort((a, b) => b.nota - a.nota).forEach(aluno => {
    table.push([aluno.nome, aluno.nota.toFixed(1)]);
  });

  console.log(table.toString());

  if (alunos.length > 0) {
    const melhorNota = Math.max(...alunos.map(aluno => aluno.nota));
    const piorNota = Math.min(...alunos.map(aluno => aluno.nota));
    console.log(`\nMelhor Nota: ${melhorNota.toFixed(1)}`);
    console.log(`Pior Nota: ${piorNota.toFixed(1)}`);
  }
}

function padronizarNome(nome) {
  return nome.split(' ')
    .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
    .join(' ');
}

function perguntarNota(nome) {
  rl.question('Digite a nota do estudante: ', (nota) => {
    // Substitui vírgula por ponto
    nota = nota.replace(',', '.');
    let estudanteNotas = parseFloat(nota);

    if (isNaN(estudanteNotas) || estudanteNotas < 0 || estudanteNotas > 10) {
      console.log('Erro: A nota deve ser um número entre 0 e 10.');
      return perguntarNota(nome);
    }

    adicionarAluno(nome, estudanteNotas);

    let estudanteAprovado = estudanteNotas >= 7;

    if (estudanteAprovado) {
      console.log(`${nome} foi aprovado(a)`);
      console.log(`Parabéns ${nome}!`);
    } else {
      console.log(`${nome} foi reprovado(a)`);
      console.log(`Estude mais ${nome}!`);
    }

    rl.question('Deseja adicionar outro aluno? (s/n): ', (resposta) => {
      if (resposta.toLowerCase() === 's') {
        perguntarNome();
      } else if (resposta.toLowerCase() === 'n') {
        exibirTabela();
        rl.close();
      } else {
        console.log('Resposta inválida. Por favor, digite "s" para sim ou "n" para não.');
        rl.question('Deseja adicionar outro aluno? (s/n): ', (resposta) => {
          if (resposta.toLowerCase() === 's') {
            perguntarNome();
          } else if (resposta.toLowerCase() === 'n') {
            exibirTabela();
            rl.close();
          } else {
            console.log('Resposta inválida. Encerrando o programa.');
            rl.close();
          }
        });
      }
    });
  });
}

function perguntarNome() {
  rl.question('Digite o nome do estudante: ', (nome) => {
    if (!isNaN(nome)) {
      console.log('Erro: O nome deve ser uma string.');
      return perguntarNome();
    }

    nome = padronizarNome(nome);
    perguntarNota(nome);
  });
}

perguntarNome();