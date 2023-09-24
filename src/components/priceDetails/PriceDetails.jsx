import React, {useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {BiSolidRightArrow} from 'react-icons/bi';
import './priceDetails.scss';

const PriceDetails = ({cartItems}) => {
  const [freeDevelery, setFreeDelivery] = useState(false);
  const location = useLocation();

  const priceArray = cartItems?.map((item) => item.price) || [];
  let sum = 0;
  for (const num of priceArray) {
    sum += num;
  }

  useEffect(() => {
    if (cartItems && sum > 500) {
      setFreeDelivery(true);
    } else {
      setFreeDelivery(false);
    }
  }, [cartItems, sum]);

  return (
    <div>
      <div className='cartTotal'>
        <h1>PRICE DETAILS</h1>
        <div className='rowOne'>
          <p>
            Price ({cartItems?.length}{' '}
            {cartItems?.length > 1 ? 'Items' : 'Item'})
          </p>
          <p className='price'>₹{sum}</p>
        </div>
        <div className='rowOne'>
          <p>Delivery Charges</p>
          {freeDevelery ? <p className='free'>Free</p> : <p>₹40</p>}
        </div>
        <div className='rowOne totalAmt'>
          <p>Total Amount</p>
          <p className='price'>
            {freeDevelery ? <span>₹{sum}</span> : <span>₹{sum + 40}</span>}
          </p>
        </div>
        {location.pathname === '/cart' && (
          <Link to='/checkout'>
            <button className='checkoutBtn'>Proceed To Checkout</button>
          </Link>
        )}
      </div>
      {!freeDevelery && (
        <div className='freeCart'>
          <div className='rowOne'>
            <div>
              <p>Add items worth ₹{500 - sum} more for FREE delivery</p>
              <img
                src='https://rukminim2.flixcart.com/www/400/400/promos/06/04/2017/32f62e07-a9e4-4bfc-88d8-3eeb8b4be127.png?q=80'
                alt=''
              />
            </div>
            <p className='subText'>Eligible only for products</p>
          </div>
          <div className='rowTwoInner'>
            <p>Browse Super Value store</p>
            <Link to='/'>
              <BiSolidRightArrow />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceDetails;
