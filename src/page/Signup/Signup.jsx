import Signup from "@/components/Signup/Signup";
import React from "react";
import { Helmet } from "react-helmet";

const SignupPage = () => {
  return (
    <>
      <Helmet>
        <title>Signup | Latexio - The IIT KGP LaTeX Editor</title>
        <meta charSet="UTF-8" />
        <meta
          name="description"
          content="Login to Latexio, the IIT KGP LaTeX Editor. "
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* Add more HTML5 meta tags as needed */}
      </Helmet>
      <Signup />
    </>
  );
};

export default SignupPage;
