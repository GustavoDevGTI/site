/* ══════════════════════════════════════════════════════
   HABILIDADES
══════════════════════════════════════════════════════ */
var listaHabilidades = [
  { nome: 'HTML & CSS',  nivelPorcentagem: 95 },
  { nome: 'JavaScript', nivelPorcentagem: 90 },
  { nome: 'React',       nivelPorcentagem: 82 },
  { nome: 'Node.js',     nivelPorcentagem: 78 },
  { nome: 'Python',      nivelPorcentagem: 70 },
  { nome: 'Git',         nivelPorcentagem: 88 },
  { nome: 'UI / UX',     nivelPorcentagem: 75 },
  { nome: 'APIs REST',   nivelPorcentagem: 85 },
];

var elementoGrade = document.getElementById('gradeHabilidades');

listaHabilidades.forEach(function(habilidade) {
  var itemDiv   = document.createElement('div');
  itemDiv.className = 'item-habilidade';

  var nomeSpan  = document.createElement('span');
  nomeSpan.className   = 'item-habilidade-nome';
  nomeSpan.textContent = habilidade.nome;

  var nivelDiv  = document.createElement('div');
  nivelDiv.className = 'item-habilidade-nivel';

  var barraDiv  = document.createElement('div');
  barraDiv.className = 'item-habilidade-nivel-barra';
  barraDiv.style.setProperty('--largura', habilidade.nivelPorcentagem + '%');

  nivelDiv.appendChild(barraDiv);
  itemDiv.appendChild(nomeSpan);
  itemDiv.appendChild(nivelDiv);
  elementoGrade.appendChild(itemDiv);
});

var observadorHabilidades = new IntersectionObserver(function(entradas) {
  entradas.forEach(function(entrada) {
    if (entrada.isIntersecting) {
      var barras = entrada.target.querySelectorAll('.item-habilidade-nivel-barra');
      barras.forEach(function(barra) {
        var largura = getComputedStyle(barra).getPropertyValue('--largura').trim();
        barra.style.width = largura;
      });
    }
  });
}, { threshold: 0.2 });

observadorHabilidades.observe(elementoGrade);

/* ══════════════════════════════════════════════════════
   CURSOR PERSONALIZADO
══════════════════════════════════════════════════════ */
var elementoCursor     = document.getElementById('cursor');
var elementoCursorAnel = document.getElementById('cursor-anel');
var posicaoX = 0, posicaoY = 0;
var anelX    = 0, anelY    = 0;

document.addEventListener('mousemove', function(evento) {
  posicaoX = evento.clientX;
  posicaoY = evento.clientY;
  elementoCursor.style.left = posicaoX + 'px';
  elementoCursor.style.top  = posicaoY + 'px';
});

function animarAnel() {
  anelX += (posicaoX - anelX) * 0.12;
  anelY += (posicaoY - anelY) * 0.12;
  elementoCursorAnel.style.left = anelX + 'px';
  elementoCursorAnel.style.top  = anelY + 'px';
  requestAnimationFrame(animarAnel);
}
animarAnel();

document.addEventListener('mouseover', function(evento) {
  var alvo = evento.target;
  if (alvo.tagName === 'A' || alvo.tagName === 'BUTTON' ||
      alvo.classList.contains('celula-velha') ||
      alvo.classList.contains('casa-xadrez')) {
    elementoCursor.style.width  = '18px';
    elementoCursor.style.height = '18px';
    elementoCursorAnel.style.width  = '52px';
    elementoCursorAnel.style.height = '52px';
  } else {
    elementoCursor.style.width  = '10px';
    elementoCursor.style.height = '10px';
    elementoCursorAnel.style.width  = '36px';
    elementoCursorAnel.style.height = '36px';
  }
});

/* ── Animação de entrada das seções ── */
var todasAsSecoes = document.querySelectorAll('.secao');
var observadorEntrada = new IntersectionObserver(function(entradas) {
  entradas.forEach(function(entrada) {
    if (entrada.isIntersecting) {
      entrada.target.style.opacity   = '1';
      entrada.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

todasAsSecoes.forEach(function(secao) {
  secao.style.opacity    = '0';
  secao.style.transform  = 'translateY(24px)';
  secao.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  observadorEntrada.observe(secao);
});

/* ══════════════════════════════════════════════════════
   JOGO DA VELHA
══════════════════════════════════════════════════════ */
var estadoVelha = {
  tabuleiro: Array(9).fill(null),  // null | 'X' | 'O'
  jogadorAtual: 'X',
  jogoAcabou: false,
  placar: { X: 0, O: 0, empate: 0 },
};

var combinacoesVitoria = [
  [0,1,2], [3,4,5], [6,7,8],  // linhas
  [0,3,6], [1,4,7], [2,5,8],  // colunas
  [0,4,8], [2,4,6],           // diagonais
];

var elementoTabuleiroVelha = document.getElementById('tabuleiroVelha');
var elementoStatusVelha    = document.getElementById('statusVelha');
var elementoPlacarX        = document.getElementById('placarX');
var elementoPlacarO        = document.getElementById('placarO');
var elementoPlacarEmpate   = document.getElementById('placarEmpate');

function verificarVitoria(tabuleiro) {
  for (var i = 0; i < combinacoesVitoria.length; i++) {
    var combo = combinacoesVitoria[i];
    if (tabuleiro[combo[0]] &&
        tabuleiro[combo[0]] === tabuleiro[combo[1]] &&
        tabuleiro[combo[0]] === tabuleiro[combo[2]]) {
      return combo;
    }
  }
  return null;
}

function renderizarTabuleiroVelha() {
  elementoTabuleiroVelha.innerHTML = '';
  var combinacaoVencedora = verificarVitoria(estadoVelha.tabuleiro);

  estadoVelha.tabuleiro.forEach(function(valor, indice) {
    var celula = document.createElement('div');
    celula.className = 'celula-velha';

    if (valor) {
      celula.classList.add('ocupada');
      celula.classList.add(valor === 'X' ? 'simbolo-x' : 'simbolo-o');
      celula.textContent = valor;
    }

    if (combinacaoVencedora && combinacaoVencedora.includes(indice)) {
      celula.classList.add('vitoriosa');
    }

    celula.addEventListener('click', function() {
      clicarCelulaVelha(indice);
    });

    elementoTabuleiroVelha.appendChild(celula);
  });
}

function clicarCelulaVelha(indice) {
  if (estadoVelha.jogoAcabou || estadoVelha.tabuleiro[indice]) return;

  estadoVelha.tabuleiro[indice] = estadoVelha.jogadorAtual;

  var combinacaoVencedora = verificarVitoria(estadoVelha.tabuleiro);

  if (combinacaoVencedora) {
    estadoVelha.jogoAcabou = true;
    estadoVelha.placar[estadoVelha.jogadorAtual]++;
    elementoStatusVelha.textContent = 'Jogador ' + estadoVelha.jogadorAtual + ' venceu! 🎉';
    atualizarPlacarVelha();
  } else if (estadoVelha.tabuleiro.every(function(c) { return c !== null; })) {
    estadoVelha.jogoAcabou = true;
    estadoVelha.placar.empate++;
    elementoStatusVelha.textContent = 'Empate!';
    atualizarPlacarVelha();
  } else {
    estadoVelha.jogadorAtual = estadoVelha.jogadorAtual === 'X' ? 'O' : 'X';
    elementoStatusVelha.textContent = 'Vez do jogador ' + estadoVelha.jogadorAtual;
  }

  renderizarTabuleiroVelha();
}

function atualizarPlacarVelha() {
  elementoPlacarX.textContent      = estadoVelha.placar.X;
  elementoPlacarO.textContent      = estadoVelha.placar.O;
  elementoPlacarEmpate.textContent = estadoVelha.placar.empate;
}

function reiniciarVelha() {
  estadoVelha.tabuleiro    = Array(9).fill(null);
  estadoVelha.jogadorAtual = 'X';
  estadoVelha.jogoAcabou   = false;
  elementoStatusVelha.textContent = 'Vez do jogador X';
  renderizarTabuleiroVelha();
}

document.getElementById('btnReiniciarVelha').addEventListener('click', reiniciarVelha);
renderizarTabuleiroVelha();

/* ══════════════════════════════════════════════════════
   XADREZ
══════════════════════════════════════════════════════ */

/* ── Símbolos Unicode das peças ── */
var PECAS = {
  branca: { rei: '♔', rainha: '♕', torre: '♖', bispo: '♗', cavalo: '♘', peao: '♙' },
  preta:  { rei: '♚', rainha: '♛', torre: '♜', bispo: '♝', cavalo: '♞', peao: '♟' },
};

/* ── Representação interna de uma peça ── */
// { tipo: 'peao'|'torre'|'cavalo'|'bispo'|'rainha'|'rei', cor: 'branca'|'preta', moveu: bool }

function criarPeca(tipo, cor) {
  return { tipo: tipo, cor: cor, moveu: false };
}

/* ── Estado do xadrez ── */
var estadoXadrez = {
  tabuleiro: [],         // array 8x8 de peças ou null
  turno: 'branca',
  casaSelecionada: null, // { linha, coluna }
  movimentosValidos: [], // [{linha, coluna}]
  capturadas: { branca: [], preta: [] },
  jogoAcabou: false,
  enPassantAlvo: null,   // { linha, coluna } ou null
};

function criarTabuleiroInicial() {
  var tab = [];
  for (var l = 0; l < 8; l++) {
    tab.push(Array(8).fill(null));
  }

  var ordemPecas = ['torre','cavalo','bispo','rainha','rei','bispo','cavalo','torre'];

  for (var c = 0; c < 8; c++) {
    tab[0][c] = criarPeca(ordemPecas[c], 'preta');
    tab[1][c] = criarPeca('peao', 'preta');
    tab[6][c] = criarPeca('peao', 'branca');
    tab[7][c] = criarPeca(ordemPecas[c], 'branca');
  }
  return tab;
}

/* ── Geração de movimentos ── */
function dentroDeTabuleiro(linha, coluna) {
  return linha >= 0 && linha < 8 && coluna >= 0 && coluna < 8;
}

function movimentosBrutoPeca(tabuleiro, linha, coluna, enPassantAlvo) {
  var peca = tabuleiro[linha][coluna];
  if (!peca) return [];
  var movimentos = [];
  var cor = peca.cor;
  var adversaria = cor === 'branca' ? 'preta' : 'branca';

  function adicionarSeValido(l, c) {
    if (!dentroDeTabuleiro(l, c)) return false;
    var alvo = tabuleiro[l][c];
    if (!alvo) { movimentos.push({ linha: l, coluna: c }); return true; }
    if (alvo.cor === adversaria) { movimentos.push({ linha: l, coluna: c }); return false; }
    return false;
  }

  function varredura(direcoes) {
    direcoes.forEach(function(dir) {
      var l = linha + dir[0], c = coluna + dir[1];
      while (dentroDeTabuleiro(l, c)) {
        var alvo = tabuleiro[l][c];
        if (!alvo) { movimentos.push({ linha: l, coluna: c }); }
        else {
          if (alvo.cor === adversaria) movimentos.push({ linha: l, coluna: c });
          break;
        }
        l += dir[0]; c += dir[1];
      }
    });
  }

  if (peca.tipo === 'peao') {
    var direcao = cor === 'branca' ? -1 : 1;
    var linhaInicial = cor === 'branca' ? 6 : 1;
    // Avançar 1
    if (dentroDeTabuleiro(linha + direcao, coluna) && !tabuleiro[linha + direcao][coluna]) {
      movimentos.push({ linha: linha + direcao, coluna: coluna });
      // Avançar 2 no início
      if (linha === linhaInicial && !tabuleiro[linha + 2 * direcao][coluna]) {
        movimentos.push({ linha: linha + 2 * direcao, coluna: coluna });
      }
    }
    // Captura diagonal
    [-1, 1].forEach(function(dc) {
      var nl = linha + direcao, nc = coluna + dc;
      if (dentroDeTabuleiro(nl, nc)) {
        if (tabuleiro[nl][nc] && tabuleiro[nl][nc].cor === adversaria) {
          movimentos.push({ linha: nl, coluna: nc });
        }
        // En passant
        if (enPassantAlvo && enPassantAlvo.linha === nl && enPassantAlvo.coluna === nc) {
          movimentos.push({ linha: nl, coluna: nc });
        }
      }
    });
  }

  else if (peca.tipo === 'torre') {
    varredura([[1,0],[-1,0],[0,1],[0,-1]]);
  }
  else if (peca.tipo === 'bispo') {
    varredura([[1,1],[1,-1],[-1,1],[-1,-1]]);
  }
  else if (peca.tipo === 'rainha') {
    varredura([[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]);
  }
  else if (peca.tipo === 'cavalo') {
    [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]].forEach(function(d) {
      adicionarSeValido(linha + d[0], coluna + d[1]);
    });
  }
  else if (peca.tipo === 'rei') {
    [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]].forEach(function(d) {
      adicionarSeValido(linha + d[0], coluna + d[1]);
    });
    // Roque
    if (!peca.moveu) {
      // Roque pequeno
      if (tabuleiro[linha][7] && tabuleiro[linha][7].tipo === 'torre' && !tabuleiro[linha][7].moveu &&
          !tabuleiro[linha][5] && !tabuleiro[linha][6]) {
        movimentos.push({ linha: linha, coluna: 6, roque: 'pequeno' });
      }
      // Roque grande
      if (tabuleiro[linha][0] && tabuleiro[linha][0].tipo === 'torre' && !tabuleiro[linha][0].moveu &&
          !tabuleiro[linha][1] && !tabuleiro[linha][2] && !tabuleiro[linha][3]) {
        movimentos.push({ linha: linha, coluna: 2, roque: 'grande' });
      }
    }
  }

  return movimentos;
}

function encontrarRei(tabuleiro, cor) {
  for (var l = 0; l < 8; l++) {
    for (var c = 0; c < 8; c++) {
      var p = tabuleiro[l][c];
      if (p && p.tipo === 'rei' && p.cor === cor) return { linha: l, coluna: c };
    }
  }
  return null;
}

function corEmXeque(tabuleiro, cor, enPassantAlvo) {
  var posRei = encontrarRei(tabuleiro, cor);
  if (!posRei) return false;
  var adversaria = cor === 'branca' ? 'preta' : 'branca';
  for (var l = 0; l < 8; l++) {
    for (var c = 0; c < 8; c++) {
      var p = tabuleiro[l][c];
      if (p && p.cor === adversaria) {
        var movs = movimentosBrutoPeca(tabuleiro, l, c, enPassantAlvo);
        for (var i = 0; i < movs.length; i++) {
          if (movs[i].linha === posRei.linha && movs[i].coluna === posRei.coluna) return true;
        }
      }
    }
  }
  return false;
}

function clonarTabuleiro(tabuleiro) {
  return tabuleiro.map(function(linha) {
    return linha.map(function(peca) {
      return peca ? Object.assign({}, peca) : null;
    });
  });
}

function movimentosLegaisXadrez(tabuleiro, linha, coluna, enPassantAlvo) {
  var brutos = movimentosBrutoPeca(tabuleiro, linha, coluna, enPassantAlvo);
  var peca   = tabuleiro[linha][coluna];
  return brutos.filter(function(mov) {
    var copia = clonarTabuleiro(tabuleiro);
    copia[mov.linha][mov.coluna] = copia[linha][coluna];
    copia[linha][coluna] = null;
    return !corEmXeque(copia, peca.cor, null);
  });
}

/* ── Renderização ── */
var elementoTabuleiroXadrez  = document.getElementById('tabuleiroXadrez');
var elementoStatusXadrez     = document.getElementById('statusXadrez');
var elementoXadrezTurno      = document.getElementById('xadrezTurno');
var elementoCapBrancas       = document.getElementById('captuaradasBrancas');
var elementoCapPretas        = document.getElementById('captuaradasPretas');

function simboloPeca(peca) {
  return PECAS[peca.cor][peca.tipo];
}

function renderizarTabuleiroXadrez() {
  var tab  = estadoXadrez.tabuleiro;
  var sel  = estadoXadrez.casaSelecionada;
  var movs = estadoXadrez.movimentosValidos;

  elementoTabuleiroXadrez.innerHTML = '';

  for (var l = 0; l < 8; l++) {
    for (var c = 0; c < 8; c++) {
      var casa = document.createElement('div');
      casa.className = 'casa-xadrez ' + ((l + c) % 2 === 0 ? 'casa-clara' : 'casa-escura');
      casa.dataset.linha  = l;
      casa.dataset.coluna = c;

      var peca = tab[l][c];

      // Destaque seleção
      if (sel && sel.linha === l && sel.coluna === c) {
        casa.classList.add('casa-selecionada');
      }

      // Destaque movimentos válidos
      var ehMovValido = movs.some(function(m) { return m.linha === l && m.coluna === c; });
      if (ehMovValido) {
        if (peca && peca.cor !== (estadoXadrez.turno)) {
          casa.classList.add('casa-captura-valida');
        } else {
          casa.classList.add('casa-movimento-valido');
        }
      }

      // Xeque
      if (peca && peca.tipo === 'rei' && peca.cor === estadoXadrez.turno) {
        if (corEmXeque(tab, estadoXadrez.turno, estadoXadrez.enPassantAlvo)) {
          casa.classList.add('casa-em-xeque');
        }
      }

      if (peca) {
        var spanPeca = document.createElement('span');
        spanPeca.textContent = simboloPeca(peca);
        spanPeca.className   = peca.cor === 'branca' ? 'peca-branca' : 'peca-preta';
        casa.appendChild(spanPeca);
      }

      casa.addEventListener('click', clicarCasaXadrez);
      elementoTabuleiroXadrez.appendChild(casa);
    }
  }

  // Turno
  var iconeTurno = estadoXadrez.turno === 'branca' ? '♙' : '♟';
  var nomeTurno  = estadoXadrez.turno === 'branca' ? 'das Brancas' : 'das Pretas';
  elementoXadrezTurno.textContent = iconeTurno + ' Vez ' + nomeTurno;

  // Capturadas
  elementoCapBrancas.textContent = estadoXadrez.capturadas.branca.map(simboloPeca).join(' ');
  elementoCapPretas.textContent  = estadoXadrez.capturadas.preta.map(simboloPeca).join(' ');
}

function renderizarCoordenadas() {
  var letras  = ['a','b','c','d','e','f','g','h'];
  var numeros = ['8','7','6','5','4','3','2','1'];

  var containerLetras  = document.getElementById('coordLetras');
  var containerNumeros = document.getElementById('coordNumeros');

  letras.forEach(function(letra) {
    var label = document.createElement('div');
    label.className   = 'coord-label';
    label.textContent = letra;
    containerLetras.appendChild(label);
  });

  numeros.forEach(function(num) {
    var label = document.createElement('div');
    label.className   = 'coord-label';
    label.textContent = num;
    containerNumeros.appendChild(label);
  });
}

function clicarCasaXadrez(evento) {
  if (estadoXadrez.jogoAcabou) return;

  var casa   = evento.currentTarget;
  var linha  = parseInt(casa.dataset.linha);
  var coluna = parseInt(casa.dataset.coluna);
  var tab    = estadoXadrez.tabuleiro;
  var peca   = tab[linha][coluna];
  var sel    = estadoXadrez.casaSelecionada;

  // Clicou em movimento válido
  if (sel) {
    var movEscolhido = estadoXadrez.movimentosValidos.find(function(m) {
      return m.linha === linha && m.coluna === coluna;
    });

    if (movEscolhido) {
      executarMovimento(sel.linha, sel.coluna, linha, coluna, movEscolhido);
      return;
    }
  }

  // Selecionar peça da cor do turno
  if (peca && peca.cor === estadoXadrez.turno) {
    estadoXadrez.casaSelecionada   = { linha: linha, coluna: coluna };
    estadoXadrez.movimentosValidos = movimentosLegaisXadrez(tab, linha, coluna, estadoXadrez.enPassantAlvo);
    elementoStatusXadrez.textContent = 'Peça selecionada — escolha o destino';
  } else {
    estadoXadrez.casaSelecionada   = null;
    estadoXadrez.movimentosValidos = [];
    elementoStatusXadrez.textContent = 'Selecione uma peça para mover';
  }

  renderizarTabuleiroXadrez();
}

function executarMovimento(linhaOrigem, colunaOrigem, linhaDestino, colunaDestino, dadosMov) {
  var tab   = estadoXadrez.tabuleiro;
  var peca  = tab[linhaOrigem][colunaOrigem];
  var alvo  = tab[linhaDestino][colunaDestino];
  var adversaria = estadoXadrez.turno === 'branca' ? 'preta' : 'branca';

  // Captura normal
  if (alvo) {
    estadoXadrez.capturadas[estadoXadrez.turno].push(alvo);
  }

  // En passant
  if (peca.tipo === 'peao' && estadoXadrez.enPassantAlvo &&
      linhaDestino === estadoXadrez.enPassantAlvo.linha &&
      colunaDestino === estadoXadrez.enPassantAlvo.coluna) {
    var direcaoEP = estadoXadrez.turno === 'branca' ? 1 : -1;
    var pecaCapturadaEP = tab[linhaDestino + direcaoEP][colunaDestino];
    if (pecaCapturadaEP) {
      estadoXadrez.capturadas[estadoXadrez.turno].push(pecaCapturadaEP);
    }
    tab[linhaDestino + direcaoEP][colunaDestino] = null;
  }

  // Atualizar en passant
  if (peca.tipo === 'peao' && Math.abs(linhaDestino - linhaOrigem) === 2) {
    var linhaMeio = (linhaOrigem + linhaDestino) / 2;
    estadoXadrez.enPassantAlvo = { linha: linhaMeio, coluna: colunaOrigem };
  } else {
    estadoXadrez.enPassantAlvo = null;
  }

  // Roque
  if (peca.tipo === 'rei' && dadosMov.roque === 'pequeno') {
    tab[linhaOrigem][5] = tab[linhaOrigem][7];
    tab[linhaOrigem][7] = null;
    if (tab[linhaOrigem][5]) tab[linhaOrigem][5].moveu = true;
  }
  if (peca.tipo === 'rei' && dadosMov.roque === 'grande') {
    tab[linhaOrigem][3] = tab[linhaOrigem][0];
    tab[linhaOrigem][0] = null;
    if (tab[linhaOrigem][3]) tab[linhaOrigem][3].moveu = true;
  }

  // Mover a peça
  tab[linhaDestino][colunaDestino] = peca;
  tab[linhaOrigem][colunaOrigem]   = null;
  peca.moveu = true;

  // Promoção do peão
  if (peca.tipo === 'peao' && (linhaDestino === 0 || linhaDestino === 7)) {
    tab[linhaDestino][colunaDestino] = criarPeca('rainha', peca.cor);
    tab[linhaDestino][colunaDestino].moveu = true;
  }

  // Trocar turno
  estadoXadrez.turno = adversaria;
  estadoXadrez.casaSelecionada   = null;
  estadoXadrez.movimentosValidos = [];

  // Verificar xeque-mate ou afogamento
  var semMovimentos = verificarSemMovimentos(estadoXadrez.turno);
  var emXeque       = corEmXeque(tab, estadoXadrez.turno, estadoXadrez.enPassantAlvo);

  if (semMovimentos) {
    estadoXadrez.jogoAcabou = true;
    if (emXeque) {
      var vencedora = estadoXadrez.turno === 'branca' ? 'Pretas' : 'Brancas';
      elementoStatusXadrez.textContent = 'Xeque-mate! ' + vencedora + ' vencem! 🏆';
    } else {
      elementoStatusXadrez.textContent = 'Afogamento — Empate!';
    }
  } else if (emXeque) {
    elementoStatusXadrez.textContent = 'Xeque!';
  } else {
    elementoStatusXadrez.textContent = 'Selecione uma peça para mover';
  }

  renderizarTabuleiroXadrez();
}

function verificarSemMovimentos(cor) {
  var tab = estadoXadrez.tabuleiro;
  for (var l = 0; l < 8; l++) {
    for (var c = 0; c < 8; c++) {
      var p = tab[l][c];
      if (p && p.cor === cor) {
        var movs = movimentosLegaisXadrez(tab, l, c, estadoXadrez.enPassantAlvo);
        if (movs.length > 0) return false;
      }
    }
  }
  return true;
}

function reiniciarXadrez() {
  estadoXadrez.tabuleiro        = criarTabuleiroInicial();
  estadoXadrez.turno            = 'branca';
  estadoXadrez.casaSelecionada  = null;
  estadoXadrez.movimentosValidos = [];
  estadoXadrez.capturadas       = { branca: [], preta: [] };
  estadoXadrez.jogoAcabou       = false;
  estadoXadrez.enPassantAlvo    = null;
  elementoStatusXadrez.textContent = 'Selecione uma peça para mover';
  renderizarTabuleiroXadrez();
}

document.getElementById('btnReiniciarXadrez').addEventListener('click', reiniciarXadrez);

/* ── Inicializar xadrez ── */
estadoXadrez.tabuleiro = criarTabuleiroInicial();
renderizarCoordenadas();
renderizarTabuleiroXadrez();
