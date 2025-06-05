import React, { useEffect, useState } from "react";
import HeroSection from "./HeroSection";
import CreatorFeatures from "./CreatorFeatures";
import CreatorGrowthJourney from "./CreatorGrowthJourney";
import GrowthStats from "./GrowthStats";
import ReviewsShowcase from "./ReviewsShowcase";


const LandingPage = () => {
  return (
    <div >
      <HeroSection />
      <CreatorFeatures/>
      <CreatorGrowthJourney/>
      <GrowthStats/>
      <ReviewsShowcase />
    </div>
  );
};

export default LandingPage;
