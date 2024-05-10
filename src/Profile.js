import React, { useEffect, useState } from 'react';
import Navbar from './Components/Navbar';
import TesterNavbar from './Components/TesterNavbar';
import './Profile.css';
import avatar from './images/profile_image.jpg';
const Profile = () => {
  const [user, setUser] = useState(null);
  const role = localStorage.getItem('role');
  const [joinedDate, setJoinedDate] = useState(null);
  useEffect(() => {
    // Function to fetch user data
    // console.log(localStorage.getItem('token'))
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('token not found');
        }
        const response = await fetch('http://localhost:4000/auth/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const userData = await response.json();
        console.log(userData);
        setUser(userData);
        const formattedDate = new Date(userData.createdAt);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        setJoinedDate(formattedDate.toLocaleDateString('en-US', options));
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error
      }
    };

    // Call the fetchUserData function when component mounts
    fetchUserData();
  }, []); // Empty dependency array ensures this effect runs only once when component mounts


  return (
    <div className='profile-container' >
      <div>
        {/* Conditional rendering based on the role */}
        {role === 'developer' && <Navbar />}
        {role === 'tester' && <TesterNavbar />}
      </div>
      <h1 className="profiletxt">Hey {role} !</h1>
      <div className="containerprofile">
        {user ? (
          <div className='userdetails'>
            <p className="usernameprofile">Username:  &nbsp; {user.user}</p><br></br>
            <p>Role:  &nbsp; {user.role}</p><br></br>
            <p>Joined on: &nbsp; {joinedDate}</p>
            {/* Add more user information as needed */}
            <img className="avatar" src={avatar}></img>
          </div>
          
        ) : (
          <p className="loading">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
