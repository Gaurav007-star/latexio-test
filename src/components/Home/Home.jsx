
import React from "react";
import Navbar from "../Layout/Navbar";
import Hero from "../Layout/Hero";
import Introduction from "../Layout/Introduction";
import Plans from "../Layout/Plans";
import Explore from "../Explore";
import Templates from "../Template/Templates";
import Partners from "../Layout/Partners";
import News from "../News";
import Footer from "../Layout/Footer";
import { introductions } from "../../constants/constants";
import topImage from "../../assests/home/topImage.svg";

// prop: image-title-desc
const topSectionData = {
  image:topImage,
  title:"The home of scientific and technical writing",
  desc:"Create complex, beautifully formatted documents with ease. Collaborate with anyone, work from anywhere."
}

const Home = () => {
  return (
    <div className="Home-wrapper w-full h-max overflow-x-hidden relative ">
      {/* navbar */}
      <Navbar />

      {/* Hero-section */}
      <Hero />

      {/* introduction-section */}
      <Introduction listData={introductions} topSectionData={topSectionData}/>

      {/* plane-pricing-section */}
      <Plans />

      {/* explore */}
      <Explore />

      {/* templates */}
      <Templates />

      {/* partners */}
      <Partners />

      {/* news */}
      <News />

      {/* footer */}
      <Footer />
    </div>
  );
};

export default Home;
