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
import ProfileImageUploader from './components/ProfileImageUploader'
import UserProfileCard from './components/UserProfileCard'
import CreatorProfile from './components/CreatorProfile'
import CreatorWebsite from './components/CreatorWebsite'
import Newsletters from './components/Newsletters'
import RecentLiveNews from './components/RecentLiveNews'
import ResetPassword from './route/ResetPassword'
import UserResetPassword from './route/UserRestPassword'
import LiveScores from './components/LiveScore'
import TermsAndConditions from './components/TermsAndConditions '
import EditorialStandard from './components/EditorialStandard'
import WritingStyleGuide from './components/WritingStyleGuide'
import AdminRegistrationForm from './components/AdminRegistration'
import AdminLoginForm from './route/LoginAdmin'
import AdminDashboard from './components/AdminDashboard'
import AdminMessageForm from './components/AdminMessageForm'
import MusicPlayer from './components/MusicPlayer'
import UploadPodcast from './podcast/UploadPodcast';
import LandingPage from './podcast/LandingPage';
import PodcastExplorer from './podcast/App';
import EpisodePage from './podcast/EpisodePage';
import PodcastUploaderWrapper from './podcast/PodcastUploaderWrapper'
import VerificationSuccess from './route/VerificationSuccess'
import VerificationFailed from './route/VerificationFailed'
import Favorites from './podcast/Favorites'
import EbookHome from './ebooks/EbooksHome'
import EbookUploaderWrapper from './ebooks/EbookAndWriteWrapper'
import SingleEbookPage from './ebooks/SingleEbookPage'
import AdminProtectedRoute from './route/AdminProtectedRoute'
import ActionManager from './components/ActionManager'
import AdminAppeals from './components/ReadAppeals'
import MarketDetails from './components/MarketDetails'
import RecommendationsPage from './components/RecommendationsPage'
import LandingPageForNewCreator from './components/LandingPage'
import Qr from './components/Qr'
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
      path: "/creator/get-started",
      element:<LandingPageForNewCreator/>
     },

  
     {
       path: "/read-ebook/:id",
      element: <SingleEbookPage />,

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
      path: "/creator-profile",
      element: <ProfileUpdate/>
     },
     {
      path: "/market-details",
      element: <MarketDetails/>
     },
     {
      path: "/user-profile",
      element: <UserProfileCard/>
     },
     {
      path: "/admin-dashboard/management/message",
      element: <AdminMessageForm/>
     },
     {
      path: "/profile",
      element: <ProfileImageUploader/>
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
      path: "/register/admin",
      element: <AdminRegistrationForm/>
     },
     {
      path: "/login/admin",
      element: <AdminLoginForm/>
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
      path: "/live-scores",
      element: <LiveScores/>
     },
     {
      path: "/termsAndConditions",
      element: <TermsAndConditions/>
     },
     {
      path: "/editorial-standard",
      element: <EditorialStandard/>
     },
     {
      path: "/writing-style-guide",
      element: <WritingStyleGuide/>
     },
     {
      path: "/ads",
      element: <Newsletters/>
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
      path: "/live-Streams-Trending-Updates",
      element: <RecentLiveNews/>
     },
     {
      path: "/creator/:creatorId",
      element: <CreatorProfile />

     },
     {
     path: "/recommendations",
     element: <RecommendationsPage/>
     },
     {
       path: "/creator-website" ,
       element: <CreatorWebsite />
     },
     {
     path: "/podcasts",
      element: <LandingPage />
     },
      {
     path: "/qr",
      element: <Qr />
     },
     {
       path:"/explore", 
       element: <PodcastExplorer />
     },
     {
      path: "/start-podcast",
       element: <PodcastUploaderWrapper/>
     },
     {
    path: "/episode/:id",
     element: <EpisodePage />
      
     },
     {
      path: "/reset-password",
      element: <ResetPassword/>
     },
     {
      path: "/user-reset-password",
      element: <UserResetPassword/>
     },
     {
      path: "/stream-songs",
      element: <MusicPlayer/>
     },
     {
      path: "/admin/messages/:creatorId",
      element: <AdminMessageForm />
     },
     {
      path: "/admin-dashboard/management",
      element: (

        <AdminProtectedRoute>
          <AdminDashboard/>
        </AdminProtectedRoute>
      )
     },
     {
      path: "/admin-dashboard/management/actions",
      element: (

        <AdminProtectedRoute>
          <ActionManager/>
        </AdminProtectedRoute>
      )
     },
     {
      path: "/admin/appeals",
       element: (
        <AdminProtectedRoute>
        <AdminAppeals />
       </AdminProtectedRoute>
      )

     },
     {
       path: "/verify-success",
        element: <VerificationSuccess /> 
     },
     {
      path: "/favorites", 
       element: <Favorites />

    },
     {
      path: "/verify-failed", 
      element: <VerificationFailed />
    },
    {
      path: "/upload-podcast",
      element: (
        <ProtectedRoute>
          <UploadPodcast />
        </ProtectedRoute>
      )
    }, 
    {
      path: "/get-started/write/ebook",
      element:(
        <ProtectedRoute>
          <EbookUploaderWrapper />
        </ProtectedRoute>

      ) 
     },
    {
      path: "/ebooks",
      element: <EbookHome/>,
    },
     {
      path: "/creator-dashboard",
      element: (
        <ProtectedRoute >
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
