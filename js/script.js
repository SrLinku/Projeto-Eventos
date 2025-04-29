// Alternância de tema
const toggleBtn = document.getElementById('themeToggle');
const body = document.body;

function updateIcon() {
  const isDark = body.classList.contains('dark');
  if (toggleBtn) {
    toggleBtn.textContent = isDark ? '🌙' : '☀️';
    toggleBtn.setAttribute('data-tooltip', isDark ? 'Modo Escuro' : 'Modo Claro');
  }
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark');
}
updateIcon();

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark');
    const theme = body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    updateIcon();
    toggleBtn.classList.add('rotate');
    setTimeout(() => toggleBtn.classList.remove('rotate'), 600);
  });
}

// Menu hambúrguer
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', function () {
    navMenu.classList.toggle('active');
  });
}

// Modal helpers
function abrirModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'block';
}

function fecharModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'none';
}

// Inscrição
let dadosPendentes = null;
let indexParaRemover = null;

const formInscricao = document.getElementById('form-inscricao');
if (formInscricao) {
  formInscricao.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const eventosSelecionados = Array.from(document.querySelectorAll('input[name="eventos"]:checked')).map(cb => cb.value);

    if (!nome || !email) {
      alert('Preencha todos os campos.');
      return;
    }

    if (eventosSelecionados.length === 0) {
      alert('Selecione pelo menos um evento.');
      return;
    }

    dadosPendentes = { nome, email, eventos: eventosSelecionados };

    const resumo = `<strong>Nome:</strong> ${nome}<br>
                    <strong>Email:</strong> ${email}<br>
                    <strong>Eventos:</strong> ${eventosSelecionados.join(', ')}`;
    const resumoEl = document.getElementById('resumo-inscricao');
    if (resumoEl) resumoEl.innerHTML = resumo;

    abrirModal('modal-confirmar');
  });
}

const btnConfirmar = document.getElementById('btn-confirmar');
if (btnConfirmar) {
  btnConfirmar.addEventListener('click', function () {
    let inscricoes = JSON.parse(localStorage.getItem('inscricoes')) || [];
    inscricoes.push(dadosPendentes);
    localStorage.setItem('inscricoes', JSON.stringify(inscricoes));
    fecharModal('modal-confirmar');
    if (formInscricao) formInscricao.reset();
    exibirInscricoes();
  });
}

function exibirInscricoes() {
  const lista = document.getElementById('lista-inscricoes');
  if (!lista) return;

  const inscricoes = JSON.parse(localStorage.getItem('inscricoes')) || [];
  lista.innerHTML = '';
  inscricoes.forEach((insc, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${insc.nome}</strong> (${insc.email}) - Inscrito em: ${insc.eventos.join(', ')}
      <button onclick="editarInscricao(${index})">Editar</button>
      <button onclick="removerInscricao(${index})">Remover</button>
    `;
    lista.appendChild(li);
  });
}

function editarInscricao(index) {
  const inscricoes = JSON.parse(localStorage.getItem('inscricoes')) || [];
  const inscricao = inscricoes[index];

  document.getElementById('nome').value = inscricao.nome;
  document.getElementById('email').value = inscricao.email;

  document.querySelectorAll('input[name="eventos"]').forEach(cb => {
    cb.checked = inscricao.eventos.includes(cb.value);
  });

  inscricoes.splice(index, 1);
  localStorage.setItem('inscricoes', JSON.stringify(inscricoes));

  abrirModal('modal-edicao');
}

function removerInscricao(index) {
  indexParaRemover = index;
  abrirModal('modal-remover');
}

const btnRemoverSim = document.getElementById('btn-remover-sim');
if (btnRemoverSim) {
  btnRemoverSim.addEventListener('click', function () {
    let inscricoes = JSON.parse(localStorage.getItem('inscricoes')) || [];
    inscricoes.splice(indexParaRemover, 1);
    localStorage.setItem('inscricoes', JSON.stringify(inscricoes));
    fecharModal('modal-remover');
    exibirInscricoes();
  });
}

// Mostrar inscrições ao carregar
window.addEventListener('load', exibirInscricoes);

// Galeria de imagens com navegação
document.addEventListener('DOMContentLoaded', () => {
  const imagens = document.querySelectorAll('.galeria-imagens img');
  const btnEsquerda = document.querySelector('.seta-esquerda');
  const btnDireita = document.querySelector('.seta-direita');
  let indiceAtual = 0;

  if (!imagens.length || !btnEsquerda || !btnDireita) return;

  function mostrarImagem(indice) {
    imagens.forEach((img, i) => {
      img.classList.remove('ativo');
      if (i === indice) img.classList.add('ativo');
    });
  }

  btnEsquerda.addEventListener('click', () => {
    indiceAtual = (indiceAtual - 1 + imagens.length) % imagens.length;
    mostrarImagem(indiceAtual);
  });

  btnDireita.addEventListener('click', () => {
    indiceAtual = (indiceAtual + 1) % imagens.length;
    mostrarImagem(indiceAtual);
  });
});
