const toggleBtn = document.getElementById('themeToggle');
const body = document.body;

function updateIcon() {
  const isDark = body.classList.contains('dark');
  toggleBtn.textContent = isDark ? '🌙' : '☀️';
  toggleBtn.setAttribute('data-tooltip', isDark ? 'Modo Escuro' : 'Modo Claro');
}

// Carrega preferência
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark');
}
updateIcon();

toggleBtn.addEventListener('click', () => {
  // Alternar tema
  body.classList.toggle('dark');

  // Salvar no localStorage
  const theme = body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('theme', theme);

  // Atualizar ícone e tooltip
  updateIcon();

  // Animação ao clicar
  toggleBtn.classList.add('rotate');
  setTimeout(() => toggleBtn.classList.remove('rotate'), 600);
});

// Menu hambúrguer
document.getElementById('menu-toggle').addEventListener('click', function () {
    document.getElementById('nav-menu').classList.toggle('active');
  });

// Inscricao
let dadosPendentes = null;
let indexParaRemover = null;

document.getElementById('form-inscricao').addEventListener('submit', function(e) {
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

  dadosPendentes = {
    nome,
    email,
    eventos: eventosSelecionados
  };

  const resumo = `<strong>Nome:</strong> ${nome}<br>
                  <strong>Email:</strong> ${email}<br>
                  <strong>Eventos:</strong> ${eventosSelecionados.join(', ')}`;
  document.getElementById('resumo-inscricao').innerHTML = resumo;
  abrirModal('modal-confirmar');
});

function exibirInscricoes() {
  const lista = document.getElementById('lista-inscricoes');
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

document.getElementById('btn-confirmar').addEventListener('click', function () {
  let inscricoes = JSON.parse(localStorage.getItem('inscricoes')) || [];
  inscricoes.push(dadosPendentes);
  localStorage.setItem('inscricoes', JSON.stringify(inscricoes));
  fecharModal('modal-confirmar');
  document.getElementById('form-inscricao').reset();
  exibirInscricoes();
});

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

document.getElementById('btn-remover-sim').addEventListener('click', function () {
  let inscricoes = JSON.parse(localStorage.getItem('inscricoes')) || [];
  inscricoes.splice(indexParaRemover, 1);
  localStorage.setItem('inscricoes', JSON.stringify(inscricoes));
  fecharModal('modal-remover');
  exibirInscricoes();
});

function abrirModal(id) {
  document.getElementById(id).style.display = 'block';
}

function fecharModal(id) {
  document.getElementById(id).style.display = 'none';
}

// Mostrar eventos inscritos ao carregar a página
window.addEventListener('load', exibirInscricoes);