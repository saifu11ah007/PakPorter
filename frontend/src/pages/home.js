import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import OrbitDeliveryHero from '../components/ui/orbit-delivery-hero';
import { useTheme } from '../context/ThemeContext';

const PakPorterHomepage = () => {
  let theme = 'light';
  try {
    const themeContext = useTheme();
    if (themeContext?.theme) theme = themeContext.theme;
  } catch (e) {
    // Fallback if rendered outside ThemeProvider
  }

  return (
    <div className="min-h-screen bg-background text-textPrimary flex flex-col pt-16">
      <Navbar />

      <main className="flex-1 w-full relative flex items-center justify-center overflow-hidden">
        <OrbitDeliveryHero theme={theme} onlyOrbit={true} />
      </main>

      <Footer />
    </div>
  );
};

export default PakPorterHomepage;