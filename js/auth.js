// auth.js
document.addEventListener('DOMContentLoaded', function() {
  // Navegação entre etapas do registro
  const nextButtons = document.querySelectorAll('.next-btn');
  const prevButtons = document.querySelectorAll('.prev-btn');
  
  if (nextButtons) {
      nextButtons.forEach(button => {
          button.addEventListener('click', function() {
              const currentStep = this.closest('.form-step');
              const nextStepId = this.getAttribute('data-next');
              const nextStep = document.getElementById(nextStepId);
              
              // Validar campos antes de avançar
              if (validateStep(currentStep)) {
                  currentStep.classList.remove('active');
                  nextStep.classList.add('active');
              }
          });
      });
  }
  
  if (prevButtons) {
      prevButtons.forEach(button => {
          button.addEventListener('click', function() {
              const currentStep = this.closest('.form-step');
              const prevStepId = this.getAttribute('data-prev');
              const prevStep = document.getElementById(prevStepId);
              
              currentStep.classList.remove('active');
              prevStep.classList.add('active');
          });
      });
  }
  
  // Seleção de times
  const teamCards = document.querySelectorAll('.team-card');
  const selectedTeamsInput = document.getElementById('selected-teams');
  
  if (teamCards && selectedTeamsInput) {
      teamCards.forEach(card => {
          card.addEventListener('click', function() {
              this.classList.toggle('selected');
              updateSelectedTeams();
          });
      });
  }
  
  // Formulário de registro
  const registerForm = document.getElementById('register-form');
  
  if (registerForm) {
      registerForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          if (validateStep(document.getElementById('step-3'))) {
              // Coletar todos os dados do formulário
              const userData = {
                  username: document.getElementById('username').value,
                  email: document.getElementById('email').value,
                  password: document.getElementById('password').value,
                  games: Array.from(document.querySelectorAll('input[name="games"]:checked')).map(cb => cb.value),
                  favoriteGame: document.getElementById('favorite-game').value,
                  contentPreferences: Array.from(document.querySelectorAll('input[name="content"]:checked')).map(cb => cb.value),
                  selectedTeams: JSON.parse(document.getElementById('selected-teams').value || '[]')
              };
              
              // Salvar no localStorage (para o teste técnico)
              localStorage.setItem('userData', JSON.stringify(userData));
              
              // Redirecionar para o login
              showSuccessMessage('Conta criada com sucesso! Redirecionando para o login...');
              setTimeout(() => {
                  window.location.href = 'login.html';
              }, 2000);
          }
      });
  }
  
  // Formulário de login
  const loginForm = document.getElementById('login-form');
  
  if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          const username = document.getElementById('username').value;
          const password = document.getElementById('password').value;
          
          // Verificar se existe um usuário cadastrado
          const userData = JSON.parse(localStorage.getItem('userData'));
          
          if (userData && (userData.username === username || userData.email === username) && userData.password === password) {
              // Autenticar usuário
              localStorage.setItem('isLoggedIn', 'true');
              
              // Redirecionar para o dashboard
              showSuccessMessage('Login realizado com sucesso! Redirecionando...');
              setTimeout(() => {
                  window.location.href = 'dashboard.html';
              }, 1500);
          } else {
              showErrorMessage('Nome de usuário ou senha incorretos!');
          }
      });
  }
  
  // Funções auxiliares
  function validateStep(step) {
      const inputs = step.querySelectorAll('input[required], select[required]');
      let isValid = true;
      
      inputs.forEach(input => {
          if (!input.value.trim()) {
              input.style.borderColor = 'var(--error-color)';
              isValid = false;
          } else {
              input.style.borderColor = '';
          }
      });
      
      // Validação específica para o passo 1
      if (step.id === 'step-1') {
          const password = document.getElementById('password');
          const confirmPassword = document.getElementById('confirm-password');
          
          // Validar força da senha
          if (password.value.length < 8) {
              password.style.borderColor = 'var(--error-color)';
              showErrorMessage('A senha deve ter pelo menos 8 caracteres!');
              isValid = false;
          }
          
          // Validar confirmação de senha
          if (password.value !== confirmPassword.value) {
              confirmPassword.style.borderColor = 'var(--error-color)';
              showErrorMessage('As senhas não coincidem!');
              isValid = false;
          }
      }
      
      // Validação específica para o passo 3
      if (step.id === 'step-3') {
          const selectedTeams = JSON.parse(selectedTeamsInput.value || '[]');
          if (selectedTeams.length === 0) {
              showErrorMessage('Selecione pelo menos um time para seguir!');
              isValid = false;
          }
      }
      
      if (!isValid) {
          return false;
      }
      
      hideErrorMessage();
      return true;
  }
  
  function updateSelectedTeams() {
      const selectedCards = document.querySelectorAll('.team-card.selected');
      const selectedTeams = Array.from(selectedCards).map(card => card.getAttribute('data-team'));
      
      if (selectedTeamsInput) {
          selectedTeamsInput.value = JSON.stringify(selectedTeams);
      }
  }
  
  function showErrorMessage(message) {
      const errorMessage = document.getElementById('error-message');
      if (errorMessage) {
          errorMessage.textContent = message;
          errorMessage.style.display = 'block';
          
          setTimeout(() => {
              errorMessage.style.display = 'none';
          }, 5000);
      }
  }
  
  function hideErrorMessage() {
      const errorMessage = document.getElementById('error-message');
      if (errorMessage) {
          errorMessage.style.display = 'none';
      }
  }
  
  function showSuccessMessage(message) {
      const successMessage = document.getElementById('success-message');
      if (successMessage) {
          successMessage.textContent = message;
          successMessage.style.display = 'block';
      }
  }
});