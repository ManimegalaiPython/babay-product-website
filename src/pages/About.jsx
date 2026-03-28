import { useState, useEffect } from "react";
import "./About.css";

const FALLBACK_MISSION = [
  "To empower parents by providing thoughtfully designed, safe, and sustainable baby essentials that make childcare easier and more enjoyable for every family.",
  "To be the go-to online store for parents seeking reliable, expertly curated baby products, ensuring peace of mind with every purchase.",
  "To offer innovative, high-quality baby gear and apparel that promote infant comfort, safety, and healthy development from day one.",
];

const FALLBACK_VISION = [
  "To create a world where every new parent has access to the best resources and products, fostering a generation of healthy, happy, and thriving children.",
  "To become the most beloved and trusted global community for parents, known for our commitment to quality, innovation, and family well-being.",
  "To revolutionize the way families shop for baby products, setting the standard for sustainability, transparency, and personalized support in the industry.",
];

export default function About() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/about/", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setAboutData(d))
      .catch(() => setAboutData(null))
      .finally(() => setLoading(false));
  }, []);

  const mission = aboutData?.mission || FALLBACK_MISSION;
  const vision  = aboutData?.vision  || FALLBACK_VISION;
  // Use API image if present, otherwise fallback to the image in public folder
const imageSrc = aboutData?.image || "/aboutimage.jpg";
  return (
    <div className="about-page">
      <div className="about-breadcrumb">Home/ About</div>

      <h1 className="about-title">About Us</h1>

      <div className="about-content">
        <div className="about-text">
          <section className="about-section">
            <h2 className="about-section-title">Our Mission</h2>
            {(Array.isArray(mission) ? mission : [mission]).map((p, i) => (
              <p key={i} className="about-para">"{p}"</p>
            ))}
          </section>

          <section className="about-section">
            <h2 className="about-section-title">Our Vision</h2>
            {(Array.isArray(vision) ? vision : [vision]).map((p, i) => (
              <p key={i} className="about-para">"{p}"</p>
            ))}
          </section>
        </div>

        <div className="about-image-wrap">
          {loading ? (
            <div className="about-img-skeleton" />
          ) : (
            <img src={imageSrc} alt="About BabyZone" className="about-img" />
          )}
          <div className="about-blob" />
        </div>
      </div>

      <div className="about-map-wrap">
        <iframe
          title="BabyZone Location"
          className="about-map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d497511.2360742657!2d79.87298!3d13.08268!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ea4f7d3361%3A0x6e61a70b6863d433!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1680000000000"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}