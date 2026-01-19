import React, { useContext, useMemo, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const Men = () => {
  const { products } = useContext(ShopContext)

  const [sortType, setSortType] = useState('relavent')

  const menProducts = useMemo(() => {
    return products.filter(p => {
      const cat = (p.category || '').toLowerCase();
      const type = (p.type || '').toLowerCase();
      return cat === 'men' || cat.includes('men') || type.includes('men');
    })
  }, [products])

  const sortedMen = useMemo(() => {
    const arr = menProducts.slice();
    switch (sortType) {
      case 'low-high':
        arr.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        break;
      case 'high-low':
        arr.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        break;
      default:
        break;
    }
    arr.sort((a, b) => {
      const aAvailable = Number(a.quantity) > 0 ? 0 : 1;
      const bAvailable = Number(b.quantity) > 0 ? 0 : 1;
      return aAvailable - bAvailable;
    });
    return arr;
  }, [menProducts, sortType])

  return (
    <div className='pt-10 border-t'>
      <div className='flex justify-between mb-6 text-base sm:text-2xl'>
        <Title text1={'MEN'} text2={'COLLECTION'} />
        <select value={sortType} onChange={(e)=>setSortType(e.target.value)} className='px-2 text-sm border-2 border-gray-300'>
          <option value="relavent">Sort by: Relevant</option>
          <option value="low-high">Sort by: Low to High</option>
          <option value="high-low">Sort by: High to Low</option>
        </select>
      </div>

      <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 gap-y-6'>
        {sortedMen.map((item, idx) => (
          <ProductItem
            key={item._id || idx}
            id={item._id}
            name={item.name}
            price={item.price}
            image={item.image || item.images || []}
            quantity={item.quantity}
          />
        ))}
      </div>
    </div>
  )
}

export default Men
