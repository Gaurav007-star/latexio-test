import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiFetch, ApiError } from "../../api/apiFetch";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { Spinner } from "../ui/kibo-ui/spinner";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Login = ({ pageMeta }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = location.state?.from?.pathname || "/dashboard";
  const [loading, setLoading] = useState(false);
  const [toggleIcon, setToggleIcon] = useState(false);
  const [userData, setUserData] = useState({ email: "", password: "" });

  const TogglePasswordIcon = () => setToggleIcon((prev) => !prev);

  // Form submit handler --> Login logic
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: userData.email,
          password: userData.password
        })
      });

      if (response.success === false) {
        toast.error(response.message);
      } else if (response && response.authToken) {
        await auth.setTokenAndFetchUser(response.authToken);
        navigate(fromPath, { replace: true });
      } else {
        toast.error("Login failed. Unexpected response from server.");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400) {
          toast.error("Enter a valid email and password.");
        } else if (err.status === 401 || err.status === 403) {
          toast.error("Invalid email or password.");
        } else {
          toast.error(`Login failed: ${err.message} (Status: ${err.status})`);
        }
      } else if (err instanceof Error) {
        toast.error(`Login failed: ${err.message}`);
      } else {
        toast.error("An unknown error occurred during login.");
      }
    } finally {
      setLoading(false);
    }
  };

  const InputHandler = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const loginWithOauth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const { data: userInfo } = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`
            }
          }
        );
        // console.log("User Info:", userInfo);
        // Check email

        navigate("/password", { state: { userInfo } });
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    },
    onError: () => {
      console.log("Login Failed");
    }
  });

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* background - image */}
      <img
        src="./login_background.png"
        alt="background"
        className="absolute top-0 left-0 w-full h-full z-10 opacity-25 object-cover "
      />

      {/* login form section */}
      <div className="login-form-section absolute top-0 left-0 w-screen h-screen z-20 flex flex-col items-center justify-center">
        {/* form - section */}
        <form
          className="login-form w-[400px] max-[400px]:w-[300px] h-max flex flex-col items-center justify-center gap-4 p-4"
          onSubmit={handleSubmit}
        >
          {/* icon-section */}
          <Link to={"/"}>
            <img
              src="./Latexio_Logo_F_01.svg"
              alt="logo"
              className="w-[250px] h-[60px] max-[400px]:w-[200px] mb-4 max-[800px]:mb-3 max-[400px]:mb-2"
            />
          </Link>

          {/* email-input */}
          <div className="email-container w-full h-[45px] flex items-center">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              className="w-full h-full rounded-4xl border-1 border-black pl-5 outline-none"
              onChange={InputHandler}
              value={userData.email}
            />
          </div>

          {/* password-input */}
          <div className="password-container cursor-pointer w-full h-[45px] flex items-center relative ">
            <input
              type={toggleIcon ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Password"
              className="w-full h-full rounded-4xl border-1 border-black pl-5 outline-none"
              onChange={InputHandler}
              value={userData.password}
            />
            {toggleIcon ? (
              <FaEye
                onClick={TogglePasswordIcon}
                className="absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2 text-2xl mr-2"
              />
            ) : (
              <FaEyeSlash
                onClick={TogglePasswordIcon}
                className="absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2 text-2xl mr-2"
              />
            )}
          </div>

          {/* checkbox-password */}
          <div className="checkbox-password w-full h-fit flex items-center justify-between text-[14px] max-[400px]:text-[12px] px-4 max-[400px]:px-2 my-2">
            <div className="login-checkbox-section flex items-center gap-2 max-[400px]:gap-1">
              <input
                type="checkbox"
                name="check-box"
                id="check-box"
                className="cursor-pointer"
              />
              <label
                htmlFor="check-box"
                className="text-slate-500 cursor-pointer hover:scale-105 transition-transform duration-200"
              >
                Remember me
              </label>
            </div>
            <a
              href="#"
              className="text-secondary font-semibold cursor-pointer hover:scale-105 transition-transform duration-200"
            >
              Forgot your password?
            </a>
          </div>

          {/* login-button */}

          <button className="login-button cursor-pointer hover:scale-95 transition-transform duration-200 w-full h-[45px] bg-primary rounded-4xl text-white font-bold flex justify-center items-center">
            {loading ? <Spinner className={`text-white`} /> : "Log In"}
          </button>

          {/* Don't-have-account-section */}
          <h3 className="w-full flex justify-center items-center gap-2 px-6 max-[400px]:px-4 py-2 text-slate-500 max-[400px]:text-[12px] mb-3">
            Don't have an account?{" "}
            <Link
              to={"/signup"}
              className="text-secondary font-semibold cursor-pointer hover:scale-105 transition-transform duration-200"
            >
              Register Now
            </Link>{" "}
          </h3>

          {/* or-section */}
          <div className="or-section relative w-[500px] max-[500px]:w-[400px] max-[400px]:w-[300px] h-[0.2px] bg-slate-300">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-white text-slate-500 text-[12px]">
              Or
            </span>
          </div>
        </form>

        <div className="login-google-auth w-[400px] max-[400px]:w-[300px] h-max flex flex-col items-center justify-center px-4">
          {/* login-google-button */}
          <button
            type="button"
            className="login-google-button cursor-pointer w-full h-[45px] flex items-center justify-center gap-4 border-1 border-black rounded-4xl text-black font-bold my-4 hover:scale-95 transition-transform duration-200"
            onClick={() => loginWithOauth()}
          >
            <FcGoogle size={25} />
            Log in with Google
          </button>

          {/* privacy-policy-section */}
          <div className="privacy-policy w-full flex flex-col justify-center items-center gap-1  text-slate-500 text-[10px] max-[400px]:text-[10px] mt-4">
            <h3 className="w-full flex max-[400px]:flex-col justify-center items-center gap-1 text-slate-500">
              The site is protected by Recaptcha and the Google{" "}
              <span className="text-secondary font-semibold">
                Privacy policy
              </span>{" "}
            </h3>
            <h3 className="w-full flex justify-center items-center gap-1 text-slate-500">
              <span className="text-secondary font-semibold">
                Terms of service
              </span>{" "}
              apply
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
