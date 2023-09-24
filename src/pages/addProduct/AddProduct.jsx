import React, {useState} from 'react';
import './addProduct.scss';
import {Axios} from '../../Utility.js';
const AddProduct = () => {
  const [items, setItems] = useState({
    productName: '',
    price: '',
    description: '',
    images: '',
    category: '',
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
      const res = await Axios.post(`/product/create`, submitData);
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
            <h1>Add Product</h1>
            <label htmlFor='title'>Product Name:</label>
            <input
              type='text'
              id='title'
              name='productName'
              required
              value={items.productName}
              onChange={handleChange}
            />
            <label htmlFor='price'>Price:</label>
            <input
              type='number'
              step='0.01'
              id='price'
              name='price'
              value={items.price}
              required
              onChange={handleChange}
            />
            <label htmlFor='description'>Description:</label>
            <textarea
              id='description'
              name='description'
              required
              value={items.description}
              onChange={handleChange}
            />
            <label htmlFor='image'>Image URL:</label>
            <input
              type='url'
              id='image'
              name='images'
              required
              value={items.images}
              onChange={handleChange}
            />
            <label htmlFor='category'>Category:</label>
            <input
              type='text'
              id='category'
              name='category'
              required
              value={items.category}
              onChange={handleChange}
            />
            <input type='submit' defaultValue='Submit' />
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
