import React, { useState, useEffect } from 'react';
import './nav.css';
import { useNavigate } from 'react-router-dom';

const Nav = () => {
  const navigate = useNavigate();
  const auth = localStorage.getItem('user');
  const [data, setData] = useState([]);

  const dataOne = [
    {
      title: 'Profile',
      path: '',
      role: 'ADMIN',
    },
    {
      title: 'Add',
      path: 'add',
      role: 'ADMIN',
    },
    {
      title: 'Log Out',
      path: 'login',
      role: 'ADMIN',
    },
  ];

  const dataTwo = [
    {
      title: 'Home',
      path: '',
      role: 'CLIENT',
    },
    {
      title: 'Add',
      path: 'add',
      role: 'CLIENT',
    },
    {
      title: 'Log Out',
      path: 'login',
      role: 'ADMIN',
    },
  ];

  const dataNew = [
    {
      title: `${auth ? 'Log Out' : 'Sign Up'}`,
      path: 'signup',
    },
    {
      title: 'Login',
      path: 'login',
    },
  ];

  useEffect(() => {
    if (auth) {
      if (JSON.parse(auth)?.role === 'ADMIN') {
        setData(dataOne);
      } else {
        setData(dataTwo);
      }
    } else {
      setData(dataNew);
    }
  }, [auth]);

  return (
    <>
      <div className="nav">
        {/* <button>&#9776;</button>  code for humburger menu */}
        {data?.map((item, index) => {
          return (
            <p
              key={index}
              onClick={() => {
                navigate(item.path);
                if (item.title === 'Log Out') {
                  localStorage.clear();
                } else return;
              }}
            >
              {item.title}
            </p>
          );
        })}
        {auth && <p>😊 {JSON.parse(auth)?.name}</p>}
      </div>
    </>
  );
};

export default Nav;
