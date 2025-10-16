import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
// import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { apiFetch, ApiError } from "../../api/apiFetch";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import toast from "react-hot-toast";
import { Spinner } from "../ui/kibo-ui/spinner";

const Signup = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = location.state?.from?.pathname || "/dashboard";

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    const userEmail = localStorage.getItem("user-email");

    if (userEmail) {
      setUserData((prev) => {
        return { ...prev, email: userEmail };
      });
    }
  }, []);

  const [toggleIcon, setToggleIcon] = useState(false);
  const [loading, setLoading] = useState(false);
  // password show nd close handler
  const TogglePasswordIcon = () => {
    setToggleIcon((prev) => !prev);
  };

  // comment:Form submit handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await apiFetch("/auth/createuser", {
        method: "POST",
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password
        })
      });

      if (response.success === false) {
        toast.error(response.message);
      } else if (response && response.authToken) {
        await auth.setTokenAndFetchUser(response.authToken);

        // remove localstorage data
        localStorage.removeItem("user-email");
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

  const signupWithOauth = useGoogleLogin({
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

      {/* Signup form section */}
      <div className="Sign-up-form-section absolute top-0 left-0 w-screen h-screen z-20 flex flex-col items-center justify-center">
        {/* form - section */}
        <form
          className="login-form w-[400px] max-[400px]:w-[300px] h-max flex flex-col items-center justify-center gap-4 p-4"
          onSubmit={handleSubmit}
        >
          {/* icon-section */}
          <img
            src="./Latexio_Logo_F_01.svg"
            alt="logo"
            className="w-[250px] h-[60px] max-[400px]:w-[200px] mb-4 max-[800px]:mb-3 max-[400px]:mb-2 cursor-pointer"
            onClick={() => navigate("/")}
          />

          {/* name-input */}
          <div className="email-container w-full h-[45px] flex items-center">
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Username"
              className="w-full h-full rounded-4xl border-1 border-black pl-5 outline-none"
              onChange={InputHandler}
              value={userData.name}
            />
          </div>

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
              className="text-secondary font-semibold hover:scale-105 transition-transform duration-200"
            >
              Forgot your password?
            </a>
          </div>

          {/* login-button */}
          <button className="sign-up cursor-pointer hover:scale-95 transition-transform duration-200 w-full h-[45px] bg-primary rounded-4xl text-white font-bold flex justify-center items-center">
            {loading ? <Spinner className={`text-white`} /> : "Sign Up"}
          </button>

          {/* Don't-have-account-section */}
          <h3 className="w-full flex justify-center items-center gap-2 px-6 max-[400px]:px-4 py-2 text-slate-500 max-[400px]:text-[12px] mb-3">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="text-secondary font-semibold cursor-pointer hover:scale-105 transition-transform duration-200"
            >
              Login Now
            </Link>{" "}
          </h3>

          {/* or-section */}
          <div className="or-section relative w-[500px] max-[500px]:w-[400px] max-[400px]:w-[300px] h-[0.2px] bg-slate-300">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-white text-slate-500 text-[12px]">
              Or
            </span>
          </div>
        </form>

        <div className="google-auth-section w-[400px] max-[400px]:w-[300px] h-max flex flex-col items-center justify-center px-4">

          {/* login-google-button */}
          <button className="login-google-button cursor-pointer w-full h-[45px] flex items-center justify-center gap-4 border-1 border-black rounded-4xl text-black font-bold my-4 hover:scale-95 transition-transform duration-200" onClick={() => signupWithOauth()}>
            <FcGoogle size={25} />
            Sign up with Google
          </button>

          {/* privacy-policy-section */}
          <div className="privacy-policy cursor-pointer w-full flex flex-col justify-center items-center gap-1  text-slate-500 text-[10px] max-[400px]:text-[10px] mt-4">
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

export default Signup;
