import React, {useEffect, useState} from 'react';
import './orderSummary.scss';
import {useGlobalState} from '../../store/global.ts';
import {Axios} from '../../Utility';
import {setKeyToLocalStorage} from '../../helpers/common';

const OrderSummary = () => {
  const state = useGlobalState();
  const cartItems = state.getcartData().value;
  const allProduct = state.getProduct().value;
  const cartItemId = cartItems?.map((item) => item.product) || [];

  const [cartProduct, setcartProduct] = useState([]);

  // console.log(cartItems);

  const getSubTotal = (productId) => {
    const cartItem = cartItems?.find((item) => item.product === productId);
    return cartItem ? cartItem.price : 0;
  };

  const getQunatity = (productId) => {
    const cartItem = cartItems?.find((item) => item.product === productId);
    return cartItem ? cartItem.quantity : 0;
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

  const priceArray = cartItems?.map((item) => item.price) || [];
  let sum = 0;
  for (const num of priceArray) {
    sum += num;
  }

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

  // const normalData = JSON.parse(JSON.stringify(cartProduct));

  // Create a new array with product names
  const updatedCartItems = cartItems?.map((item) => ({
    ...item,
    productName:
      allProduct?.find((product) => product._id === item.product)
        ?.productName || 'Product Name Not Found',
    productPrice:
      allProduct?.find((product) => product._id === item.product)?.price ||
      'Product Name Not Found',
  }));

  // console.log(updatedCartItems);

  const handlePlaceOrder = () => {
    const currentOrder = state.getOrder().value;
    state.setOrder({
      ...currentOrder,
      userId: state.getUser().value?._id,
      user:
        state.getUser().value?.firstName +
        ' ' +
        state.getUser().value?.lastName,
      // products: product,
      products: updatedCartItems,
      totalAmount: sum,
    });

    setKeyToLocalStorage('orderData', state.getOrder().value);

    const setOrderStep = state.getOrderStep().value;

    state.setOrderStep({
      ...setOrderStep,
      orderSummary: true,
    });
  };

  console.log(state.getOrder().value, 'Order');

  return (
    <>
      <div className='cartContainer'>
        <div className='header'>
          <span className='number'>2</span>
          <span className='heading'>Order Summary</span>
        </div>
        <div className='cartItems'>
          {cartProduct?.length > 0 ? (
            <>
              {cartProduct?.map((item) => (
                <div className='cartItem' key={item._id}>
                  <div className='colOne'>
                    <div className='producImage'>
                      <img src={item.images} alt='' />
                    </div>
                    <div className='productDesc'>
                      <h2>{item.productName}</h2>
                      <p className='desc'>{item.description}</p>
                      <p className='price'>
                        <span>₹</span>
                        {getSubTotal(item._id)}.00
                      </p>
                      <p className='quantity'>
                        <span>quantity:</span> {getQunatity(item._id)}
                      </p>
                    </div>
                  </div>
                  <button
                    className='removeBtn'
                    onClick={() => deleteItem(item._id)}>
                    Remove
                  </button>
                </div>
              ))}
              <div className='btnDiv'>
                <button className='orangeBtn' onClick={handlePlaceOrder}>
                  Continue
                </button>
              </div>
            </>
          ) : (
            <p className='cartItem'> Your checkout has no items.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderSummary;
