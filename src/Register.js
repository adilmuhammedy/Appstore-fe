import React, { useState } from 'react';
import './Register.css';
import Input from './Components/Inputfield';
import PrimaryButton from './Components/PrimaryButton';

const RegistrationPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [roleError, setRoleError] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setUsernameError(''); // Clear any previous error
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(''); // Clear any previous error
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError(''); // Clear any previous error
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

    // Validate username
    if (!username) {
      setUsernameError('Username is required');
      return;
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    // Validate confirmPassword
    if (!confirmPassword) {
      setConfirmPasswordError('Confirm Password is required');
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
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

      if (response.ok) {
        window.alert(`Registration Success\nUser: ${data.user.username}\nMessage: ${data.message}`);
        window.location.href = '/';
      } else {
        window.alert(`Registration failed\nError: ${data.error}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      window.alert('Error during registration');
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
            {passwordError && <span className="error">{passwordError}</span>}
          </div>
          <div id="confirminput">
            <Input label="Confirm Password" inputType="password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
            {confirmPasswordError && <span className="error">{confirmPasswordError}</span>}
          </div>
          <div >
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
            {roleError && <span  className="error">{roleError}</span>}
          </div>
          <div id="regbtn" onClick={handleSubmit}>
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
