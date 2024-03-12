import React, { useState } from 'react';
import './Login.css'; 
import allgoimage from './images/Allgoblack.png'

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleCreateOne=()=>{
      window.location.href='./Register';
    }
    const handleLogin = async () => {
      if (!username.trim() || !password.trim()) {
          window.alert("Please fill all fields");
      } else {
          try {
              const response = await fetch('http://localhost:4000/auth/login', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ username, password }),
                  // credentials: 'include' // Include cookies
              });
  
              if (response.ok) {
                // console.log(`hi`);
                  const data = await response.json();
                  const tokenrecv = data.token;
                  console.log("Token received:", tokenrecv);
                  
                  // Store the token in localStorage
                  localStorage.setItem('token', tokenrecv);
                  
                  // Redirect to dashboard or perform any other action upon successful login
                  window.location.href = '/Home';
                  window.alert("Login Successful");
              } else {
                  const data = await response.json();
                  setErrorMessage(data.error || 'An error occurred during login');
              }
          } catch (error) {
              console.error('Error during login:', errorMessage);
              setErrorMessage('An error occurred during login');
          }
      }
  };
  


    return (
      <div id="bgcontainer">
    <div id="bgleft"> 
     <img id="allgoimg" src={allgoimage} alt='' />
    <div id="login-container">
      
      <div>
        <label id="username">Username:</label>
        <input type="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label id="password">Password:</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <input type="checkbox" id="keep-logged-in" checked={keepLoggedIn} onChange={(e) => setKeepLoggedIn(e.target.checked)} />
        <label id="keep-logged-in">Keep me logged in</label>
      </div>
      <div>
        <a href="http://www.google.com" id="forgot">Forgot password?</a>
      </div>
      <button id="login" onClick={handleLogin}>Login</button>
      <div id="signup-container">
        <p>Don't have an account yet?</p>
        <button onClick={handleCreateOne}>Create one</button>
      </div>
    </div>
</div>
</div>
    );
}

export default Login;
