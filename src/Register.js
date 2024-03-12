import React, { useState } from 'react';
import './Register.css';
const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleGoback=()=>{
        window.location.href='./'
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add logic to handle form submission, like sending data to a server
    console.log(formData);
    // Reset form after submission
    setFormData({
      username: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div id="bgcontainer">
      <div id="reg-container">
      <h id="regtext">Register</h>
        <form onSubmit={handleSubmit}>
            
          <div>
            <label htmlFor="username" id="usertext">Username:</label>
            <input
              type="text"
              id="regusername"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password" id="passtext">Password:</label>
            <input
              type="password"
              id="regpassword"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" id="confirmpasstxt">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" id="reg-btn">Register</button>
          <button type="submit" id="goback-btn" onClick={handleGoback}>Go back</button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
