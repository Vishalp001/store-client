import React from 'react';
import './cate.scss';

const Cate = ({uniqueValues, filterItems}) => {
  return (
    <>
      <div className='catContainer'>
        {uniqueValues.map((category) => {
          return (
            <button
              key={category}
              type='button'
              className='filter-btn'
              onClick={() => filterItems(category)}>
              {category}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default Cate;
