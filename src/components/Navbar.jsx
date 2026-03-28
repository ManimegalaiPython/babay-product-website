import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { FaChevronDown, FaTags, FaTshirt, FaPuzzlePiece, FaShoePrints, FaBaby, FaBed, FaKey, FaPercent } from 'react-icons/fa';
import './Navbar.css';

/* ─── Category icons ─── */
const CAT_ICONS = {
  '':                  <FaTags />,
  'baby-fashion':      <FaTshirt />,
  'toys':              <FaPuzzlePiece />,
  'footwear-accessories': <FaShoePrints />,
  'baby-care':         <FaBaby />,
  'furniture':         <FaBed />,
  'rental':            <FaKey />,
  'offers':            <FaPercent />,
};

/* ─── Mega Menu Data ─── */
const MEGA_MENUS = {
  '': {
    columns: [
      {
        title: 'New Baby Clothing',
        items: [
          'New born onesies & rompers','New born nightwear & sleepsuits',
          'New born baby sets & suits','New born baby dresses & frocks',
          'New born baby leggings & shorts','New born baby t-shirts',
          'New born caps, gloves & mittens','New born inner wear',
          'New born baby jackets','New born baby sweaters',
        ],
        extra: [
          { title: 'Baby Boys Clothing', items: [
            'Baby boys t-shirts','Baby boys shirts','Baby boys jeans & trousers',
            'Baby boys shorts','Baby boys innerwear & thermals','Baby boys sweaters',
            'Baby boys sweat shirts & jackets','Baby boys swim wear','Baby boys sets & suits',
          ]},
          { title: 'Baby Girls Clothing', items: [
            'Baby girls tops & t-shirts','Baby girls dresses & frocks',
            'Baby girls jeans & trousers','Baby girls leggings',
            'Baby girls shorts & skirts','Baby girls sets & suits',
          ]},
        ],
      },
      {
        title: 'Baby Footwear',
        items: ['Baby Booties'],
        extra: [
          { title: 'Kids Footwear', items: [
            'Kids casual shoes','Kids sneakers & sports shoes',
            'Kids bellies','Kids sandals','Kids flip flops',
          ]},
          { title: 'Fashion Accessories', items: [
            'Kids bags','Kids hair accessories','Kids caps & gloves','Kids scarfs',
          ]},
          { title: 'Baby Hair Care', items: [
            'Baby shampoo','Baby conditioner','Baby hair oil',
          ]},
          { title: 'Baby Grooming', items: [
            'Baby toothbrush & baby toothpaste','Baby brush & comb',
          ]},
        ],
      },
      {
        title: 'Breast Feeding',
        items: [
          'Electric breast pump','Manual breast pump',
          'Feeding shawls','Breast pads & nipple shields',
        ],
        extra: [
          { title: 'Maternity Pillows', items: ['Feeding Pillows','Pregnancy Pillows'] },
          { title: 'Maternity Clothing', items: [
            'Maternity lingerie','Maternity bottom wear',
            'Maternity sleep wear','Maternity tops','Maternity dresses',
          ]},
          { title: 'Diaper Bags', items: ['Diaper bags'] },
          { title: 'Bath Accessories', items: ['Baby bath tub','Baby bather & chair'] },
        ],
      },
      {
        title: 'Baby Feeding Essentials',
        items: [
          'Bibs & burp cloths','Feeding bottles','Muslins',
          'Soothers & pacifiers','Teethers & nibblers',
          'Baby food storage & milk storages','Weaning plates & bowls',
          'Kids water bottles & lunch box','Bottle warmer & sterilizer',
        ],
        extra: [
          { title: 'Maternity Care', items: [
            'Stretch mark cream','Maternity pads',
            'Disposable maternity panties','Maternity bed mats',
          ]},
        ],
      },
      {
        title: 'Baby Skincare',
        items: [
          'Baby body oil & baby massage oil','Baby body wash',
          'Baby cream & baby lotion','Baby diaper rash cream',
          'Baby powder','Baby wipes & tissues',
        ],
        extra: [
          { title: 'Health & Safety', items: [
            'Baby care equipments','Detergent & cleansers',
            'Humidifiers & air purifiers','Mosquito repellants',
            'Sanitisers & hand cleansing gels','Thermometer',
          ]},
          { title: 'Baby Bedding', items: [
            'Baby bedding sets','Baby cot sheets & crib sheets','Baby mattress',
          ]},
        ],
      },
    ],
  },

  'baby-fashion': {
    columns: [
      {
        title: 'New Baby Clothing',
        items: [
          'New born onesies & rompers','New born nightwear & sleepsuits',
          'New born baby sets & suits','New born baby dresses & frocks',
          'New born baby leggings & shorts','New born baby t-shirts',
          'New born caps, gloves & mittens','New born inner wear',
          'New born baby jackets','New born baby sweaters',
        ],
      },
      {
        title: 'Baby Boys Clothing',
        items: [
          'Baby boys t-shirts','Baby boys shirts','Baby boys jeans & trousers',
          'Baby boys shorts','Baby boys innerwear & thermals','Baby boys sweaters',
          'Baby boys sweat shirts & jackets','Baby boys swim wear','Baby boys sets & suits',
        ],
      },
      {
        title: 'Baby Girls Clothing',
        items: [
          'Baby girls tops & t-shirts','Baby girls dresses & frocks',
          'Baby girls jeans & trousers','Baby girls leggings',
          'Baby girls shorts & skirts','Baby girls sets & suits',
          'Baby girls socks','Baby girls swim wear',
          'Baby girls sweat shirts & jackets',
        ],
      },
    ],
  },

  'footwear-accessories': {
    columns: [
      {
        title: 'Baby Footwear',
        items: ['Baby Booties'],
      },
      {
        title: 'Kids Footwear',
        items: [
          'Kids casual shoes','Kids sneakers & sports shoes',
          'Kids bellies','Kids sandals','Kids flip flops',
        ],
      },
      {
        title: 'Fashion Accessories',
        items: [
          'Kids bags','Kids hair accessories',
          'Kids caps & gloves','Kids scarfs',
        ],
      },
    ],
  },

  'baby-care': {
    columns: [
      {
        title: 'Breast Feeding',
        items: [
          'Electric breast pump','Manual breast pump',
          'Feeding shawls','Breast pads & nipple shields',
        ],
        extra: [
          { title: 'Maternity Pillows', items: ['Feeding Pillows','Pregnancy Pillows'] },
          { title: 'Maternity Clothing', items: [
            'Maternity lingerie','Maternity bottom wear','Maternity sleep wear',
            'Maternity tops','Maternity dresses',
          ]},
          { title: 'Diaper Bags', items: ['Diaper bags'] },
        ],
      },
      {
        title: 'Baby Feeding & Nursery',
        items: [
          'Bibs & burp cloths','Feeding bottles','Muslins',
          'Soothers & pacifiers','Teethers & nibblers',
          'Baby food storage & milk storages','Baby nippers & cups',
          'Weaning plates & bowls','Kids water bottles & lunch box',
          'Bottle warmer & sterilizer',
        ],
        extra: [
          { title: 'Bath Accessories', items: [
            'Baby bath tub','Baby bather & chair','Baby bath sponge & bath caps',
            'Bath stands & box','Baby quick dry sheet & changing mats',
          ]},
        ],
      },
      {
        title: 'Baby Hair Care',
        items: ['Baby shampoo','Baby conditioner','Baby hair oil'],
        extra: [
          { title: 'Baby Grooming', items: [
            'Baby toothbrush & baby toothpaste','Baby brush & comb',
            'Baby nail cutter & scissors','Cotton buds & pleats',
          ]},
          { title: 'Diaper & Toilet Training', items: [
            'Diaper pants','Diaper & nappy accessories','Baby potty seat & chair',
          ]},
        ],
      },
      {
        title: 'Baby Skincare',
        items: [
          'Baby body oil & baby massage oil','Baby body wash',
          'Baby cream & baby lotion','Baby diaper rash cream',
          'Baby powder','Baby wipes & tissues',
        ],
        extra: [
          { title: 'Health & Safety', items: [
            'Baby care equipments','Detergent & cleansers',
            'Humidifiers & air purifiers','Mosquito repellants',
            'Sanitisers & hand cleansing gels','Thermometer',
          ]},
        ],
      },
    ],
  },

  'furniture': {
    columns: [
      {
        title: 'Baby Bedding',
        items: [
          'Baby bedding sets','Baby cot sheets & crib sheets',
          'Baby mattress','Baby mosquito nets','Baby pillows',
        ],
      },
      {
        title: 'Baby Furniture & Storage',
        items: ['Baby cots & cribs','Travel baby bed','Baby storage cabinets'],
      },
      {
        title: 'Blankets, Quilts & Wraps',
        items: ['Baby blankets','Swaddles','Baby quilts & comforters','Sleeping bags'],
      },
    ],
  },
};

const categories = [
  { name: 'All categories',         slug: '',                    hasDropdown: true  },
  { name: 'Baby fashion',           slug: 'baby-fashion',        hasDropdown: true  },
  { name: 'Toys',                   slug: 'toys',                hasDropdown: false },
  { name: 'Footwear & Accessories', slug: 'footwear-accessories', hasDropdown: true  },
  { name: 'Moms & Baby care',       slug: 'baby-care',           hasDropdown: true  },
  { name: 'Furniture & Bedding',    slug: 'furniture',           hasDropdown: true  },
  { name: 'Rental Services',        slug: 'rental',              hasDropdown: false },
  { name: 'Offers',                 slug: 'offers',              hasDropdown: false },
];

export default function Navbar() {
  const location    = useLocation();
  const [activeIdx, setActiveIdx] = useState(null);
  const [dropPos,   setDropPos]   = useState({ top: 0, left: 0 });
  const triggerRefs = useRef([]);
  const leaveTimer  = useRef(null);

  const currentSlug = new URLSearchParams(location.search).get('category') || '';

  const open = (idx) => {
    clearTimeout(leaveTimer.current);
    setActiveIdx(idx);
    const el = triggerRefs.current[idx];
    if (el) {
      const rect = el.getBoundingClientRect();
      setDropPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    }
  };

  const close = () => { leaveTimer.current = setTimeout(() => setActiveIdx(null), 150); };
  const keep  = () => clearTimeout(leaveTimer.current);

  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  const activeCat = activeIdx !== null ? categories[activeIdx] : null;
  const megaData  = activeCat ? MEGA_MENUS[activeCat.slug] : null;
  const isMega    = megaData?.columns?.length > 1;

  return (
    <nav className="category-navbar">
      <div className="category-container">
        {categories.map((cat, idx) => {
          const isActive = currentSlug === cat.slug;
          const isOpen   = activeIdx === idx;
          return (
            <div
              key={idx}
              className={`category-item-wrapper ${isOpen ? 'open' : ''} ${isActive ? 'current' : ''}`}
              ref={(el) => (triggerRefs.current[idx] = el)}
              onMouseEnter={() => cat.hasDropdown && open(idx)}
              onMouseLeave={close}
            >
              <Link
                to={`/products${cat.slug ? `?category=${cat.slug}` : ''}`}
                className={`category-link ${isOpen || isActive ? 'active' : ''}`}
              >
                <span className="cat-icon">{CAT_ICONS[cat.slug]}</span>
                {cat.name}
                {cat.hasDropdown && (
                  <FaChevronDown className={`dropdown-icon ${isOpen ? 'rotated' : ''}`} />
                )}
              </Link>
              {isActive && <span className="active-bar" />}
            </div>
          );
        })}
      </div>

      {/* Mega / simple dropdown — rendered to body via portal */}
      {activeIdx !== null && megaData && createPortal(
        <div
          className={`nav-dropdown ${isMega ? 'mega-menu' : 'simple-dropdown'}`}
          style={isMega
            ? { position: 'fixed', top: dropPos.top, left: 0, right: 0, zIndex: 10000 }
            : { position: 'absolute', top: dropPos.top, left: dropPos.left, zIndex: 10000 }
          }
          onMouseEnter={keep}
          onMouseLeave={close}
        >
          {isMega ? (
            <div className="mega-inner">
              {megaData.columns.map((col, ci) => (
                <div key={ci} className="mega-col">
                  <div className="mega-col-title">{col.title}</div>
                  {col.items.map((item, ii) => (
                    <Link key={ii} className="mega-item"
                      to={`/products?category=${activeCat.slug}&sub=${item.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setActiveIdx(null)}
                    >{item}</Link>
                  ))}
                  {col.extra?.map((ex, ei) => (
                    <div key={ei} className="mega-extra-group">
                      <div className="mega-col-title">{ex.title}</div>
                      {ex.items.map((item, ii) => (
                        <Link key={ii} className="mega-item"
                          to={`/products?category=${activeCat.slug}&sub=${item.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={() => setActiveIdx(null)}
                        >{item}</Link>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="simple-inner">
              {megaData.columns.map((col, ci) => (
                <div key={ci}>
                  {col.items.map((item, ii) => (
                    <Link key={ii} className="mega-item"
                      to={`/products?category=${activeCat.slug}&sub=${item.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setActiveIdx(null)}
                    >{item}</Link>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>,
        document.body
      )}
    </nav>
  );
}