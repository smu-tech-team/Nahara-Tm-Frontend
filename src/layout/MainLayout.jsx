import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ThemeToggle from "../components/ThemeToggle";
import CookieConsent from "../components/Cookies";
import FloatingVideo from "../components/FloatingVideo.jsx";
import { ToastContainer } from "react-toastify";

const MainLayout = () => {
    const videoUrl = "https://youtu.be/N3VdeCtd8oY?si=4HKjo7tvVYX5Gv51"; 

    return(
        <div className='px-4 md:px-8 lg:px-16 lx:px-32 2xl:px-64'>
            <Navbar/>
            <Outlet/>
            <CookieConsent/>
            <FloatingVideo videoUrl={videoUrl} />
            <ThemeToggle/>,
            <Footer/>
            <ToastContainer />

        </div>
    )
}
export default MainLayout;