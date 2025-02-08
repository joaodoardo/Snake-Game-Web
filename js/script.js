const TAMANHO_GRADE = 20; 
const TAMANHO_CELULA = 20; 

let cobra = [{ x: 10, y: 10 }];
let comida = { x: 5, y: 5 }; 
let direcao = { x: 1, y: 0 }; 
let pontuacao = 0; 
let intervaloJogo;
let nomeJogador;

let ranking = JSON.parse(localStorage.getItem('ranking')) || [];


const tabuleiro = document.getElementById('tabuleiro');
const telaGameOver = document.getElementById('tela-game-over');
const menu = document.getElementById('menu'); 
const displayNomeJogador = document.getElementById('display-nome-jogador');
const displayPontuacao = document.getElementById('display-pontuacao'); 
const botaoReiniciar = document.getElementById('botao-reiniciar'); 
const botaoComecar = document.getElementById('comecar'); 

tabuleiro.style.setProperty('--tamanho-grade', TAMANHO_GRADE);
tabuleiro.style.setProperty('--tamanho-celula', `${TAMANHO_CELULA}px`);

function desenhar() {
    tabuleiro.innerHTML = ''; 
    cobra.forEach(segmento => {
        const elementoCobra = document.createElement('div');
        elementoCobra.style.gridRowStart = segmento.y;
        elementoCobra.style.gridColumnStart = segmento.x;
        elementoCobra.classList.add('celula', 'cobra');
        tabuleiro.appendChild(elementoCobra);
    });

    const elementoComida = document.createElement('div');
    elementoComida.style.gridRowStart = comida.y;
    elementoComida.style.gridColumnStart = comida.x;
    elementoComida.classList.add('celula', 'comida');
    tabuleiro.appendChild(elementoComida);
}

function atualizar() {
    //se a cobra não estiver se movendo após reiniciar, começa a se mover para a direita
    if (direcao.x === 0 && direcao.y === 0) {
        direcao = { x: 1, y: 0 };
    }

    const cabeca = { x: cobra[0].x + direcao.x, y: cobra[0].y + direcao.y };

    //berifica colisão com as paredes ou com o próprio corpo
    if (
        cabeca.x < 1 || cabeca.x > TAMANHO_GRADE ||
        cabeca.y < 1 || cabeca.y > TAMANHO_GRADE ||
        cobra.some(segmento => segmento.x === cabeca.x && segmento.y === cabeca.y)
    ) {
        fimDeJogo();
        return;
    }

    cobra.unshift(cabeca); //adiciona a nova cabeça

    //confere se a cobra comeu a comida
    if (cabeca.x === comida.x && cabeca.y === comida.y) {
        pontuacao += 10;
        posicionarComida();
    } else {
        cobra.pop(); //remove o último segmento da cobra no caso dela não ter comido
    }
}

function posicionarComida() {
    comida = {
        x: Math.floor(Math.random() * TAMANHO_GRADE) + 1,
        y: Math.floor(Math.random() * TAMANHO_GRADE) + 1
    };

    // Evita que a comida seja colocada em cima da cobra
    while (cobra.some(segmento => segmento.x === comida.x && segmento.y === comida.y)) {
        comida = {
            x: Math.floor(Math.random() * TAMANHO_GRADE) + 1,
            y: Math.floor(Math.random() * TAMANHO_GRADE) + 1
        };
    }
}

function fimDeJogo() {
    clearInterval(intervaloJogo);
    telaGameOver.classList.remove('escondido');
    displayNomeJogador.textContent = nomeJogador;
    displayPontuacao.textContent = pontuacao;

    //atualiza e salva o ranking
    ranking.push({ nome: nomeJogador, pontuacao });
    ranking.sort((a, b) => b.pontuacao - a.pontuacao);
    ranking = ranking.slice(0, 5);
    localStorage.setItem('ranking', JSON.stringify(ranking));

    //exibe o ranking na tela
    let rankingTexto = '<h3>Ranking:</h3>';
    ranking.forEach(jogador => {
        rankingTexto += `<p>${jogador.nome}: ${jogador.pontuacao} pts</p>`;
    });

    document.getElementById('ranking')?.remove(); 
    const rankingElement = document.createElement('div');
    rankingElement.id = 'ranking';
    rankingElement.innerHTML = rankingTexto;
    telaGameOver.appendChild(rankingElement);
}


function movimentacao(event) {
    switch (event.key) {
        case 'w':
            if (direcao.y !== 1) direcao = { x: 0, y: -1 }; 
            break;
        case 's':
            if (direcao.y !== -1) direcao = { x: 0, y: 1 }; 
            break;
        case 'a':
            if (direcao.x !== 1) direcao = { x: -1, y: 0 }; 
            break;
        case 'd':
            if (direcao.x !== -1) direcao = { x: 1, y: 0 }; 
            break;
    }
}

botaoReiniciar.addEventListener('click', () => {
    cobra = [{ x: 10, y: 10 }];
    direcao = { x: 0, y: 0 };
    pontuacao = 0;
    posicionarComida();
    telaGameOver.classList.add('escondido');
    iniciarJogo();
});


botaoComecar.addEventListener('click', () => {
    menu.classList.add('escondido'); //esconde o menu
    iniciarJogo();
});

document.addEventListener('keydown', movimentacao);

function iniciarJogo() {
    nomeJogador = prompt("Digite seu nome:"); //pergunta o nome do jogador
    intervaloJogo = setInterval(() => {
        atualizar();
        desenhar();
    }, 150); //atualiza o jogo a cada 150ms
}