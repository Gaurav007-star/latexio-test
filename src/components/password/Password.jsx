import React, { useEffect, useId, useMemo, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiFetch, ApiError } from "../../api/apiFetch";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { Spinner } from "../ui/kibo-ui/spinner";
import { CheckIcon, XIcon } from "lucide-react";

const PasswordComponent = () => {
  const [loading, setLoading] = useState(false);
  const [toggleIcon, setToggleIcon] = useState(false);
  const [password, setPassword] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = location.state || {};
  const auth = useAuth();
  const id = useId();

  const checkStrength = (pass) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
    ]

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }))
  }

  const strength = checkStrength(password)

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length
  }, [strength])

  const getStrengthColor = (score) => {
    if (score === 0) return "bg-border"
    if (score <= 1) return "bg-red-500"
    if (score <= 2) return "bg-orange-500"
    if (score === 3) return "bg-amber-500"
    return "bg-emerald-500"
  }

  const getStrengthTextColor = (score) => {
    if (score === 0) return "text-border"
    if (score <= 1) return "text-red-500"
    if (score <= 2) return "text-orange-500"
    if (score === 3) return "text-amber-500"
    return "text-emerald-500"
  }

  const getStrengthText = (score) => {
    if (score === 0) return "Enter a password"
    if (score <= 2) return "😩 Weak password. Must contain:"
    if (score === 3) return "🏋️Medium password. Must contain:"
    return "💪 Strong password."
  }

  useEffect(() => {
    setIsDisabled(loading || strengthScore < 4);
  }, [loading, strengthScore]);

  const fromPath = location.state?.from?.pathname || "/dashboard";

  // console.log("User Info in Password Page:", userInfo);

  const TogglePasswordIcon = () => setToggleIcon(prev => !prev);

  // comment:Form submit handler
  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await apiFetch("/auth/createuser", {
        method: "POST",
        body: JSON.stringify({
          name: userInfo?.name,
          email: userInfo?.email,
          password
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

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* background - image */}
      <img
        src="./login_background.png"
        alt="background"
        className="absolute top-0 left-0 w-full h-full z-10 opacity-25 object-cover "
      />

      {/* login form section */}
      <div className="login-form-section absolute top-0 left-0 w-screen h-screen z-20 flex items-center justify-center">
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
              className="w-[250px] h-[60px] max-[400px]:w-[200px] "
            />
          </Link>

          <div className="text w-full h-max text-sm text-center">
            <h1>Welcome aboard! You’re signed in with <b>Google.</b></h1>
            <h2>Create a password so you can log in directly without Google next time.</h2>
          </div>

          {/* password-input */}
          <div className="password-container cursor-pointer w-full h-[45px] flex items-center relative ">
            <input
              type={toggleIcon ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Password"
              className="w-full h-full rounded-4xl border-1 border-black pl-5 outline-none"
              onChange={e => setPassword(e.target.value)}
              value={password}
            />
            {toggleIcon
              ? <FaEye
                onClick={TogglePasswordIcon}
                className="absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2 text-2xl mr-2"
              />
              : <FaEyeSlash
                onClick={TogglePasswordIcon}
                className="absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2 text-2xl mr-2"
              />}
          </div>

          {
            password.length > 0 && (
              <>
                {/* Password strength indicator */}
                {/* <div
                  className="bg-border mt-2 h-2 w-full overflow-hidden rounded-full"
                  role="progressbar"
                  aria-valuenow={strengthScore}
                  aria-valuemin={0}
                  aria-valuemax={4}
                  aria-label="Password strength"
                >
                  <div
                    className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
                    style={{ width: `${(strengthScore / 4) * 100}%` }}
                  ></div>
                </div> */}

                {/* Password strength description */}
                <p
                  id={`${id}-description`}
                  className={`text-foreground text-[16px] font-medium w-full ${getStrengthTextColor(strengthScore)}`}
                >
                  {getStrengthText(strengthScore)}
                </p>

                {/* Password requirements list */}
                <ul className="space-y-1.5 w-full" aria-label="Password requirements">
                  {strength.map((req, index) => (
                    <li key={index} className="flex items-center gap-2">
                      {req.met ? (
                        <CheckIcon
                          size={16}
                          className="text-emerald-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <XIcon
                          size={16}
                          className="text-muted-foreground/80"
                          aria-hidden="true"
                        />
                      )}
                      <span
                        className={`text-sm ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}
                      >
                        {req.text}
                        <span className="sr-only">
                          {req.met ? " - Requirement met" : " - Requirement not met"}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>

              </>)
          }

          {/* SUBMIT BUTTON */}
          <button className={`login-button cursor-pointer hover:scale-95 transition-transform duration-200 w-full h-[45px] rounded-4xl text-white font-bold flex justify-center items-center  ${isDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-primary"} `} disabled={isDisabled}>
            {loading ? <Spinner className={`text-white`} /> : "Save password"}
          </button>


        </form>
      </div>
    </div>
  );
};

export default PasswordComponent;
