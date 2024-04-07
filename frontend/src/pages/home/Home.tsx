import React from 'react';
import { Outlet } from 'react-router-dom';
import './Home.module.scss';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Welcome to the Homepage</h1>
      <p>This is the content of the homepage.</p>
      
      <Outlet />
    </div>
  );
};

export default Home;