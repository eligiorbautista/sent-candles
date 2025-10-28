import { useEffect } from 'react';
import Hero from '../components/user/sections/Hero.jsx';
import Products from '../components/user/sections/Products.jsx';
import About from '../components/user/sections/About.jsx';
import Events from '../components/user/sections/Events.jsx';
import Contact from '../components/user/sections/Contact.jsx';
import BackToTop from '../components/user/common/BackToTop.jsx';

const HomePage = () => {
  // Set page title
  useEffect(() => {
    document.title = 'Sent. Candles';
  }, []);

  return (
    <>
      <Hero />
      <Products />
      <About />
      <Events />
      <Contact />
      <BackToTop />
    </>
  );
};

export default HomePage;
