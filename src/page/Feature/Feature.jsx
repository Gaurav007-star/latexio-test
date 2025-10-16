import Feature from "@/components/Feature/Feature";
import React from "react";
import { Helmet } from "react-helmet";

const FeaturePage = () => {
  return (
    <>
      <Helmet>
        <title>Feature | Latexio - The IIT KGP LaTeX Editor</title>
        <meta charSet="UTF-8" />
        <meta
          name="Feature"
          content="Features of Latexio, the IIT KGP LaTeX Editor. "
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* Add more HTML5 meta tags as needed */}
      </Helmet>

      <Feature />
    </>
  );
};

export default FeaturePage;
