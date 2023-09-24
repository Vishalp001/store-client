import React, {useEffect, useState} from 'react';
import './orders.scss';
import {Axios} from '../../Utility';
import {getKeyFromLocalStorage} from '../../helpers/common.js';
import {useGlobalState} from '../../store/global.ts';

const Orders = () => {
  const user = getKeyFromLocalStorage('user');

  const [orders, setOrders] = useState([]);

  const state = useGlobalState();

  useEffect(() => {
    const getOrder = async () => {
      const getOrder = await Axios.get(`order/${user._id}`);
      // console.log(getOrder);
      setOrders(getOrder.data);
    };
    getOrder();
  }, []);

  console.log(orders, 'orders');

  return (
    <>
      {/* {orders.map((order) => (
       <></>
      */}
      <div className='orderContainer'>
        <h1>Your Orders</h1>

        {orders.map((order) => (
          <div className='orderItem'>
            <div className='rowOne'>
              {order.products.map((name) => (
                <>
                  <div className='productDetails'>
                    <h2> {name.productName}</h2>
                    <p>Qunatity: {name.quantity}</p>
                    <p>Price: {name.price}</p>
                  </div>
                </>
              ))}
            </div>
            <div className='footerDiv'>
              <p>Order Status {order.status} </p>
              <p>Total Amount {order.totalAmount} </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Orders;
