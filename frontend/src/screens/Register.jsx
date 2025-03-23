import React,{useContext, useState}  from 'react';
import {Link, useNavigate } from 'react-router-dom';
import axios from '../config/axios.jsx'

import { UserContext } from '../context/user.context.jsx';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const { setUser } = useContext(UserContext);

  function submitHandler(e){
    e.preventDefault();

    axios.post('/users/register', {email, password})
                        .then((res) => {
                          console.log(res.data) ;

                          localStorage.setItem('token', res.data.token) ;
                          setUser(res.data.user) ;

                          navigate('/') ;
                        })
                        .catch((error) => {
                          console.log(error.response.data) ;
                        })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-80">
        <h1 className="text-2xl text-white mb-4">Register</h1>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input onChange={(e) => setEmail(e.target.value)}
              id="email"
              type="email"
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input onChange={(e) => setPassword(e.target.value)}
              id="password"
              type="password"
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg"
          >
            Register
          </button>
        </form>
        <p className="text-white mt-4">
          Already have an account? <a href="/login" className="text-blue-300">login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
