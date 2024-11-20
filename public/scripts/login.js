
document.querySelectorAll('.form input, .form textarea').forEach(function (element) {
    element.addEventListener('keyup', handleEvent);
    element.addEventListener('blur', handleEvent);
    element.addEventListener('focus', handleEvent);
  });
  
  function handleEvent(e) {
    const input = e.target;  
    const label = input.previousElementSibling;
    
    if (e.type === 'keyup') {
      if (input.value === '') {
        label.classList.remove('active', 'highlight');
      } else {
        label.classList.add('active', 'highlight');
      }
    } else if (e.type === 'blur') {
      if (input.value === '') {
        label.classList.remove('active', 'highlight');
      } else {
        label.classList.remove('highlight');
      }
    } else if (e.type === 'focus') {
      if (input.value === '') {
        label.classList.remove('highlight');
      } else if (input.value !== '') {
        label.classList.add('highlight');
      }
    }
  }
  
  
  document.querySelectorAll('.tab a').forEach(function (element) {
    element.addEventListener('click', function (e) {
      e.preventDefault();
      
      const parent = element.parentElement;
      parent.classList.add('active');
      parent.parentElement.querySelectorAll('.tab').forEach(function (sibling) {
        if (sibling !== parent) sibling.classList.remove('active');
      });

      const target = document.querySelector(element.getAttribute('href'));
  
      document.querySelectorAll('.tab-content > div').forEach(function (content) {
        if (content !== target) content.style.display = 'none';
      });
  
      target.style.display = 'block';
      target.style.opacity = 0;
      setTimeout(() => { target.style.opacity = 1 }, 10);
    });
  });
  

  const Form = document.getElementById('login');

  Form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const data = new FormData(e.target);
      const Obj = {};
      data.forEach((value, key) => {
          Obj[key] = value;
      });
  
      try {
          const login = await fetch('/professor/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(Obj),
          });
  
          const response = await login.json();
          console.log(response);
  
          if (response.user) {
              alert("Account Login success");
              //Form.reset();
              window.localStorage.setItem('email', response.user.email);
              window.location.href = 'professorDashboard.html';
          } else {
              
              alert("Wrong credentials");
          }
      } catch (error) {
          console.error('Error:', error);
          alert('An error occurred. Please try again later.');
      }
  });
  

  const RegForm = document.getElementById('register');

  RegForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const data = new FormData(e.target);
      const Obj = {};
      data.forEach((value, key) => {
          Obj[key] = value;
      });
  
      const email = Obj['email'];
  
      try {
          
          const otpRequest = await fetch('/professor/request-otp', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: email }),
          });
  
          const otpResponse = await otpRequest.json();
  
          if (otpResponse.success) {
              const userOtp = prompt('Enter the OTP sent to your email:');
  
              if (userOtp) {
                  
                  const verifyOtp = await fetch('/professor/check-otp', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ email: email, otp: userOtp }),
                  });
  
                  const otpVerification = await verifyOtp.json();
  
                  if (otpVerification.success) {
                      // Register user
                      console.log(Obj)
                      const register = await fetch('/professor/register', {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(Obj),
                      });
  
                      const registerResponse = await register.json();
  
                      if (registerResponse.user) {
                          alert('Registration successful!');
                          //RegForm.reset();
                          window.localStorage.setItem('email', registerResponse.user.email);
                          window.location.href = 'professorDashboard.html';
                      } else {
                          alert('Registration failed. Please try again.');
                      }
                  } else {
                      alert('Invalid OTP. Please try again.');
                  }
              } else {
                  alert('OTP is required to proceed.');
              }
          } else {
              alert('Failed to send OTP. Please check the email address and try again.');
          }
      } catch (error) {
          console.error('Error:', error);
          alert('An error occurred. Please try again later.');
      }
  });
  
