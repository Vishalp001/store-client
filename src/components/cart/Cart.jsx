import React, {useEffect, useState} from 'react';
import {AiOutlineClose, AiOutlineDelete} from 'react-icons/ai';
import './cart.scss';
import {Axios} from '../../Utility';
import {useGlobalState} from '../../store/global.ts';
import {udateCartItem} from '../../services/apis';

const Cart = ({handleCloseCart}) => {
  // Cart
  const [productsData, setproductsData] = useState();
  const state = useGlobalState();

  const cartItems = state.getcartData().value;

  const priceArray = cartItems.map((item) => item.price);

  let sum = 0;

  for (const num of priceArray) {
    sum += num;
  }

  useEffect(() => {
    const fetchProductData = async () => {
      if (!cartItems || cartItems.length === 0) return;

      const productPromises = cartItems?.map(async (cartItem) => {
        const response = await Axios.get(`/product/${cartItem.product}`);
        return response.data;
      });
      const productsData = await Promise.all(productPromises);
      setproductsData(productsData);
    };

    fetchProductData();
  }, [cartItems.length]);

  const handleDelete = async (item) => {
    try {
      const productIdToFind = item._id;
      const desiredCartItem = cartItems.find(
        (cartItem) => cartItem.product === productIdToFind
      );

      if (desiredCartItem) {
        await Axios.delete(`/cart/${desiredCartItem._id}`);
        // After successful deletion, update the productsData state
        setproductsData((prevProductsData) =>
          prevProductsData.filter((product) => product._id !== item._id)
        );

        // After successful deletion, update the setcartData state
        state.setcartData((prevData) =>
          prevData.filter((dataItem) => dataItem.product !== productIdToFind)
        );
      } else {
        console.log('Desired cart item not found.');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getCartItemQuantity = (productId) => {
    const cartItem = cartItems.find((item) => item.product === productId);
    // console.log(cartItem, 'cartItems');
    return cartItem ? cartItem.quantity : 0;
  };

  const updateQuantity = async (item, action) => {
    try {
      const productIdToFind = item._id;
      const desiredCartItem = cartItems.find(
        (cartItem) => cartItem.product === productIdToFind
      );
      if (!desiredCartItem) return;

      const cartId = desiredCartItem._id;
      const cartPrice = item.price;
      const stockQuantity = item.stockQuantity;
      let updatedQuantity, updatedPrice;

      if (action === 'increment' && desiredCartItem.quantity < stockQuantity) {
        updatedQuantity = desiredCartItem.quantity + 1;
        updatedPrice = desiredCartItem.price + cartPrice;
      } else if (action === 'decrement' && desiredCartItem.quantity > 1) {
        updatedQuantity = desiredCartItem.quantity - 1; // Ensure quantity never goes below 1
        updatedPrice = desiredCartItem.price - cartPrice;
      }

      const payload = {
        quantity: updatedQuantity,
        price: updatedPrice,
      };

      const cartResponse = await udateCartItem(cartId, payload);
      const updatedCartItem = await cartResponse.data;

      // Create a new array of cart items with the updated item
      const updatedCartItems = cartItems.map((cartItem) =>
        cartItem.product === updatedCartItem.product
          ? updatedCartItem
          : cartItem
      );

      const normalData = JSON.parse(JSON.stringify(updatedCartItems));

      state.setcartData(normalData);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className='cart-popup cart'>
        <div className='header'>
          <h2>Shopping Bag</h2>
          <button onClick={handleCloseCart}>
            <AiOutlineClose />
          </button>
        </div>

        {cartItems.length > 0 ? (
          <p className='subTotal'>
            Subtotal: <span>₹{sum}</span>
          </p>
        ) : (
          <p>Cart Item is Empty</p>
        )}

        <div className='cartItems'>
          {productsData?.map((item) => (
            <div key={item._id} className='item'>
              <div className='colOne'>
                <div className='image'>
                  <img src={item.images[0]} alt='' />
                </div>
              </div>
              <div className='colTwo'>
                <div className='description'>
                  <span>{item.productName}</span>
                </div>
                <div className='quantity'>
                  <button
                    className='minus-btn'
                    onClick={() => updateQuantity(item, 'decrement')}>
                    <img
                      src='https://designmodo.com/demo/shopping-cart/minus.svg'
                      alt=''
                    />
                  </button>
                  <input
                    type='text'
                    placeholder='1'
                    value={getCartItemQuantity(item._id)}
                    readOnly
                  />
                  <button
                    className='plus-btn'
                    onClick={() => updateQuantity(item, 'increment')}>
                    <img
                      src='https://designmodo.com/demo/shopping-cart/plus.svg'
                      alt=''
                    />
                  </button>
                </div>
                <div className='priceAndDelete'>
                  <div className='total-price'>{item.price} Rs</div>
                  <div onClick={() => handleDelete(item)} className='deleteBtn'>
                    <AiOutlineDelete />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Cart;
