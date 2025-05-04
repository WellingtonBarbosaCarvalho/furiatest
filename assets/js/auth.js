/**
 * auth.js - Gerenciamento de autenticação para o aplicativo FURIA eSports
 * Responsável por login, registro e gerenciamento de sessão do usuário
 */

// Verificar se usuário já está logado
document.addEventListener('DOMContentLoaded', function() {
  // Verificar qual página está sendo carregada
  const currentPage = window.location.pathname.split('/').pop();
  
  // Se já estiver logado e estiver na página de login ou registro, redirecionar para dashboard
  if ((currentPage === 'login.html' || currentPage === 'register.html') && isLoggedIn()) {
      window.location.href = 'dashboard.html';
  }
  
  // Se não estiver logado e estiver na página de dashboard, redirecionar para login
  if (currentPage === 'dashboard.html' && !isLoggedIn()) {
      window.location.href = 'login.html';
  }
  
  // Setup para o formulário de login
  setupLoginForm();
  
  // Setup para o formulário de registro (se existir na página)
  setupRegisterForm();
  
  // Setup para o botão de mostrar/esconder senha
  setupPasswordToggle();
});

/**
* Configura o formulário de login
*/
function setupLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;
  
  loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Animação de loading no botão
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      submitBtn.disabled = true;
      
      // Simulação de delay de rede (remover em produção)
      setTimeout(() => {
          loginUser(email, password);
      }, 1000);
  });
}

/**
* Configura o formulário de registro
*/
function setupRegisterForm() {
  const registerForm = document.getElementById('registerForm');
  if (!registerForm) return;
  
  registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const favEsport = document.querySelector('input[name="favEsport"]:checked')?.value;
      
      // Validação simples
      if (password !== confirmPassword) {
          showNotification('As senhas não conferem!', 'error');
          return;
      }
      
      if (!favEsport) {
          showNotification('Selecione seu eSport favorito!', 'error');
          return;
      }
      
      // Animação de loading no botão
      const submitBtn = registerForm.querySelector('button[type="submit"]');
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      submitBtn.disabled = true;
      
      // Simulação de delay de rede (remover em produção)
      setTimeout(() => {
          registerUser(username, email, password, favEsport);
      }, 1000);
  });
  
  // Configurar eventos para seleção de eSport favorito com efeito visual
  const esportOptions = document.querySelectorAll('.esport-option');
  esportOptions.forEach(option => {
      option.addEventListener('click', function() {
          const input = this.querySelector('input');
          if (input) {
              // Desmarcar todos
              esportOptions.forEach(opt => opt.classList.remove('selected'));
              // Marcar o selecionado
              this.classList.add('selected');
              input.checked = true;
          }
      });
  });
}

/**
* Configura o toggle de visibilidade da senha
*/
function setupPasswordToggle() {
  const toggleButtons = document.querySelectorAll('.toggle-password');
  toggleButtons.forEach(button => {
      button.addEventListener('click', function() {
          const input = this.previousElementSibling;
          if (input.type === 'password') {
              input.type = 'text';
              this.classList.remove('fa-eye');
              this.classList.add('fa-eye-slash');
          } else {
              input.type = 'password';
              this.classList.remove('fa-eye-slash');
              this.classList.add('fa-eye');
          }
      });
  });
}

/**
* Tenta realizar login do usuário
* @param {string} email - Email do usuário
* @param {string} password - Senha do usuário
*/
function loginUser(email, password) {
  // Buscar usuários armazenados
  const users = JSON.parse(localStorage.getItem('furiaUsers')) || [];
  
  // Verificar se o usuário existe
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
      // Login bem-sucedido
      const sessionData = {
          userId: user.id,
          username: user.username,
          email: user.email,
          favEsport: user.favEsport,
          isLoggedIn: true,
          loginTime: new Date().getTime()
      };
      
      // Salvar sessão
      localStorage.setItem('furiaSession', JSON.stringify(sessionData));
      
      // Mostrar notificação de sucesso
      showNotification('Login realizado com sucesso!', 'success');
      
      // Redirecionamento para dashboard
      setTimeout(() => {
          window.location.href = 'dashboard.html';
      }, 1000);
  } else {
      // Login falhou
      const submitBtn = document.querySelector('#loginForm button[type="submit"]');
      submitBtn.innerHTML = '<span>ENTRAR</span><i class="fa-solid fa-arrow-right"></i>';
      submitBtn.disabled = false;
      
      showNotification('Email ou senha incorretos!', 'error');
  }
}

/**
* Registra um novo usuário
* @param {string} username - Nome de usuário
* @param {string} email - Email do usuário
* @param {string} password - Senha do usuário
* @param {string} favEsport - eSport favorito selecionado
*/
function registerUser(username, email, password, favEsport) {
  // Buscar usuários existentes
  const users = JSON.parse(localStorage.getItem('furiaUsers')) || [];
  
  // Verificar se o email já está em uso
  if (users.some(user => user.email === email)) {
      const submitBtn = document.querySelector('#registerForm button[type="submit"]');
      submitBtn.innerHTML = '<span>CADASTRAR</span><i class="fa-solid fa-arrow-right"></i>';
      submitBtn.disabled = false;
      
      showNotification('Este email já está em uso!', 'error');
      return;
  }
  
  // Criar novo usuário
  const newUser = {
      id: generateUserId(),
      username,
      email,
      password,
      favEsport,
      registeredAt: new Date().toISOString()
  };
  
  // Adicionar ao array de usuários
  users.push(newUser);
  
  // Salvar de volta no localStorage
  localStorage.setItem('furiaUsers', JSON.stringify(users));
  
  // Criar sessão para o novo usuário (login automático)
  const sessionData = {
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
      favEsport: newUser.favEsport,
      isLoggedIn: true,
      loginTime: new Date().getTime()
  };
  
  localStorage.setItem('furiaSession', JSON.stringify(sessionData));
  
  // Mostrar notificação de sucesso
  showNotification('Cadastro realizado com sucesso!', 'success');
  
  // Redirecionamento para dashboard
  setTimeout(() => {
      window.location.href = 'dashboard.html';
  }, 1500);
}

/**
* Verifica se há um usuário logado
* @returns {boolean} - True se o usuário estiver logado
*/
function isLoggedIn() {
  const session = JSON.parse(localStorage.getItem('furiaSession'));
  if (!session) return false;
  
  // Verificar se a sessão ainda é válida (24 horas)
  const now = new Date().getTime();
  const sessionTime = session.loginTime;
  const sessionDuration = 24 * 60 * 60 * 1000; // 24 horas em milissegundos
  
  if (now - sessionTime > sessionDuration) {
      // Sessão expirada
      localStorage.removeItem('furiaSession');
      return false;
  }
  
  return session.isLoggedIn === true;
}

/**
* Realiza logout do usuário
*/
function logoutUser() {
  localStorage.removeItem('furiaSession');
  window.location.href = 'login.html';
}

/**
* Gera um ID único para o usuário
* @returns {string} - ID único
*/
function generateUserId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
* Exibe uma notificação na tela
* @param {string} message - Mensagem a ser exibida
* @param {string} type - Tipo da notificação (success, error, warning, info)
*/
function showNotification(message, type) {
  // Verificar se já existe uma notificação e removê-la
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
      existingNotification.remove();
  }
  
  // Criar elemento de notificação
  const notification = document.createElement('div');
  notification.className = `notification ${type} animate__animated animate__fadeInDown`;
  
  // Ícone com base no tipo
  let icon;
  switch (type) {
      case 'success':
          icon = 'fa-check-circle';
          break;
      case 'error':
          icon = 'fa-times-circle';
          break;
      case 'warning':
          icon = 'fa-exclamation-triangle';
          break;
      case 'info':
      default:
          icon = 'fa-info-circle';
  }
  
  // Adicionar conteúdo
  notification.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${message}</span>
      <button class="close-notification">
          <i class="fa-solid fa-times"></i>
      </button>
  `;
  
  // Adicionar ao DOM
  document.body.appendChild(notification);
  
  // Configurar botão de fechar
  const closeBtn = notification.querySelector('.close-notification');
  closeBtn.addEventListener('click', () => {
      notification.classList.replace('animate__fadeInDown', 'animate__fadeOutUp');
      setTimeout(() => {
          notification.remove();
      }, 500);
  });
  
  // Auto-remover após 5 segundos
  setTimeout(() => {
      if (document.body.contains(notification)) {
          notification.classList.replace('animate__fadeInDown', 'animate__fadeOutUp');
          setTimeout(() => {
              if (document.body.contains(notification)) {
                  notification.remove();
              }
          }, 500);
      }
  }, 5000);
}

// Exportar funções para uso global
window.logoutUser = logoutUser;
window.isLoggedIn = isLoggedIn;