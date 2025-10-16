import Pricing from "@/components/pricing/Pricing";
import React from "react";
import { Helmet } from "react-helmet";

const PricingPage = () => {
  return (
    <div>
      <Helmet>
        <title>Pricing | Latexio - The IIT KGP LaTeX Editor</title>
        <meta charSet="UTF-8" />
        <meta
          name="description"
          content="pricing for Latexio, the IIT KGP LaTeX Editor. "
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* Add more HTML5 meta tags as needed */}
      </Helmet>
      <Pricing />
    </div>
  );
};

export default PricingPage;
