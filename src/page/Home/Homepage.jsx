import React from "react";
import Home from "@/components/Home/Home";
import { Helmet } from "react-helmet";

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title> Latexio – Online LaTeX Editor | Write, Compile & Collaborate</title>
        <meta charSet="UTF-8" />
        <meta name="description" content="Join Latexio, the online LaTeX editor crafted by experts. Create professional documents effortlessly with real-time rendering, version history, collaboration tools, and a curated templates—absolutely setup-free." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* Add more HTML5 meta tags as needed */}
      </Helmet>
      <Home />
    </>
  );
};

export default HomePage;
