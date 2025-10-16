import About from "@/components/About/About";
import React from "react";
import { Helmet } from "react-helmet";

const AboutPage = () => {
  return (
    <div>
      <Helmet>
        <title>About | Latexio</title>
        <meta charSet="UTF-8" />
        <meta
          name="About"
          content="About of Latexio"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* Add more HTML5 meta tags as needed */}
      </Helmet>
      <About />
    </div>
  );
};

export default AboutPage;
