import Contact from "@/components/contact/Contact";
import React from "react";
import { Helmet } from "react-helmet";

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Contact | Latexio</title>
        <meta charSet="UTF-8" />
        <meta
          name="Contact"
          content="Contact to Latexio"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* Add more HTML5 meta tags as needed */}
      </Helmet>
      <Contact />
    </>
  );
};

export default ContactPage;
