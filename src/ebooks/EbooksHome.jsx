import React from 'react';
import HeroSection from './HeroSection';
import BookList from './BookList';
import FloatingCart from './FloatingCart';

const EbookHome = () => {
  return (
    <div>
    <HeroSection/>
    <BookList/>
    <FloatingCart/>
    </div>
  );
}
export default EbookHome;