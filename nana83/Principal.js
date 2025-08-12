document.addEventListener('DOMContentLoaded', () => {
  // Funções utilitárias
  function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
  }
  function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }
  function setAuthToken(token) {
    localStorage.setItem('authToken', token);
  }
  function getAuthToken() {
    return localStorage.getItem('authToken');
  }
  function removeAuthToken() {
    localStorage.removeItem('authToken');
  }
  function isAuthenticated() {
    return getAuthToken() !== null;
  }
  function getLoggedInUser() {
    const token = getAuthToken();
    if (!token) return null;
    const users = getUsers();
    return users.find(u => u.username === token) || null;
  }

  // Lógica para tela de login/cadastro
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const showLoginBtn = document.getElementById('show-login-btn');
  const showRegisterBtn = document.getElementById('show-register-btn');
  const loginMessage = document.getElementById('login-message');
  const registerMessage = document.getElementById('register-message');

  if (loginForm && registerForm) {
    // Alternância
    showLoginBtn.addEventListener('click', () => {
      registerForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
      showRegisterBtn.classList.remove('active');
      showLoginBtn.classList.add('active');
      registerMessage.textContent = '';
    });
    showRegisterBtn.addEventListener('click', () => {
      loginForm.classList.add('hidden');
      registerForm.classList.remove('hidden');
      showLoginBtn.classList.remove('active');
      showRegisterBtn.classList.add('active');
      loginMessage.textContent = '';
    });

    // Cadastro
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('register-username').value.trim();
      const password = document.getElementById('register-password').value.trim();
      const email = document.getElementById('register-email').value.trim();
      if (!username || !password || !email) {
        registerMessage.textContent = 'Por favor, preencha todos os campos.';
        return;
      }
      let users = getUsers();
      if (users.some(u => u.username === username)) {
        registerMessage.textContent = 'Nome de usuário já existe.';
        return;
      }
      if (users.some(u => u.email === email)) {
        registerMessage.textContent = 'E-mail já cadastrado.';
        return;
      }
      users.push({ username, password, email });
      saveUsers(users);
      registerMessage.textContent = 'Cadastro realizado com sucesso!';
      registerForm.reset();
      setTimeout(() => showLoginBtn.click(), 1200);
    });

    // Login
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value.trim();
      if (!username || !password) {
        loginMessage.textContent = 'Por favor, preencha nome de usuário e senha.';
        return;
      }
      const users = getUsers();
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        setAuthToken(username);
        loginMessage.textContent = 'Login realizado! Redirecionando...';
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1000);
      } else {
        loginMessage.textContent = 'Nome de usuário ou senha incorretos.';
      }
    });

    // Redirecionar se já autenticado
    if (isAuthenticated()) {
      window.location.href = 'dashboard.html';
    }
  }

  // Lógica para dashboard
  const dashboardUsernameSpan = document.getElementById('dashboard-username');
  const dashboardEmailSpan = document.getElementById('dashboard-email');
  const logoutBtn = document.getElementById('logout-btn');
  if (dashboardUsernameSpan && dashboardEmailSpan) {
    if (!isAuthenticated()) {
      window.location.href = 'index2.html';
      return;
    }
    const loggedInUser = getLoggedInUser();
    if (loggedInUser) {
      dashboardUsernameSpan.textContent = loggedInUser.username;
      dashboardEmailSpan.textContent = loggedInUser.email;
    } else {
      removeAuthToken();
      window.location.href = 'index2.html';
    }
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        removeAuthToken();
        window.location.href = 'index2.html';
      });
    }
  }
});
