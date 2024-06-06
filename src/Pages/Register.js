import React, { useState } from 'react';
import '../Css/Register.css';
import Input from '../Components/Inputfield';
import PrimaryButton from '../Components/PrimaryButton';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
const RegistrationPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [roleError, setRoleError] = useState('');

  const validateUsername = (username) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@visteon\.com$/;
    if (!username) {
      return 'Username is required';
    } else if (!emailPattern.test(username)) {
      return 'Username must be in the format name@visteon.com';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    } else if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
      return 'Confirm Password is required';
    } else if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    const error = validateUsername(newUsername);
    setUsernameError(error); // Set the error message if any
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const error = validatePassword(newPassword);
    setPasswordError(error);

    // Update confirm password error if passwords do not match
    const confirmPasswordError = validateConfirmPassword(newPassword, confirmPassword);
    setConfirmPasswordError(confirmPasswordError);
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    const error = validateConfirmPassword(password, newConfirmPassword);
    setConfirmPasswordError(error);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setRoleError(''); // Clear any previous error
  };

  const handleGoback = () => {
    window.location.href = './';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usernameValidationError = validateUsername(username);
    setUsernameError(usernameValidationError);

    const passwordValidationError = validatePassword(password);
    setPasswordError(passwordValidationError);

    const confirmPasswordValidationError = validateConfirmPassword(password, confirmPassword);
    setConfirmPasswordError(confirmPasswordValidationError);

    if (!role) {
      setRoleError('No role selected');
    } else {
      setRoleError('');
    }

    if (usernameValidationError || passwordValidationError || confirmPasswordValidationError || !role) {
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          role,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        navigate('/')
        enqueueSnackbar(`Registration Success\nMessage: ${data.message}`, { variant: 'success' });
      
      } else {
        enqueueSnackbar(`Registration failed\nError: ${data.error}`, { variant: 'error' });
      }
    } catch (error) {
      console.error('Error during registration:', error);
      enqueueSnackbar('Error during registration', { variant: 'error' });
    }
  };

  return (
    <div id="bgcontainer">
      <div id="reg-container">
        <h id="regtext">Register</h>
        <form onSubmit={handleSubmit}>
          <div id="usernameinput">
            <Input label="Username" inputType="text" value={username} onChange={handleUsernameChange} />
            {usernameError && <span className="error">{usernameError}</span>}
          </div>
          <div id="passwordinput">
            <Input label="Password" inputType="password" value={password} onChange={handlePasswordChange} />
            {passwordError && <span className="password-error">{passwordError}</span>}
          </div>
          <div id="confirminput">
            <Input label="Confirm Password" inputType="password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
            {confirmPasswordError && <span className="confirm-error">{confirmPasswordError}</span>}
          </div>
          <div>
            <label htmlFor="role" id="roletext">Role:</label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={handleRoleChange}
              required
            >
              <option value="">Select</option>
              <option value="developer">Developer</option>
              <option value="tester">Tester</option>
            </select>
            {roleError && <span className="error">{roleError}</span>}
          </div>
          <div id="regbtn">
            <PrimaryButton buttonText="Register" />
          </div>
          <div id="gobackbtn" onClick={handleGoback}>
            <PrimaryButton buttonText="Go Back" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
