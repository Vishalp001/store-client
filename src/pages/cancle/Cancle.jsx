import React from 'react';
import {Link} from 'react-router-dom';
import './cancle.scss';

const Cancle = () => {
  return (
    <>
      <div className='canclePage'>
        <h2>Payment is Cancle</h2>
        <Link to='/checkout'>Proceed to Checkout page</Link>
      </div>
    </>
  );
};

export default Cancle;
