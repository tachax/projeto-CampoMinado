var tabuleiro = [];
const linhas = 8;
const colunas = 10;
const bombas = 10;
const maxJogadas = linhas * colunas - bombas;
var PRIMEIROCLIQUE = true;
var jogadas = 0;
var identLin;
var identCol;
var jaClicados = [];

//inserindo a tabela
function montarTabuleiro() {

  //inserindo a qnt de linhas e colunas
  for (let i = 0; i < linhas; i++) {
    //linha
    tabuleiro[tabuleiro.length] = [];
    document.getElementById('tabela').innerHTML += `<tr id="linha${i}"></tr>`;

    for (let j = 0; j < colunas; j++) {
      //coluna c/ os números
      tabuleiro[i][j] = 0;
      document.getElementById(`linha${i}`).innerHTML += `<td><button onclick="jogada('${String(i)}l${String(j)}c')" id="${String(i)}l${String(j)}c"></button></td>`;
    }
  }

  //trocar display das divs
  document.getElementById('preparado').style.display = 'none';
  document.getElementById('jogo').style.display = 'flex';
}


//trocar de nivel
function trocarNiveis() {
  var niveis;
  niveis = document.getElementById('niveis').value

  if (niveis == 'facil') {
    location.href = '../facil/facil.html'
  } else if (niveis == 'intermed') {
    location.href = '../intermediario/intermediario.html'
  } else if (niveis == 'dificil') {
    location.href = '../dificil/dificil.html'
  }
}

//cada botao em cada jogada
function jogada(ident) {
  //sempre que clica muda a cor do botão
  document.getElementById(ident).style.background = "white"
  console.log(ident)

  //arruma o indice da matriz
  indiceMatriz(ident)

  //só gerar bombas no primeiro clique
  if (PRIMEIROCLIQUE) {
    start()
    gerarBombas()
    mapearBombas()
    console.log(tabuleiro)
    PRIMEIROCLIQUE = false;
  }

  //verificar o quadrado que clicou
  localClicado(ident)
  document.getElementById(ident).disabled = true;
}

//arrumar o id para pegar os elementos da matriz corretamente
function indiceMatriz(ident) {
  identLin = '';
  identCol = '';

  //arrumar o id da linha/coluna
  for (let i = 0; i < ident.length; i++) {

    if (ident[i] == 'l') {
      //linha
      for (let j = 0; j < i; j++) {
        identLin += ident[j]
        console.log(identLin)
      }

      //coluna
      for (let j = i + 1; j < ident.length - 1; j++) {
        identCol += ident[j]
        console.log(identCol)
      }

    }
  }
}

//gerar bombas
function gerarBombas() {
  identLin = Number(identLin)
  identCol = Number(identCol)

  for (var i = 0; i < bombas; i++) {
    var numLinha = Math.floor((Math.random() * linhas));
    var numColuna = Math.floor((Math.random() * colunas));

    //confere se já é uma bomba ou o número clicado && não deixa colocar bombas ao redor do bt clicado
    while (tabuleiro[numLinha][numColuna] === -1 ||
      (numLinha == identLin - 1 && numColuna == identCol - 1) || (numLinha == identLin - 1 && numColuna == identCol) || (numLinha == identLin - 1 && numColuna == identCol + 1) ||
      (numLinha == identLin && numColuna == identCol - 1) || (numLinha == identLin && numColuna == identCol) || (numLinha == identLin && numColuna == identCol + 1) ||
      (numLinha == identLin + 1 && numColuna == identCol - 1) || (numLinha == identLin + 1 && numColuna == identCol) || (numLinha == identLin + 1 && numColuna == identCol + 1)) {
      numLinha = Math.floor((Math.random() * linhas));
      numColuna = Math.floor((Math.random() * colunas));
    }

    tabuleiro[numLinha][numColuna] = -1;
  }
  console.log(tabuleiro)
}

//gerar números próx bomba
function mapearBombas() {
  var qntBombas = 0;
  var indice0;
  var indice1;

  indice0 = 0
  while (indice0 < linhas) {

    //vai em cada coluna
    indice1 = 0
    while (indice1 < colunas) {
      qntBombas = 0;

      //ve se já é uma bomba, para não alterar seu valor
      if (tabuleiro[indice0][indice1] == -1) {
        indice1++;

      } else {
        //vai girando ao redor de cada 'quadrado'
        bombasAoRedor(indice0, indice1, qntBombas)

        indice1++;
      }

    }
    indice0++;
  }
}

//verifica as bombas ao redor
function bombasAoRedor(indice0, indice1, qntBombas) {
  //vê se é a primeira linha pra não dar erro
  if (indice0 == 0) {
    for (let i = indice0; i < indice0 + 2; i++) {
      for (let j = indice1 - 1; j < indice1 + 2; j++) {
        if (tabuleiro[i][j] === -1) {
          qntBombas++
        }
      }
    }

    //vê se é a última linha pra não dar erro
  } else if (indice0 == tabuleiro.length - 1) {
    for (let i = indice0 - 1; i < indice0 + 1; i++) {
      for (let j = indice1 - 1; j < indice1 + 2; j++) {
        if (tabuleiro[i][j] === -1) {
          qntBombas++
        }
      }
    }

    //linhas restantes
  } else {
    for (let i = indice0 - 1; i < indice0 + 2; i++) {
      for (let j = indice1 - 1; j < indice1 + 2; j++) {
        if (tabuleiro[i][j] === -1) {
          qntBombas++
        }
      }
    }
  }
  tabuleiro[indice0][indice1] = qntBombas;
}

//varrer ao redor do quadrado vazio
function redorDoVazio() {
  // debugger
  var zerosAchados = [];
  identLin = Number(identLin)
  identCol = Number(identCol)

  //verifica se é a primeira linha do tabuleiro
  if (identLin == 0) {
    for (let i = identLin; i < identLin + 2; i++) {
      console.log('i ' + i)
      redorDoVazioColunas(i, zerosAchados)
    }

    //verifica se é a última linha do tabuleiro
  } else if (identLin == tabuleiro.length - 1) {
    for (let i = identLin - 1; i < identLin + 1; i++) {
      console.log('i ' + i)
      redorDoVazioColunas(i, zerosAchados)
    }

    //restante das linhas
  } else {
    for (let i = identLin - 1; i < identLin + 2; i++) {
      console.log('i ' + i)
      redorDoVazioColunas(i, zerosAchados)
    }
  }

  outroZero(zerosAchados)
}

//pra poupas linhas
function redorDoVazioColunas(i, zerosAchados) {
  var revelarNum;
  let tem;
  tem = false;
  var numeros = '12345678'

  for (let j = identCol - 1; j < identCol + 2; j++) {
    console.log('j ' + j)

    if (j != identCol || i != identLin) {

      if (tabuleiro[i][j] == 0) {
        console.log('tem 0 ao redor')
        //remonta o id do botão
        revelarNum = String(i) + 'l' + String(j) + 'c'
        zerosAchados[zerosAchados.length] = revelarNum;
        console.log('achados ' + zerosAchados)
        verificarClicados(i, j, revelarNum)

      } else {

        for (let k = 0; k < numeros.length; k++) {
          if (tabuleiro[i][j] == numeros[k]) {
            console.log('tem num ao redor')
            revelarNum = String(i) + 'l' + String(j) + 'c'
            verificarClicados(i, j, revelarNum)

          }
        }
      }
    }
  }
}

function outroZero(zerosAchados) {
  let f = 0;
  while (zerosAchados != []) {
    console.log('zero i ' + f)


    ident = zerosAchados[f]

    indiceMatriz(ident)

    console.log(identLin)
    console.log(identCol)
    console.log('teste')
    zerosAchados.shift();
    redorDoVazio()

    f++
  }
}

//verificar os numeros ja clicados para não repetir na array
function verificarClicados(i, j, revelarNum) {
  let tem;
  tem = false;

  console.log(revelarNum)

  //verifica se o achado já foi encontrado antes
  if (jaClicados.includes(revelarNum)) {
    tem = true;
  }

  if (!tem) {
    jaClicados[jaClicados.length] = revelarNum;
    document.getElementById(revelarNum).innerText = tabuleiro[i][j];
    document.getElementById(revelarNum).style.background = "white";
    document.getElementById(revelarNum).disabled = true;
    jogadas++;
  }
}


//verificar se clicou em bomba ou em número ! 0
function localClicado(ident) {
  //verifica se o botão clicado é um número e mostra ele
  if (tabuleiro[identLin][identCol] != -1 || tabuleiro[identLin][identCol] != 0) {
    document.getElementById(ident).innerText = tabuleiro[identLin][identCol];
    jaClicados[jaClicados.length] = ident;
    jogadas++;
  }

  //verificar se clicou no 0 p/ expandir
  if (tabuleiro[identLin][identCol] == 0) {
    //ta verificando que é 0 || entrando aqui
    redorDoVazio()
  }

  //verifica se clicou na bomba e perde
  if (tabuleiro[identLin][identCol] == -1) {
    location.href = '../loser/loser.html'
  }

  //verifica se achou todos os quadrados sem bomba e ganha
  if (jogadas == maxJogadas) {
    stop()
  }

  console.log(jaClicados)
}

//CRONOMETRO 
"use strict"

var min = 0;
var seg = 0;

var tempo = 1000; //quantos milesimos equivalem a um segundo
var cron;
var parou;
var format;

//primeiro clique no tabuleiro
function start() {
  cron = setInterval(() => { timer(); }, tempo)
}

function stop() {
  clearInterval(cron)
  document.getElementById('tempo').innerText += ` ${format}`
  document.getElementById('jogo').style.display = 'none'
  document.getElementById('tela').style.display = 'flex'
}

function timer() {
  seg++;

  if (seg == 60) {
    seg = 0;
    min++;
  }

  format = (min < 10 ? '0' + min : min) + ':' + (seg < 10 ? '0' + seg : seg)
  document.getElementById('counter').innerText = format
}