import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import 'react-toastify/dist/ReactToastify.css';
import { toastService } from '../../data';

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log(email, password);
    if (email === undefined || password === undefined) {
      setError(true);
    } else {
      setError(false);
    }
    if (error !== true && email !== undefined) {
      let result = await fetch('http://localhost:9009/login', {
        method: 'post',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      result = await result.json();
      if (result.errors) {
        navigate('/login');
        result.errors?.map((item) => {
          toastService.error(item?.msg);
        });
      } else {
        if (result?.result?.role === 'ADMIN') {
          navigate('/profile');
        } else {
          navigate('/');
        }
        toastService.success('Logged In successfully 🦄');

        localStorage.setItem('user', JSON.stringify(result?.result));
        localStorage.setItem('token', JSON.stringify(result?.auth));
      }
    }
  };

  return (
    <div className="form">
      <div className="fieldContainer">
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
        />
        {error && email === undefined && (
          <span className="errorText">Please enter email</span>
        )}
      </div>
      <div className="fieldContainer">
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
        />
        {error && password === undefined && (
          <span className="errorText">Please enter password</span>
        )}
      </div>
      <button onClick={() => handleSubmit()}>Submit</button>
    </div>
  );
};

export default Login;
