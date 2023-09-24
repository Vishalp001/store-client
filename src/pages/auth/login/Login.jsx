import React, {useState} from 'react';
import {Axios} from '../../../Utility';
import {useGlobalState} from '../../../store/global.ts';
import {setKeyToLocalStorage} from '../../../helpers/common.js';
import {useNavigate} from 'react-router-dom';
// import toast from 'react-hot-toast';
import {toast} from 'react-hot-toast';

const Login = () => {
  const state = useGlobalState();
  const navigate = useNavigate();

  const [items, setItems] = useState({
    username: '',
    password: '',
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
      const res = await Axios.post(`/auth/login`, submitData);
      // console.log(res);
      if (res.status === 200) {
        state.setUser(res.data);
        state.setisLoggedIn(true);
        setKeyToLocalStorage('user', res.data);
        navigate('/');
        toast.success('Login Successfully');
      } else {
        console.log('Now working');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* <Toaster position='bottom-center' reverseOrder={false} /> */}
      <div className='mainConteiner'>
        <div className='container'>
          <form
            className='add-product-form'
            method='post'
            onSubmit={handleSubmit}>
            <h1>Login</h1>
            <label htmlFor='username'>Username:</label>
            <input
              type='text'
              id='username'
              name='username'
              required
              value={items.username}
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
            <input type='submit' defaultValue='Submit' />
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
