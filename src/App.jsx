import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from "./page/Login/Login";
import HomePage from "./page/Home/Homepage";
import About from "./page/About/About";
import Faq from "./page/Faq/Faq";
import Dashboard from "./page/Dashboard/Dashboard";
import Allproject from "./page/Project/Allproject";
import Feature from "./page/Feature/Feature";
import Contact from "./page/Contact/Contact";
import Template from "./page/Template/Template";
import Editor from "./page/Editor/EditorPage";
import Signup from "./page/Signup/Signup";
import PricingPage from "./page/Pricing/PricingPage";
import ProfilePage from "./page/profile/ProfilePage";
import PasswordComponent from "./components/password/Password";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/feature" element={<Feature />} />
        <Route path="/template" element={<Template />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/editor/:id" element={<Editor />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<ProfilePage />}/>
        <Route path="/password" element={<PasswordComponent />}/>


        {/* Nested loops */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="userproject" element={<Allproject />} />
          <Route path="shared" element={<Allproject />} />
          <Route path="archived" element={<Allproject />} />
          <Route path="trashed" element={<Allproject />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
