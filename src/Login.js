import React, { useState } from 'react';
import './Login.css';
import allgoimage from './images/Allgoblack.png';
import PrimaryButton from './Components/PrimaryButton';
import Input from './Components/Inputfield';
import Loading from './Components/FoursquareLoading';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { SnackbarProvider, useSnackbar } from 'notistack'
import SecondaryButton from './Components/SecondaryButton';
function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateOne = () => {
    window.location.href = './Register';
  }
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      enqueueSnackbar("Please fill all fields", {
        variant: 'warning'
      });

    } else {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        const response = await fetch('http://localhost:4000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password }),
          // credentials: 'include' // Include cookies
        });
        if (response.ok) {
          enqueueSnackbar("Login success", {
            variant: 'success'
          });
          const data = await response.json();
          const role = data.role;
          const token = data.token;
          const username = data.username;
          localStorage.setItem('token', token);
          localStorage.setItem('role', role);
          localStorage.setItem('username', username);
          navigate('/Myapps')

        } else {
          const data = await response.json();
          setErrorMessage(data.error || 'An error occurred during login');
          // window.alert(errorMessage);
          enqueueSnackbar(data.error, {
            variant: 'error'
          });
        }
      } catch (error) {
        console.error('Error during login:', errorMessage);
        setErrorMessage('An error occurred during login');
        enqueueSnackbar("An error occurred during login, try again", {
          variant: 'error'
        });
      } finally {
        setLoading(false); // Set loading to false when login process completes
      }
    }

  };
  return (
    <div id="bgcontainer">
      <div id="bgleft">
        <img id="allgoimg" src={allgoimage} alt='' />
        <div id="login-container">
          {loading && <Loading />}

          <div id="usernamee">
            <Input label="Username" inputType="Username" value={username} onChange={handleUsernameChange}></Input>
          </div>
          <div id="passwordd">
            <Input label="Password " inputType="password" value={password} onChange={handlePasswordChange}></Input>
          </div>
          <div>
            <a href="" id="forgot">Forgot password?</a>
          </div>
          <div id="loginbtn" onClick={handleLogin}>
            <PrimaryButton buttonText="Login" />
          </div>
          <p id="signup-container">Don't have an account yet?</p>
          <div id="creatone" onClick={handleCreateOne}>
            <SecondaryButton buttonText="Sign up" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
