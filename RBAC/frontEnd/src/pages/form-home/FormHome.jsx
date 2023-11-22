import React, { useState } from 'react';
import './formHome.css';
import { useNavigate } from 'react-router-dom';
import { toastService } from '../../data';
import 'react-toastify/dist/ReactToastify.css';

const FormHome = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const [error, setError] = useState();

  const handleSubmit = async () => {
    console.log(name, email, password);
    if (name === undefined || email === undefined || password === undefined) {
      setError(true);
    } else {
      setError(false);
    }
    if (error !== true && name !== undefined) {
      let result = await fetch('http://localhost:9009/register', {
        method: 'post',
        body: JSON.stringify({
          name,
          email,
          password,
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      result = await result.json();

      if (result.errors) {
        navigate('/signup');
        result.errors?.map((item) => {
          toastService.error(item?.msg);
        });
      } else {
        navigate('/login');
        toastService.success('Registered successfully 🦄');
        // localStorage.setItem('user', JSON.stringify(result?.result));
        // localStorage.setItem('token', JSON.stringify(result?.auth));
      }
    }
  };

  return (
    <div className="form">
      <div className="fieldContainer">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Name"
        />
        {error && name === undefined && (
          <span className="errorText">Please enter name</span>
        )}
      </div>
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

export default FormHome;
