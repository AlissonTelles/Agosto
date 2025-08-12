document.addEventListener('DOMContentLoaded', () => {
  const showLoginBtn = document.getElementById('show-login-btn');
  const showRegisterBtn = document.getElementById('show-register-btn');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const loginMessage = document.getElementById('login-message');
  const registerMessage = document.getElementById('register-message');
  const loginUsernameInput = document.getElementById('login-username');
  const loginPasswordInput = document.getElementById('login-password');
  const registerUsernameInput = document.getElementById('register-username');
  const registerPasswordInput = document.getElementById('register-password');
  const registerEmailInput = document.getElementById('register-email');
  const logoutBtn = document.getElementById('logout-btn');

  function sanitizeInput(input) {
    return input.replace(/[<>]/g, '');
  }

  function displayMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
    element.style.display = 'block';
    setTimeout(() => {
      element.textContent = '';
      element.className = 'message';
      element.style.display = 'none';
    }, 3000);
  }

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

  if (registerForm) {
    showRegisterBtn.addEventListener('click', () => {
      loginForm.classList.add('hidden');
      registerForm.classList.remove('hidden');
      showLoginBtn.classList.remove('active');
      showRegisterBtn.classList.add('active');
      loginMessage.textContent = '';
    });

    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = sanitizeInput(registerUsernameInput.value.trim());
      const password = sanitizeInput(registerPasswordInput.value.trim());
      const email = sanitizeInput(registerEmailInput.value.trim());

      if (!username || !password || !email) {
        displayMessage(registerMessage, 'Por favor, preencha todos os campos.', 'error');
        return;
      }

      let users = getUsers();
      const usernameExists = users.some(user => user.username === username);
      const emailExists = users.some(user => user.email === email);

      if (usernameExists) {
        displayMessage(registerMessage, 'Nome de usuário já existe.', 'error');
        return;
      }

      if (emailExists) {
        displayMessage(registerMessage, 'Email já cadastrado.', 'error');
        return;
      }

      users.push({ username, password, email });
      saveUsers(users);

      displayMessage(registerMessage, 'Cadastro realizado com sucesso! Agora você pode fazer login.', 'success');

      registerForm.reset();
      setTimeout(() => {
        showLoginBtn.click();
      }, 1500);
    });
  }

  if (loginForm) {
    showLoginBtn.addEventListener('click', () => {
      registerForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
      showRegisterBtn.classList.remove('active');
      showLoginBtn.classList.add('active');
      registerMessage.textContent = '';
    });

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = sanitizeInput(loginUsernameInput.value.trim());
      const password = sanitizeInput(loginPasswordInput.value.trim());

      if (!username || !password) {
        displayMessage(loginMessage, 'Por favor, preencha nome de usuário e senha.', 'error');
        return;
      }

      const users = getUsers();
      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        setAuthToken(username);
        displayMessage(loginMessage, 'Login bem-sucedido! Redirecionando...', 'success');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1000);
      } else {
        displayMessage(loginMessage, 'Nome de usuário ou senha incorretos.', 'error');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      removeAuthToken();
      window.location.href = 'index2.html';
    });
  }

  if (window.location.pathname.endsWith('index.html') ||
      window.location.pathname.endsWith('index2.html') ||
      window.location.pathname.endsWith('index3.html') ||
      window.location.pathname === '/') {
    if (isAuthenticated()) {
      window.location.href = 'dashboard.html';
    }
  }
});
