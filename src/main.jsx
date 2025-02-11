import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Homepage from './route/Homepage'
import PostListPage from './route/PostListPage'
import Write from './route/Write'
import LoginPage from './route/LoginPage'
import RegisterPage from './route/RegisterPage'
import {
  createBrowserRouter,
  RouterProvider,
 
} from "react-router-dom";
import { ClerkProvider } from '@clerk/clerk-react';
import SinglePostPage from './components/SinglePostPage'
import MainLayout from './layout/MainLayout'
import ReactDOM from "react-dom/client";
import React from "react";

// Import your Publishable Key
const PUBLISHABLE_KEY=import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

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
      path: "/post",
      element: <SinglePostPage/>
     },
     {
      path: "/write",
      element: <Write/>
     },
     {
      path: "/login",
      element: <LoginPage/>
     },
     {
      path: "/register",
      element: <RegisterPage/>
     }
  ],
 }

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <RouterProvider router={router}/>
    </ClerkProvider>
  </StrictMode>
)