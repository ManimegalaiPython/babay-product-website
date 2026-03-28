import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const footerStyles = {
  footer: {
    backgroundColor: '#f9a8d4',
    padding: '40px 40px 24px',
    fontFamily: "'Quicksand', 'Poppins', sans-serif",
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '32px',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  brandSection: {
    flex: '0 0 160px',
    minWidth: '140px',
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  logoCircle: {
    width: '75px',
    height: '75px',
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    mixBlendMode: 'multiply',
    borderRadius: '50%',
  },
  brandName: {
    fontSize: '1.15rem',
    fontWeight: '1400',
    color: '#232324',
    letterSpacing: '-0.3px',
  },
  address: {
    fontSize: '0.82rem',
    color: '#151515',
    lineHeight: '1.7',
    marginTop: '4px',
  },
  column: {
    flex: '1 1 130px',
    minWidth: '110px',
  },
  columnTitle: {
    fontSize: '0.95rem',
    fontWeight: '1400',
    color: '#0b0b0b',
    marginBottom: '14px',
    letterSpacing: '-0.2px',
    textTransform: 'capitalize',
  },
  linkList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  linkItem: {
    fontSize: '0.82rem',
    color: '#111111',
    marginBottom: '8px',
    cursor: 'pointer',
    transition: 'color 0.2s',
    lineHeight: '1.4',
  },
  socialSection: {
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '12px',
  },
  socialTitle: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: '#0f0f0f',
    marginBottom: '2px',
  },
  socialIcons: {
    display: 'flex',
    gap: '10px',
  },
  iconBox: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: '#1a1a2e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'transform 0.18s, background 0.18s',
  },
  divider: {
    borderTop: '1px solid rgba(255,255,255,0.45)',
    margin: '24px 0 14px',
    maxWidth: '1200px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  copyright: {
    textAlign: 'center',
    fontSize: '0.78rem',
    color: '#1f1e1f',
    opacity: 0.7,
  },
};

const FooterLink = ({ children }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <li
      style={{ ...footerStyles.linkItem, color: hovered ? '#be185d' : '#4a1942' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </li>
  );
};

const SocialIcon = ({ icon: Icon, color }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      style={{
        ...footerStyles.iconBox,
        backgroundColor: hovered ? color : '#1a1a2e',
        transform: hovered ? 'translateY(-2px) scale(1.08)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Icon />
    </div>
  );
};

const Footer = () => {
  return (
    <footer style={footerStyles.footer}>
      <div style={footerStyles.inner}>

        {/* Brand + Address */}
        <div style={footerStyles.brandSection}>
          <div style={footerStyles.logoWrapper}>
            <div style={footerStyles.logoCircle}>
              <img
                src="/logoimage.png"
                alt="BabyZone Logo"
                style={footerStyles.logoImg}
              />
            </div>
          </div>
          <p style={footerStyles.address}>
            4th street, pallavaram,<br />
            Near bus stand<br />
            Madurai-234567
          </p>
        </div>

        {/* Top Categories */}
        <div style={footerStyles.column}>
          <h4 style={footerStyles.columnTitle}>Top categories</h4>
          <ul style={footerStyles.linkList}>
            {['Baby Fashion', 'Toys', 'Footwear & Accessories', 'Moms & Baby care', 'Furniture & Bedding', 'Rental services'].map(item => (
              <FooterLink key={item}>{item}</FooterLink>
            ))}
          </ul>
        </div>

        {/* Customer Support */}
        <div style={footerStyles.column}>
          <h4 style={footerStyles.columnTitle}>Customer support</h4>
          <ul style={footerStyles.linkList}>
            {['Help & contact us', 'Delivery information', 'Track your order', 'Returns & exchange', 'Promotion Terms & conditions', 'Terms & conditions'].map(item => (
              <FooterLink key={item}>{item}</FooterLink>
            ))}
          </ul>
        </div>

        {/* Useful Links */}
        <div style={footerStyles.column}>
          <h4 style={footerStyles.columnTitle}>Useful Links</h4>
          <ul style={footerStyles.linkList}>
            {['Store finder', 'Sitemap', 'Fees and payments policy'].map(item => (
              <FooterLink key={item}>{item}</FooterLink>
            ))}
          </ul>
        </div>

        {/* About BabyZone */}
        <div style={footerStyles.column}>
          <h4 style={footerStyles.columnTitle}>About BabyZone</h4>
          <ul style={footerStyles.linkList}>
            {['Privacy Policy', 'Terms & conditions'].map(item => (
              <FooterLink key={item}>{item}</FooterLink>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div style={footerStyles.socialSection}>
          <h4 style={footerStyles.socialTitle}>Social Media</h4>
          <div style={footerStyles.socialIcons}>
            <SocialIcon icon={FaFacebook} color="#1877f2" />
            <SocialIcon icon={FaInstagram} color="#e1306c" />
            <SocialIcon icon={FaTwitter} color="#1da1f2" />
            <SocialIcon icon={FaYoutube} color="#ff0000" />
          </div>
        </div>

      </div>

      <div style={footerStyles.divider} />
      <p style={footerStyles.copyright}>
        © {new Date().getFullYear()} BabyZone. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;