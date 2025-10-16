import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "@fortawesome/fontawesome-free/css/all.min.css";
const client_id =
  "829390349721-ol6jqu07jp0jmnthteongkmghnq4vka1.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <div className="w-full h-max">
    <GoogleOAuthProvider clientId={client_id} >
      <AuthProvider>
        <App />
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            // Define default options
            className: "",
            duration: 5000,
            removeDelay: 1000,
            style: {
              background: "#363636",
              color: "#fff"
            },

            // Default options for specific types
            success: {
              duration: 2000,
              iconTheme: {
                primary: "#722323"
              },
              style: {
                background: "#ff7a5a",
                color: "#fff",
                height: "10vh"
              }
            },
            error: {
              duration: 2000,
              style: {
                background: "#FF9587",
                color: "#722323",
                height: "10vh"
              }
            }
          }}
        />
      </AuthProvider>
    </GoogleOAuthProvider>
  </div>
);
