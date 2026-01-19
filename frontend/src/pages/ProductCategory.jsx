import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import ProductItem from '../components/ProductItem';

const ProductCategory = () => {
  const { subCategory } = useParams(); // URL theke 'casual-shirt' pabe
  const { products } = useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      // Step A: Slug theke normal text e nite hobe (casual-shirt -> casual shirt)
      const formattedSubCategory = subCategory.replace(/-/g, ' ');

      // Step B: Filter Logic
      const filtered = products.filter(item => {
        // Database er subType thikmoto match korar jonno lowercase kora holo
        return item.subType && item.subType.toLowerCase() === formattedSubCategory.toLowerCase();
      });

      setFilterProducts(filtered);
    }
  }, [subCategory, products]);

  return (
    <div className='max-w-7xl mx-auto px-4 py-10'>
      {/* Title display */}
      <div className='flex items-center gap-2 mb-8'>
        <div className='w-1 h-8 bg-[#f16c44]'></div>
        <h2 className='text-2xl font-bold uppercase tracking-wide'>
          {subCategory.replace(/-/g, ' ')}
        </h2>
      </div>
      
      {filterProducts.length > 0 ? (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {filterProducts.map((item) => (
            <ProductItem 
              key={item._id} 
              id={item._id} 
              image={item.images} 
              name={item.name} 
              price={item.price} 
            />
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-32 text-gray-400'>
          <p className='text-xl font-medium'>No products found in this category.</p>
          <p className='text-sm'>Please check back later or try another category.</p>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;