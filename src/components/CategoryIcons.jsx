import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories, MEDIA_BASE_URL } from '../services/api';
import './CategoryIcons.css';

const CategoryIcons = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then((response) => {
        setCategories(response.data);
      })
      .catch((err) => console.error('Failed to load categories:', err))
      .finally(() => setLoading(false));
  }, []);

  // ✅ CATEGORY REDIRECT LOGIC
  const getCategoryLink = (slug) => {
  switch (slug) {

    // 👗 Baby Fashion (no subcategory in DB)
    case 'boys-fashion':
    case 'girls-fashion':
      return '/products?category=baby-fashion';

    // 👟 Footwear & Accessories (your DB slug)
    case 'footwear':
    case 'accessories':
    case 'footwear-accessories':
      return '/products?category=footwear-accessories';

    // 🧸 Toys
    case 'toys':
      return '/products?category=toys';

    // 🛏 Furniture
    case 'beds':
    case 'bedding':
    case 'furniture':
      return '/products?category=furniture';

    // 👶 Baby Care
    case 'baby-care':
      return '/products?category=baby-care';

    // 🎯 Default
    default:
      return `/products?category=${slug}`;
  }
};
  // ✅ CATEGORY LABELS (DISPLAY NAMES)
  const CAT_LABELS = {
    'baby-fashion': 'Baby Fashion',
    'boys-fashion': 'Boys Fashion',
    'girls-fashion': 'Girls Fashion',

    'toys': 'Toys',

    'footwear': 'Footwear',
    'accessories': 'Accessories',
    'footwear-accessories': 'Footwear & Accessories',

    'baby-care': 'Moms & Baby Care',

    'furniture': 'Furniture & Bedding',
    'beds': 'Furniture & Bedding',
    'bedding': 'Furniture & Bedding',

    'rental': 'Rental Services',
    'offers': 'Offers',

    '': 'All Products',
  };

  if (loading) return <div className="loading">Loading categories...</div>;

  return (
    <div className="category-icons">
      <h2>Categories</h2>

      <div className="category-list">
        {categories
          // ✅ Remove categories without image
          .filter(cat => cat.image)

          // ✅ Show only first 6 categories
          .slice(0, 6)

          .map((cat) => {
            const imageUrl = cat.image
              ? (cat.image.startsWith('http')
                  ? cat.image
                  : `${MEDIA_BASE_URL}${cat.image}`)
              : null;

            return (
              <Link
                to={getCategoryLink(cat.slug)}   // ✅ redirect fix
                key={cat.id}
                className="category-item"
              >
                <div className="category-icon">
                  <img
                    src={imageUrl}
                    alt={cat.name}
                    className="category-img"
                  />
                </div>

                <span className="category-name">
                  {CAT_LABELS[cat.slug] || cat.name}  {/* ✅ label fix */}
                </span>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default CategoryIcons;