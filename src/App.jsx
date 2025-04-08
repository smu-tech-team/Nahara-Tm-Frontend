import FeaturedPost from "../components/FeaturePost";
import { UIProvider } from "../components/UIProvider "; // Import UIContext
import Navbar from "../components/Navbar";

const App = () => {
  return (
    <div className='px-4 md:px-8 lg:px-16 lx:px-32 2xl:px-64'>
      {/* NARBAR */}
       <UIProvider>
            <Navbar /> 
            <FeaturedPost /> 
          </UIProvider>
      


      </div>

  )
}

export default App