import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import  { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {


    
    const [isOpen, setIsOpen] = useState(false);
    return(
    <div className="w-full h-16 md:h-20 flex items-center justify-between"> 
        {/* LOGO */}
    <Link to="/" className="items-center gap-4 flex text-2xl font-bold">
        <img src="/SmartLogoMain.png" className="w-16 h-16" alt="" />
        <span className='text-slate-400 font-bold'>SMUTV.</span>
    </Link>
    {/* MOBILE MENU */}
    <div className="md:hidden">
        {/* MOBILE BUTTON */}
    <div className='cursor-pointer text-4xl' 
    onClick={() => setIsOpen(!isOpen)}
          >
         {isOpen ? 'X' : '='}
        </div>
        {/* MOBILE MENU CONTENT */}
        <div className={`w-full h-screen flex flex-col items-center gap-6 text-lg font-medium justify-center absolute
             top-16 ${isOpen ? 'left-0' : '-left-full'} bg-slate-600 
             transition-all duration-500`}
             >

        <Link to="/">Home</Link>
        <Link to="">Trending News</Link>
        <Link to="">Most Popular</Link>
        <Link to="">About us</Link>
        <Link to="login">
        <button className='py-2 px-4 rounded-3xl bg-blue-800 '>Login 👋</button>
        </Link>
        </div>
    </div>
    {/* DESKTOP MENU */}
     <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium">
     <Link to="/">Home</Link>
        <Link to="">Trending News</Link>
        <Link to="">Most Popular</Link>
        <Link to="">About us</Link>
        <SignedOut>
        <Link to="/login">
        <button className='py-2 px-4 rounded-3xl bg-blue-800 '>Login  👋</button>
        </Link>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
        </div>   
    </div>
        )
}
export default Navbar