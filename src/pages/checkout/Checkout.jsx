import React, {useEffect, useState} from 'react';
import './checkout.scss';
import PriceDetails from '../../components/priceDetails/PriceDetails';
import Address from '../../components/address/Address';
import {useGlobalState} from '../../store/global.ts';
import OrderSummary from '../../components/orderSummary/OrderSummary';
import Payment from '../../components/payment/Payment';
const Checkout = () => {
  const state = useGlobalState();
  const cartItems = state.getcartData().value;

  // console.log(state.getOrderStep().value);

  const isAddress = state.getOrderStep().value?.address;
  const isOrderSummary = state.getOrderStep().value?.orderSummary;

  return (
    <>
      <div className='checkoutContainer wrapper'>
        <div className='colOne'>
          <div className='stepOne'>
            {/* <button onClick={handlePlaceOrder}>Place Order</button> */}
            <Address />
          </div>
          {isAddress && (
            <div className='stepTwo'>
              <OrderSummary />
            </div>
          )}
          {isOrderSummary && (
            <div className='stepThree'>
              <Payment />
            </div>
          )}
        </div>
        <div className='colTwo'>
          <PriceDetails cartItems={cartItems} />
        </div>
      </div>
    </>
  );
};

export default Checkout;
