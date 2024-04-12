import React, { useState } from 'react';
import './Login.css';
import allgoimage from './images/Allgoblack.png';
import PrimaryButton from './Components/primaryButton';
import Input from './Components/Inputfield';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateOne = () => {
    window.location.href = './Register';
  }
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
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

        <div id="usernamee"> 
       <Input label="Username" inputType="Username" value={username} onChange={handleUsernameChange}></Input>
        </div>
          <div id="passwordd"> 
          <Input label="Password " inputType="password" value={password} onChange={handlePasswordChange}></Input>
        </div>
          <div>
            <input type="checkbox" id="keep-logged-in" checked={keepLoggedIn} onChange={(e) => setKeepLoggedIn(e.target.checked)} />
            <label id="keep-logged-in">Keep me logged in</label>
          </div>
          <div>
            <a href="http://www.google.com" id="forgot">Forgot password?</a>
          </div>
          <div id="loginbtn" onClick={handleLogin}>
            <PrimaryButton buttonText="Login" />
          </div>
          <div id="signup-container">
            <p>Don't have an account yet?</p>
            <div id="creatone" onClick={handleCreateOne}>
              <PrimaryButton buttonText="CreateOne" />
            </div>
          </div>
        </div>
    
  </div>
  </div>
  );
}

export default Login;
