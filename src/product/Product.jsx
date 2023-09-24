import React, {useState} from 'react';
import './product.scss';
import {Link, useNavigate} from 'react-router-dom';
import Cart from '../components/cart/Cart';
import {useGlobalState} from '../store/global.ts';
import {Axios} from '../Utility';
import {useEffect} from 'react';
import {setKeyToLocalStorage} from '../helpers/common';
import {Toaster, toast} from 'react-hot-toast';

const Product = ({showProduct}) => {
  const state = useGlobalState();
  const navigate = useNavigate();
  const isUser = state.getisLoggedIn().value;

  const [isCartOpen, setCartOpen] = useState(false);

  const [cartItems, setCartItems] = useState([]);

  const orderData = state.getOrder().value;

  console.log(orderData, 'orderData in product page');

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
      try {
        // Find the product from id of product (showProduct)
        const getProduct = showProduct.find(
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
      } catch (error) {
        console.log(error);
      }
      setCartOpen(true);
    }
  };

  // Close the cart
  const handleCloseCart = () => {
    setCartOpen(false);
  };

  const userData = state.getUser();
  const normalUserData = JSON.parse(JSON.stringify(userData.value));

  const handleLike = async (productID, action) => {
    if (!isUser) {
      navigate('/login');
    } else {
      try {
        const userId = state.getUser().value?._id;
        const productId = productID;

        const response = await Axios.post(
          `/product/like/${productId}?action=${action}`,
          {userId}
        );

        if (response.status === 200) {
          const updatedLikedProducts = [...normalUserData.likedProducts];

          if (action === 'like') {
            toast.success('Added to your Wishlist.', {
              style: {
                background: '#333',
                color: '#fff',
              },
            });
            updatedLikedProducts.push(productId);
          } else if (action === 'dislike') {
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
          }
          // Update the user's likedProducts array
          normalUserData.likedProducts = updatedLikedProducts;
          setKeyToLocalStorage('user', normalUserData);
          state.setUser(normalUserData);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <Toaster position='bottom-center' />
      <div className='cartPopup'>
        <div>{isCartOpen && <Cart handleCloseCart={handleCloseCart} />}</div>
      </div>
      <div className='productContainer'>
        <div className='productMain'>
          {showProduct?.map((item) => (
            <div key={item._id} className='product-card'>
              <div className='producImage'>
                <img className='dealImage' src={item?.images[0]} alt='img' />
                <div className='product-wishlist'>
                  {normalUserData?.likedProducts?.includes(item._id) ? (
                    <i
                      className='heart-icon fas fa-heart'
                      onClick={() => handleLike(item._id, 'dislike')}></i>
                  ) : (
                    <i
                      onClick={() => handleLike(item._id, 'like')}
                      className='heart-icon far fa-heart'></i>
                  )}
                </div>
              </div>
              <div className='productContent'>
                <Link to={`/product/${item._id}`}>
                  <div className='product-title-wrap'>
                    <h3 className='product-title'>{item.productName}</h3>
                    <div className='product-price'>
                      <span className='text-span'>₹</span>
                      {item.price}
                      <span className='text-span'>.00</span>
                    </div>
                  </div>
                  <div className='product-color'>{item.description}</div>
                </Link>
                <div className='btn-wrapper'>
                  {cartItems?.some(
                    (cartItem) => cartItem?.product === item._id
                  ) ? (
                    <Link to='cart'>
                      <button className='goToCartBtn'>Go to Cart</button>
                    </Link>
                  ) : (
                    <button onClick={() => handleAddToCart(item._id)}>
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Product;
