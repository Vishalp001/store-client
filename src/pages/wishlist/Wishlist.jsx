import React, {useEffect, useState} from 'react';
import './wishlist.scss';
import {useGlobalState} from '../../store/global.ts';
import {Link, useNavigate} from 'react-router-dom';
import {RxCross2} from 'react-icons/rx';
import {Axios} from '../../Utility';
import {Toaster, toast} from 'react-hot-toast';
import {setKeyToLocalStorage} from '../../helpers/common';

const Wishlist = () => {
  const navigate = useNavigate();
  const state = useGlobalState();
  const stateProduct = state.getProduct().value;
  const isUser = state.getisLoggedIn().value;

  let allProduct;
  if (stateProduct) {
    allProduct = JSON.parse(JSON.stringify(stateProduct));
  }
  const user = JSON.parse(JSON.stringify(state.getUser().value));
  // console.log(user, 'user');

  let likeProductItem;
  const likeProduct = () => {
    const likeProductIds = user.likedProducts || [];
    const likedProducts = allProduct?.filter((product) =>
      likeProductIds.includes(product._id)
    );
    likeProductItem = likedProducts;
    // console.log(likedProducts);
  };
  likeProduct();

  const removeWishlist = async (productID, action) => {
    if (!isUser) {
      navigate('/login');
    } else {
      const userId = state.getUser().value?._id;
      const productId = productID;
      const response = await Axios.post(
        `/product/like/${productId}?action=${action}`,
        {userId}
      );
      if (response.status === 200) {
        const updatedLikedProducts = [...user.likedProducts];
        console.log(updatedLikedProducts, 'updatedLikedProducts');
        const index = updatedLikedProducts.indexOf(productId);
        if (index !== -1) {
          updatedLikedProducts.splice(index, 1);
        }
        toast.success('Removed from your Wishlist', {
          style: {
            background: '#333',
            color: '#fff',
          },
        });
        // Update the user's likedProducts array
        user.likedProducts = updatedLikedProducts;
        setKeyToLocalStorage('user', user);
        state.setUser(user);
      }
    }
  };

  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    // Fetch initial data from the state or wherever it comes from
    const fetchInitialData = async () => {
      try {
        const initialData = await state.getcartData();
        setCartItems(initialData.value);
      } catch (error) {
        console.log(error);
      }
    };

    fetchInitialData();
  }, [state.getcartData().value?.length]);
  const handleAddToCart = async (productID) => {
    if (!isUser) {
      navigate('/login');
    } else {
      // Find the product from id of product (showProduct)
      const getProduct = likeProductItem.find(
        (product) => product._id === productID
      );
      const newItem = {
        product: getProduct._id,
        price: getProduct.price,
        user: state.getUser().value._id,
      };
      const updatedData = await Axios.post(`/cart`, newItem);
      if (updatedData.status === 201) {
        toast.success('Item added to your Cart.', {
          style: {
            background: '#333',
            color: '#fff',
          },
        });
      }
      state.setcartData((prevData) => [...prevData, updatedData.data]);

      setCartItems(state.getcartData().value);
    }
  };

  return (
    <>
      <Toaster position='bottom-center' />
      <div className='wishlistContainer'>
        <h2>Wishlist</h2>
        <div className='wishlistItems'>
          {likeProductItem?.map((item) => (
            <div key={item._id} className='wishlistItem'>
              <div className='divOne'>
                <div className='imgDiv'>
                  <img src={item?.images[0]} alt='' />
                </div>
                <h1>{item.productName}</h1>
              </div>
              <div className='divTwo'>
                <p>₹ {item.price}.00</p>
                <p>In Stock</p>
              </div>
              <div className='divThree'>
                {cartItems?.some(
                  (cartItem) => cartItem?.product === item._id
                ) ? (
                  <Link to='/cart'>
                    <button className='goToCartBtn'>Go to Cart</button>
                  </Link>
                ) : (
                  <button onClick={() => handleAddToCart(item._id)}>
                    Add to Cart
                  </button>
                )}
                <p
                  className='crossIocn'
                  onClick={() => removeWishlist(item._id, 'dislike')}>
                  <RxCross2 />
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Wishlist;
