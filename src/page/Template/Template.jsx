import Template from "@/components/Template/Template";
import React from "react";
import { Helmet } from "react-helmet";

const TemplatePage = () => {
  return (
    <>
      <Helmet>
        <title>Template | Latexio - The IIT KGP LaTeX Editor</title>
        <meta charSet="UTF-8" />
        <meta
          name="Template"
          content="Template of Latexio, the IIT KGP LaTeX Editor. "
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* Add more HTML5 meta tags as needed */}
      </Helmet>
      <Template />
    </>
  );
};

export default TemplatePage;
