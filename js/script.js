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