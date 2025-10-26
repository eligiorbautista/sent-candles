import { useEffect } from 'react';
import Hero from '../components/sections/Hero';
import Products from '../components/sections/Products';
import About from '../components/sections/About';
import Events from '../components/sections/Events';
import Contact from '../components/sections/Contact';
import BackToTop from '../components/common/BackToTop';

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
