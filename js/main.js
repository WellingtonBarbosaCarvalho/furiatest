// main.js
document.addEventListener('DOMContentLoaded', function() {
  // Verificar autenticação
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (!isLoggedIn) {
      window.location.href = 'login.html';
      return;
  }
  
  // Carregar dados do usuário
  const userData = JSON.parse(localStorage.getItem('userData'));
  if (userData) {
      // Atualizar saudação
      const userWelcome = document.getElementById('user-welcome');
      if (userWelcome) {
          userWelcome.textContent = userData.username;
      }
      
      // Atualizar avatar
      const userInitials = document.getElementById('user-initials');
      if (userInitials) {
          const initials = userData.username.substring(0, 2).toUpperCase();
          userInitials.textContent = initials;
      }
      
      // Atualizar nome de usuário no header
      const usernameDisplay = document.getElementById('username-display');
      if (usernameDisplay) {
          usernameDisplay.textContent = userData.username;
      }
      
      // Personalizar feed com base nas preferências do usuário
      personalizeFeed(userData);
  }
  
  // Manipular clique no botão de logout
  const logoutBtn = document.getElementById('logout');
  if (logoutBtn) {
      logoutBtn.addEventListener('click', function(e) {
          e.preventDefault();
          localStorage.removeItem('isLoggedIn');
          window.location.href = 'login.html';
      });
  }
  
  // Alternar tema
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
      themeToggle.addEventListener('click', function() {
          document.body.classList.toggle('light-theme');
          
          // Alternar ícone
          const icon = this.querySelector('i');
          if (icon.classList.contains('fa-moon')) {
              icon.classList.remove('fa-moon');
              icon.classList.add('fa-sun');
          } else {
              icon.classList.remove('fa-sun');
              icon.classList.add('fa-moon');
          }
      });
  }
  
  // Filtragem do feed
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (filterButtons) {
      filterButtons.forEach(button => {
          button.addEventListener('click', function() {
              // Remover classe ativa de todos os botões
              filterButtons.forEach(btn => btn.classList.remove('active'));
              
              // Adicionar classe ativa ao botão clicado
              this.classList.add('active');
              
              // Obter o filtro selecionado
              const filter = this.getAttribute('data-filter');
              
              // Filtrar itens do feed
              const feedItems = document.querySelectorAll('.feed-item');
              feedItems.forEach(item => {
                  if (filter === 'all') {
                      item.style.display = 'block';
                  } else {
                      const itemType = item.getAttribute('data-type');
                      if (itemType === filter) {
                          item.style.display = 'block';
                      } else {
                          item.style.display = 'none';
                      }
                  }
              });
          });
      });
  }
  
  // Botões de ação no feed
  const actionButtons = document.querySelectorAll('.action-btn');
  if (actionButtons) {
      actionButtons.forEach(button => {
          button.addEventListener('click', function() {
              if (this.classList.contains('like-btn')) {
                  // Alternar estado de curtida
                  this.classList.toggle('liked');
                  
                  // Atualizar contador
                  const counter = this.querySelector('span');
                  let count = parseInt(counter.textContent);
                  
                  if (this.classList.contains('liked')) {
                      counter.textContent = count + 1;
                      this.querySelector('i').classList.remove('far');
                      this.querySelector('i').classList.add('fas');
                  } else {
                      counter.textContent = count - 1;
                      this.querySelector('i').classList.remove('fas');
                      this.querySelector('i').classList.add('far');
                  }
              }
          });
      });
  }
  
  // Carregar mais itens no feed
  const loadMoreBtn = document.querySelector('.load-more-btn');
  if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', function() {
          // Aqui você carregaria mais itens do feed a partir de uma API
          // Para o teste técnico, vamos simular isso
          this.textContent = 'Carregando...';
          
          setTimeout(() => {
              this.textContent = 'Carregar mais';
              alert('Em um ambiente real, mais itens seriam carregados aqui.');
          }, 1500);
      });
  }
  
  // Botões de lembrete para partidas
  const reminderButtons = document.querySelectorAll('.btn-reminder');
  if (reminderButtons) {
      reminderButtons.forEach(button => {
          button.addEventListener('click', function() {
              this.innerHTML = '<i class="fas fa-check"></i> Lembrete ativado';
              this.classList.add('reminder-active');
              this.disabled = true;
          });
      });
  }
});

// Função para personalizar o feed com base nas preferências do usuário
function personalizeFeed(userData) {
  // Em um ambiente real, isso seria feito consultando uma API
  // Para o teste técnico, vamos simular filtrando os itens existentes
  
  // Filtrar por jogos selecionados
  const feedItems = document.querySelectorAll('.feed-item');
  feedItems.forEach(item => {
      const gameType = item.getAttribute('data-game');
      
      // Verificar se o jogo está nas preferências do usuário
      if (userData.games && userData.games.includes(gameType)) {
          // Manter visível e dar prioridade se for o jogo favorito
          item.style.display = 'block';
          
          if (gameType === userData.favoriteGame) {
              item.style.order = '-1'; // Priorizar
          }
      } else {
          // Esconder itens de jogos não selecionados
          item.style.display = 'none';
      }
  });
  
  // Em um ambiente real, aqui também carregaríamos conteúdo específico
  // com base nas preferências do usuário a partir de uma API
}