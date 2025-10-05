const API_URL = 'http://localhost:3000';

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const registerMessage = document.getElementById('registerMessage');
const loginMessage = document.getElementById('loginMessage');
const welcomeSection = document.getElementById('welcomeSection');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;

  try {

    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      registerMessage.textContent = data.message;
      registerMessage.style.color = 'green';
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    registerMessage.textContent = error.message;
    registerMessage.style.color = 'red';
  }

});

loginForm.addEventListener('submit', async (e) => { 
  e.preventDefault();

  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  try {
    
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);

      loginMessage.textContent = data.message;
      loginMessage.style.color = 'green';

      document.querySelector('.container').classList.add('hidden');
      welcomeSection.classList.remove('hidden');
    } else {
      throw new Error(data.message);
    }
    
  } catch (error) {
    loginMessage.textContent = error.message;
    loginMessage.style.color = 'red';
  }
  
});