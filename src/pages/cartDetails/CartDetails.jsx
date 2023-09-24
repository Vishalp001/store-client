import React, {useEffect, useState} from 'react';
import {useGlobalState} from '../../store/global.ts';
import './cartDetails.scss';
import {RxCross2} from 'react-icons/rx';
import {BiSolidRightArrow} from 'react-icons/bi';
import {MdKeyboardArrowLeft, MdKeyboardArrowRight} from 'react-icons/md';
import {Axios} from '../../Utility.js';
import {udateCartItem} from '../../services/apis.js';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import PriceDetails from '../../components/priceDetails/PriceDetails.jsx';

const CartDetails = () => {
  const state = useGlobalState();

  const cartItems = state.getcartData().value;
  const allProduct = state.getProduct().value;

  // console.log(cartItems?.length, 'cartItems');

  const cartItemId = cartItems?.map((item) => item.product) || [];

  const priceArray = cartItems?.map((item) => item.price) || [];
  let sum = 0;
  for (const num of priceArray) {
    sum += num;
  }

  const [cartProduct, setcartProduct] = useState([]);

  useEffect(() => {
    const productInCart = () => {
      if (!cartItems || cartItems.length === 0) return;
      const item = allProduct?.filter((product) =>
        cartItemId.includes(product._id)
      );
      setcartProduct(item);
    };

    productInCart();
  }, [cartItems?.length, allProduct?.length]);

  // ------------------------------------------------------------------------------------------------
  // Get Item Quantity in Cart
  const getCartItemQuantity = (productId) => {
    const cartItem = cartItems?.find((item) => item.product === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Get Subtotal of cart
  const getSubTotal = (productId) => {
    const cartItem = cartItems?.find((item) => item.product === productId);
    return cartItem ? cartItem.price : 0;
  };

  // Delete Cart item
  const deleteItem = async (productId) => {
    try {
      const cartItem = cartItems?.find((item) => item.product === productId);
      if (cartItem) {
        await Axios.delete(`/cart/${cartItem._id}`);
        setcartProduct((previousData) =>
          previousData.filter((product) => product._id !== productId)
        );

        // After successful deletion, update the setcartData state
        state.setcartData((previousData) =>
          previousData.filter((product) => product.product !== productId)
        );
      } else {
        console.log('Cart Item Not Found');
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  // ---------------------------------------------------------------------

  // Update the Quantity
  const updateQuantity = async (item, action) => {
    try {
      const productId = item._id;

      const desiredCartItem = cartItems.find(
        (item) => item.product === productId
      );
      if (!desiredCartItem) return;

      let updatedQuantity, updatedPrice;

      if (
        action === 'increment' &&
        desiredCartItem.quantity < item.stockQuantity
      ) {
        updatedQuantity = desiredCartItem.quantity + 1;
        updatedPrice = desiredCartItem.price + item.price;
      } else if (action === 'decrement' && desiredCartItem.quantity > 1) {
        updatedQuantity = desiredCartItem.quantity - 1;
        updatedPrice = desiredCartItem.price - item.price;
      }

      const payload = {
        quantity: updatedQuantity,
        price: updatedPrice,
      };

      const cartResponse = await udateCartItem(desiredCartItem._id, payload);
      const updatedCartItem = await cartResponse.data;

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
      <div className='cartDetailsContainer'>
        {cartItems?.length > 0 ? (
          <>
            <div className='cartItems'>
              {cartProduct?.map((item) => (
                <div key={item._id} className='cartItem'>
                  <div className='divOne'>
                    <div className='imgDiv'>
                      <img src={item?.images[0]} alt='' />
                    </div>
                    <h1>{item.productName}</h1>
                  </div>
                  <div className='divTwo'>
                    <p>₹ {item.price}.00</p>
                  </div>
                  <div className='divThree'>
                    <button onClick={() => updateQuantity(item, 'decrement')}>
                      <MdKeyboardArrowLeft />
                    </button>
                    <input
                      type='text'
                      value={getCartItemQuantity(item._id)}
                      readOnly
                    />
                    <button onClick={() => updateQuantity(item, 'increment')}>
                      <MdKeyboardArrowRight />
                    </button>
                  </div>
                  <div className='divFour'>{getSubTotal(item._id)}</div>
                  <div className='divFive'>
                    <p
                      className='crossIocn'
                      onClick={() => deleteItem(item._id)}>
                      <RxCross2 />
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className='rowTwo'>
              <PriceDetails cartItems={cartItems} />
            </div>
          </>
        ) : (
          <div className='noItems'>
            <img
              src='https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90'
              alt=''
            />
            <h2>Your cart is empty! </h2>
            <p>Add items to it now.</p>
            <Link to='/'>
              <button>Shop Now</button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDetails;
