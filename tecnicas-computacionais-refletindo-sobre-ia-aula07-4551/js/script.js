import { aleatorio, nome } from './aleatorio.js';
import { perguntas } from './perguntas.js';

// Elementos da DOM
const telaInicial = document.querySelector(".tela-inicial");
const caixaPerguntas = document.querySelector(".caixa-perguntas");
const caixaAlternativas = document.querySelector(".caixa-alternativas");
const caixaResultado = document.querySelector(".caixa-resultado");
const textoResultado = document.querySelector(".texto-resultado");
const botaoIniciar = document.querySelector(".iniciar-btn");
const botaoJogarNovamente = document.querySelector(".novamente-btn");
const currentDateElement = document.querySelector(".status-date");

// Efeitos de áudio
const hoverSound = document.getElementById("hover-sound");
const clickSound = document.getElementById("click-sound");

// Variáveis do jogo
let atual = 0;
let perguntaAtual;
let historiaFinal = "";

// Atualiza data no terminal
function updateTerminalDate() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    currentDateElement.textContent = now.toLocaleString('pt-BR', options);
}

setInterval(updateTerminalDate, 1000);
updateTerminalDate();

// Efeitos de hover nos botões
function setupButtonHoverEffects() {
    const buttons = document.querySelectorAll("button");
    buttons.forEach(button => {
        button.addEventListener("mouseenter", () => {
            hoverSound.currentTime = 0;
            hoverSound.play();
        });
        
        button.addEventListener("click", () => {
            clickSound.currentTime = 0;
            clickSound.play();
        });
    });
}

// Inicia o jogo
function iniciarJogo() {
    telaInicial.style.display = "none";
    caixaPerguntas.style.display = "block";
    caixaAlternativas.style.display = "block";
    
    // Efeito de inicialização
    caixaPerguntas.style.animation = "fadeIn 0.5s forwards";
    caixaAlternativas.style.animation = "fadeIn 0.5s 0.3s forwards";
    
    substituiNome();
    mostraPergunta();
}

// Mostra pergunta atual
function mostraPergunta() {
    if (atual >= perguntas.length) {
        mostraResultado();
        return;
    }
    
    perguntaAtual = perguntas[atual];
    caixaAlternativas.textContent = "";
    
    // Efeito de digitação simulada
    caixaPerguntas.textContent = "";
    const textoArray = perguntaAtual.enunciado.split("");
    let i = 0;
    
    const typingInterval = setInterval(() => {
        if (i < textoArray.length) {
            caixaPerguntas.textContent += textoArray[i];
            i++;
        } else {
            clearInterval(typingInterval);
            mostraAlternativas();
        }
    }, 30);
}

// Mostra alternativas
function mostraAlternativas() {
    perguntaAtual.alternativas.forEach((alternativa, index) => {
        const botaoAlternativas = document.createElement("button");
        botaoAlternativas.textContent = alternativa.texto;
        
        // Efeito de atraso progressivo
        botaoAlternativas.style.animationDelay = `${index * 0.1}s`;
        
        botaoAlternativas.addEventListener("click", () => {
            respostaSelecionada(alternativa);
        });
        
        caixaAlternativas.appendChild(botaoAlternativas);
    });
}

// Processa resposta selecionada
function respostaSelecionada(opcaoSelecionada) {
    const afirmacoes = aleatorio(opcaoSelecionada.afirmacao);
    historiaFinal += afirmacoes + " ";
    
    // Efeito visual ao selecionar
    event.target.classList.add("selecionado");
    
    setTimeout(() => {
        if (opcaoSelecionada.proxima !== undefined) {
            atual = opcaoSelecionada.proxima;
            mostraPergunta();
        } else {
            mostraResultado();
        }
    }, 500);
}

// Mostra resultado final
function mostraResultado() {
    caixaPerguntas.textContent = `[SIMULAÇÃO CONCLUÍDA] Em 2049, ${nome}`;
    textoResultado.textContent = historiaFinal;
    caixaAlternativas.textContent = "";
    
    // Efeito de transição
    setTimeout(() => {
        caixaPerguntas.style.display = "none";
        caixaAlternativas.style.display = "none";
        caixaResultado.style.display = "block";
        caixaResultado.style.animation = "fadeIn 0.5s forwards";
    }, 300);
}

// Reinicia o jogo
function jogaNovamente() {
    atual = 0;
    historiaFinal = "";
    
    // Efeito de transição
    caixaResultado.style.animation = "fadeOut 0.5s forwards";
    
    setTimeout(() => {
        caixaResultado.style.display = "none";
        telaInicial.style.display = "block";
        telaInicial.style.animation = "fadeIn 0.5s forwards";
    }, 500);
}

// Substitui "você" pelo nome do jogador
function substituiNome() {
    perguntas.forEach(pergunta => {
        pergunta.enunciado = pergunta.enunciado.replace(/você/g, nome);
    });
}

// Event listeners
botaoIniciar.addEventListener("click", iniciarJogo);
botaoJogarNovamente.addEventListener("click", jogaNovamente);

// Configura efeitos
setupButtonHoverEffects();

// Adiciona animação de fadeIn para a tela inicial
document.addEventListener("DOMContentLoaded", () => {
    telaInicial.style.animation = "fadeIn 1s forwards";
});