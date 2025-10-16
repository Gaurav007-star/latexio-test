import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Login from "../../components/Login/Login";
import { Helmet } from "react-helmet";

const LoginPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.user || auth.token) {
      navigate("/dashboard", { replace: true });
    }
  }, [auth.user, auth.token, navigate]);

  return (
    <>
      <Helmet>
        <title>Login | Latexio - The IIT KGP LaTeX Editor</title>
        <meta charSet="UTF-8" />
        <meta name="description" content="Login to Latexio, the IIT KGP LaTeX Editor. " />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* Add more HTML5 meta tags as needed */}
      </Helmet>
      <Login />
    </>
  );
};

export default LoginPage;