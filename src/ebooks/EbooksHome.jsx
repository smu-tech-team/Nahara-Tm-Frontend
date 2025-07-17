import React from 'react';
import HeroSection from './HeroSection';
import BookList from './BookList';
import FloatingCart from './FloatingCart';
import AdSpace from '../components/AdSpace';

const EbookHome = () => {
  return (
    <div className='rounded-lg'>
    <HeroSection/>
    <BookList/>
    <FloatingCart/>
    <AdSpace/>
    </div>
  );
}
export default EbookHome;