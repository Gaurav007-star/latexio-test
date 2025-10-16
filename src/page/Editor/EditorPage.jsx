import LaTeXEditor from "@/components/Editor/Editor";
import React from "react";
import { Helmet } from "react-helmet";

const EditorPage = () => {
  return (
    <div>
      <Helmet>
        <title>Editor | Latexio - The IIT KGP LaTeX Editor</title>
        <meta charSet="UTF-8" />
        <meta
          name="Ediotr"
          content="Editor for Latex, the IIT KGP LaTeX Editor. "
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* Add more HTML5 meta tags as needed */}
      </Helmet>
      <LaTeXEditor />
    </div>
  );
};

export default EditorPage;
