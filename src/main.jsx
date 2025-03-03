import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Homepage from './route/Homepage'
import PostListPage from './route/PostListPage'
import Write from './route/Write'
import LoginCreator from './route/LoginCreator'
import RegisterPage from './route/RegisterPage'
import RegisterCreator from './route/RegisterCreator'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import{
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import SinglePostPage from './components/SinglePostPage'
import MainLayout from './layout/MainLayout'
import Contact from './route/ContactUs'
import Disclaimer from './route/Disclaimer'
import ReportPost from './route/ReportPost'
import AdvertiseWithUs from './components/Ads'
import About from './components/AboutUs'
import PrivacyPolicy from './route/PrivacyPolicy'
import ProfileUpdate from './route/ProfileUpdate'
import UserLogin from './route/UserLogin'
import CreatorDashboard from "./components/CreatorDashboard";
import ProtectedRoute from "./route/ProtectedRoute"; 


const queryClient = new QueryClient();
const router = createBrowserRouter([
 {
  element: <MainLayout/>,
  children: [
    {
      path: "/",
      element: (
        <Homepage/>
      ),
     },
  
     {
     path: "/posts",
     element: <PostListPage/>
    },
    {
      path: "/:slug",
      element: <SinglePostPage/>
     },
     {
      path: "/write",
      element: <Write/>
     },
     {
      path: "/login",
      element: <LoginCreator/>
     },
     {
      path: "/userLogin",
      element: <UserLogin/>
     },
     {
      path: "/profile",
      element: <ProfileUpdate/>
     },
     {
      path: "/register/reader",
      element: <RegisterPage/>
     },
     {
      path: "/register/creator",
      element: <RegisterCreator/>
     },
     {
      path: "/contact",
      element: <Contact/>
     },
     {
      path: "/disclaimer",
      element: <Disclaimer/>
     },
     {
      path: "/report-post",
      element: <ReportPost/>
     },
     {
      path: "/ads",
      element: <AdvertiseWithUs/>
     },
     {
      path: "/about-us",
      element: <About/>
     },
     {
      path: "/privacy-policy",
      element: <PrivacyPolicy/>
     },
     {
      path: "/creator-dashboard",
      element: (
        <ProtectedRoute>
          <CreatorDashboard />
         </ProtectedRoute>
      ),
    },
  ],
 }

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}/>
      </QueryClientProvider>
  </StrictMode>
)
