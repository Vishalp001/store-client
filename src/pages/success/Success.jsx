import React, {useEffect} from 'react';
import {useGlobalState} from '../../store/global.ts';
import {Axios} from '../../Utility.js';
import './success.scss';
import {Link} from 'react-router-dom';
import {
  getKeyFromLocalStorage,
  setKeyToLocalStorage,
} from '../../helpers/common.js';
const Success = () => {
  const state = useGlobalState();
  const userId = state.getUser().value?._id;
  const currentOrder = state.getOrder().value;

  const updatedOrder = {
    ...currentOrder,
    paymentMethod: 'Card',
    paymentStatus: 'Completed',
  };

  setKeyToLocalStorage('orderData', updatedOrder);

  useEffect(() => {
    const clearData = async () => {
      try {
        const res = await Axios.delete(`cart/user/${userId}`);
        state.setProduct(res.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    clearData();
  }, []);

  const handleClick = async () => {
    try {
      const getOrderData = await getKeyFromLocalStorage('orderData');

      const data = {
        user: getOrderData.user,
        products: getOrderData.products,
        totalAmount: getOrderData.totalAmount,
        shippingAddress: getOrderData.shippingAddress,
        paymentMethod: getOrderData.paymentMethod,
        paymentStatus: getOrderData.paymentStatus,
        userId: getOrderData.userId,
      };

      const res = await Axios.post('/order', data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className='successPage'>
        <h2> Payment Successfull</h2>
        <button onClick={handleClick}>
          <Link to='/'>Back to Homepage</Link>
        </button>
      </div>
    </>
  );
};

export default Success;
