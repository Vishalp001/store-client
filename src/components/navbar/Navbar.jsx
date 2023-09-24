import React, {useEffect, useState} from 'react';
import './navbar.scss';
import {Link} from 'react-router-dom';
import {removeItemsFromLocalStorage} from '../../helpers/common';
import {useGlobalState} from '../../store/global.ts';
import {AiOutlineShoppingCart, AiOutlineHeart} from 'react-icons/ai';
import Cart from '../cart/Cart';
import {fetchCartItem} from '../../services/apis';
const Navbar = () => {
  const state = useGlobalState();

  const user = state.getUser().value;
  const userId = state.getUser().value?._id;

  const [isCartOpen, setisCartOpen] = useState(false);

  const isLoggedIn = state.getisLoggedIn().value;
  const keysToRemove = ['user', 'orderData'];
  const handleLogout = () => {
    state.setisLoggedIn(false);
    state.setUser({});
    removeItemsFromLocalStorage(keysToRemove);
  };

  const handleCloseCart = () => {
    setisCartOpen(false);
  };

  const openCart = () => {
    setisCartOpen(true);
  };

  const [cartItems, setCartItems] = useState();

  useEffect(() => {
    // Fetch initial data from the state or wherever it comes from
    const fetchInitialData = async () => {
      try {
        const initialData = await state.getcartData(); // Replace with the correct method to fetch data
        setCartItems(initialData.value);
      } catch (error) {
        console.log(error);
      }
    };

    fetchInitialData();
  }, [state.getcartData().value?.length]);

  return (
    <>
      <div className='cartPopup'>
        <div>{isCartOpen && <Cart handleCloseCart={handleCloseCart} />}</div>
      </div>

      <nav className='navbar'>
        <div className='logo'>
          {/* <img src={logo} alt='' /> */}
          <div className='option'>
            <Link to='/'>
              <h2>DD</h2>
            </Link>
          </div>
        </div>
        <div className='nav-options'>
          <div className='option'>
            <Link to='/'>Home</Link>
          </div>

          {isLoggedIn ? (
            <>
              {user?.isAdmin ? (
                <div className='option'>
                  <Link to='/addProduct'>Add Product</Link>
                </div>
              ) : (
                ''
              )}

              <div className='userName option'>
                <span>{user.firstName}</span>
                <div className='dropdown'>
                  <Link>My Profile</Link>
                  <Link to='/orders'>Order</Link>
                  <Link>Wishlist</Link>
                </div>
              </div>

              <div className='option'>
                <Link to='/cart'>
                  <span>Cart</span>
                </Link>
              </div>
              <div className='option'>
                <Link to='/wishlist'>
                  <span className='cartIcon'>
                    <AiOutlineHeart />
                  </span>
                </Link>
              </div>

              <span onClick={openCart} className='cartIcon'>
                <span className='count'>{cartItems?.length}</span>
                <AiOutlineShoppingCart />
              </span>
              <div className='option'>
                <Link onClick={handleLogout}>
                  <span>Logout</span>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className='option'>
                <Link to='/login'>Login</Link>
              </div>
              <div className='option'>
                <Link to='/register'>Signup</Link>
              </div>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
