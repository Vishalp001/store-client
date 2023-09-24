import React, {useState} from 'react';
import './register.scss';
import {Axios} from '../../../Utility';
const Register = () => {
  const [items, setItems] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const handleChange = (e) => {
    e.preventDefault();
    const {name, value} = e.target;
    // console.log(items);
    setItems({...items, [name]: value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = items;
      const res = await Axios.post(`/auth/register`, submitData);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className='mainConteiner'>
        <div className='container'>
          <form
            className='add-product-form'
            method='post'
            onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <label htmlFor='username'>Username:</label>
            <input
              type='text'
              id='username'
              name='username'
              required
              value={items.username}
              onChange={handleChange}
            />
            <label htmlFor='email'>Email:</label>
            <input
              type='email'
              id='email'
              name='email'
              value={items.email}
              required
              onChange={handleChange}
            />
            <label htmlFor='password'>Password:</label>
            <input
              type='password'
              id='password'
              name='password'
              required
              value={items.password}
              onChange={handleChange}
            />
            <label htmlFor='firstName'>First Name:</label>
            <input
              type='text'
              id='firstName'
              name='firstName'
              required
              value={items.firstName}
              onChange={handleChange}
            />
            <label htmlFor='lastName'>Last Name:</label>
            <input
              type='text'
              id='lastName'
              name='lastName'
              required
              value={items.lastName}
              onChange={handleChange}
            />
            <input type='submit' defaultValue='Submit' />
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
