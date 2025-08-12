document.addEventListener('DOMContentLoaded', () => {
  const usernameSpan = document.getElementById('dashboard-username');
  const emailSpan = document.getElementById('dashboard-email');

  const SECRET_KEY = 'chave-secreta-maneira'; // Troque por algo mais forte e guarde bem

  const encrypt = txt => btoa(txt);
  const decrypt = txt => atob(txt);

  const getUsers = () => JSON.parse(localStorage.getItem('users') || '[]');
  const getAuthToken = () => {
    const data = localStorage.getItem('authToken');
    if (!data) return null;
    try {
      const decrypted = decrypt(data);
      const [timestamp, token] = decrypted.split('|');
      if (Date.now() - Number(timestamp) > 15 * 60 * 1000) return null;
      return token;
    } catch {
      return null;
    }
  };
  const isAuthenticated = () => Boolean(getAuthToken());

  const getLoggedInUser = () => {
    const token = getAuthToken();
    if (!token) return null;

    try {
      const decoded = atob(token);
      const [username] = decoded.split(':');
      return getUsers().find(u => u.username === username) || null;
    } catch {
      console.error('Erro ao decodificar token');
      return null;
    }
  };

  if (!isAuthenticated()) {
    return void (window.location.href = 'Principal.html');
  }

  const user = getLoggedInUser();
  if (!user) {
    localStorage.removeItem('authToken');
    return void (window.location.href = 'Principal.html');
  }

  usernameSpan.textContent = user.username;
  emailSpan.textContent = user.email;
});
