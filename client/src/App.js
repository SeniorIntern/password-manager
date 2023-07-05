import React, { useState, useEffect } from 'react';
import './App.css';
import Axios from 'axios';

function App() {
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');

  const [passwordList, setPasswordList] = useState([]);
  useEffect(() => {
    Axios.get('http://localhost:3001/showpasswords').then((response) => {
      setPasswordList(response.data);
      // console.log(response.data);
    });
  }, []);

  const addPassword = () => {
    Axios.post('http://localhost:3001/addcreds', {
      password: password,
      title: title,
    });
  };

  const decryptPassword = (encryption) => {
    Axios.post('http://localhost:3001/decryptpassword', {
      password: encryption.password,
      iv: encryption.iv,
    }).then((response) => {
      setPasswordList(
        passwordList.map((val) => {
          return val.id == encryption.id
            ? {
                id: val.id,
                password: val.password,
                title: response.data,
                iv: val.iv,
              }
            : val;
        })
      );
    });
  };

  return (
    <div className='App'>
      <div className='details__form'>
        <input
          type='text'
          placeholder='Password'
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <input
          type='text'
          placeholder='Title'
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <button onClick={addPassword}>Add Password</button>
      </div>
      <div className='password__container'>
        {passwordList.map((val, key) => {
          return (
            <div
              className='passwords'
              onClick={() => {
                decryptPassword({
                  password: val.password,
                  iv: val.iv,
                  id: val.id,
                });
              }}
              key={key}
            >
              <h1> {val.title} </h1>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
