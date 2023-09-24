import React, {useEffect, useState} from 'react';
import './productDetails.scss';
import {useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';
import {Axios} from '../../Utility';
import {useGlobalState} from '../../store/global.ts';

const ProductDetails = () => {
  const location = useLocation();
  const path = location.pathname.split('/')[2];
  const state = useGlobalState();
  const isUser = state.getisLoggedIn().value;
  const navigate = useNavigate();

  console.log(isUser);

  // Check produce is present in cart
  const getProduct = state
    .getcartData()
    .value?.find((item) => item.product === path);

  const [liked, setLiked] = useState(false);
  const handleLike = () => {
    setLiked(!liked);
  };

  const handleBuyNow = () => {
    // Add your logic for "Buy Now" action here
    console.log('Product buy now!');
  };

  // Get Single Product
  const [productDetails, setProductDetails] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Axios.get(`/product/${path}`);
        setProductDetails(res.data);
        // console.log(res.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [path]);

  // Add Product to the cart
  const handleAddToCart = async () => {
    if (!isUser) {
      navigate('/login');
    } else {
      const newItem = {
        product: productDetails._id,
        price: productDetails.price,
        user: state.getUser().value._id,
      };
      const updatedData = await Axios.post(`/cart`, newItem);
      state.setcartData((prevData) => [...prevData, updatedData.data]);
    }
  };

  return (
    <div className='product-details'>
      <div className='product-image'>
        {productDetails?.images?.length > 0 ? (
          <img
            src={productDetails?.images[0]}
            alt={productDetails.productName}
          />
        ) : (
          ''
        )}
      </div>
      <div className='product-info'>
        <h1 className='product-title'>{productDetails.title}</h1>
        <div className='product-price'>Price: {productDetails.price}</div>
        <div className='product-category'>
          Category: {productDetails.category}
        </div>
        <div className='product-description'>{productDetails.description}</div>
        <div className='product-actions'>
          <i
            className={`heart-icon ${liked ? 'fas fa-heart' : 'far fa-heart'}`}
            onClick={handleLike}></i>

          {getProduct?.product ? (
            <button className='add-to-cart-btn'>Item Added to Cart</button>
          ) : (
            <button className='add-to-cart-btn' onClick={handleAddToCart}>
              Add to Cart
            </button>
          )}
          <button className='buy-now-btn' onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
