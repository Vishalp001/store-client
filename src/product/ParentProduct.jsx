import React, {useEffect, useState} from 'react';
import {Axios} from '../Utility';
import Product from './Product';
import Category from '../components/Cate';

const ParentComponent = () => {
  const [product, setProduct] = useState([]);
  const [getCat, setGetCat] = useState([]);

  const [showProduct, setShowProduct] = useState([]);

  // console.log(showProduct, 'showProduct');

  const cats = getCat.map((item) => item.category);
  const uniqueValues = ['All', ...new Set(cats)];

  const filterItems = (category) => {
    if (category === 'All') {
      setShowProduct(product);
      return;
    }
    const newItems = product.filter((product) => product.category === category);
    setShowProduct(newItems);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await Axios.get('/product');
        setProduct(res.data);
        setGetCat(res.data);
        setShowProduct(res.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{position: 'relative'}}>
      <Category uniqueValues={uniqueValues} filterItems={filterItems} />
      <Product showProduct={showProduct} />
    </div>
  );
};

export default ParentComponent;
