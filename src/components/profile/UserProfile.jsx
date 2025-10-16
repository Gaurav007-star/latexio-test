import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import DialogModal from "../Dialog/DialogAIGen";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { RiDeleteBin2Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import userProfileImage from "../../assests/profile.png";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/api/apiFetch";

const inputButtons = (
  id,
  title,
  name,
  inputType,
  placeholder,
  Handler,
  value
) => ({
  id,
  title,
  name,
  inputType,
  placeholder,
  Handler,
  value,
});



const UserProfile = () => {
  const { user, getNewUserDetails } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: "",
    designation: "",
    email: "",
    address: "",
    socialLinks: [],
    organization: "",
    bio: "",
  });

  // Default social links as simple strings
  const socialLinkTitles = ["Twitter", "GitHub", "Meta"];
  const defaultSocialLinks = ["", "", ""];

  useEffect(() => {
    const initializeUserData = () => {
      if (user) {
        setUserData({
          name: user.name || "",
          designation: user.designation || "",
          email: user.email || "",
          address: user.address || "",
          socialLinks:
            user.socialLinks && Array.isArray(user.socialLinks)
              ? user.socialLinks
              : defaultSocialLinks,
          organization: user.organization || "",
          bio: user.bio || "",
        });
      } else {
        // Set default data when no user
        setUserData((prev) => ({
          ...prev,
          socialLinks: defaultSocialLinks,
        }));
      }
      setLoading(false);
    };
    initializeUserData();
  }, [user]);

  // API CALL HANDLER
  const userDetailsUploader = async () => {
    try {
      setLoading(true);

      const data = await apiFetch(`/auth/updateuser/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (data.success) {
        await getNewUserDetails();
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const InputHandler = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialLinkChange = (index, value) => {
    setUserData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) =>
        i === index ? value : link
      ),
    }));
  };

  const handleBioChange = (e) => {
    setUserData((prev) => ({
      ...prev,
      bio: e.target.value,
    }));
  };

  // FORM SUBMIT HANDLER
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    await userDetailsUploader();
  };

  const handleCancel = () => {
    // Reset form to original user data
    if (user) {
      setUserData({
        name: user.name || "",
        designation: user.designation || "",
        email: user.email || "",
        address: user.address || "",
        socialLinks:
          user.socialLinks && Array.isArray(user.socialLinks)
            ? user.socialLinks
            : defaultSocialLinks,
        organization: user.organization || "",
        bio: user.bio || "",
      });
    }
    toast.success("Changes reverted");
  };

  const inputDetails = [
    inputButtons(
      1,
      "Username",
      "name",
      "text",
      "name",
      InputHandler,
      userData.name
    ),
    inputButtons(
      2,
      "Designation",
      "designation",
      "text",
      "Designation",
      InputHandler,
      userData.designation
    ),
    inputButtons(
      3,
      "Email",
      "email",
      "email",
      "emailis@private.com",
      InputHandler,
      userData.email
    ),
    inputButtons(
      4,
      "Address",
      "address",
      "text",
      "Address",
      InputHandler,
      userData.address
    ),
    inputButtons(
      5,
      "Organization",
      "organization",
      "text",
      "Organization",
      InputHandler,
      userData.organization
    ),
  ];

  if (loading) {
    return (
      <div className="w-full mx-auto p-6 max-[450px]:p-2 border-l-2 flex flex-col items-start justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6 max-[450px]:p-2 border-l-2">
      {/* Title */}
      <h2 className="text-[40px] max-[450px]:text-[24px] w-full max-[450px]:text-center font-semibold text-primary mb-6">
        Public profile
      </h2>

      {/* Form Section */}
      <div className="w-full h-max rounded-md py-4 ">
        <form
          className="px-6 max-[450px]:px-2 w-full flex flex-col gap-4"
          onSubmit={handleSaveChanges}
        >
          {/* First two inputs side by side */}
          <div className="grid grid-cols-2 gap-4 max-[450px]:grid-cols-1">
            {inputDetails.slice(0, 2).map((item) => (
              <div key={item.id} className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">{item.title}</label>
                <Input
                  type={item.inputType}
                  name={item.name}
                  placeholder={item.placeholder}
                  value={item.value}
                  onChange={item.Handler}
                  className="w-full h-[52px] rounded-md px-3 border border-[#E9E6F3] focus:border-secondary outline-none"
                />
              </div>
            ))}
          </div>

          {/* Remaining inputs stacked full width */}
          {inputDetails.slice(2).map((item) => (
            <div key={item.id} className="flex flex-col gap-1">
              <label className="text-sm text-gray-700">{item.title}</label>
              <Input
                type={item.inputType}
                name={item.name}
                placeholder={item.placeholder}
                value={item.value}
                onChange={item.Handler}
                className="w-full h-[52px] rounded-md px-3 border border-[#E9E6F3] focus:border-secondary outline-none"
              />
            </div>
          ))}

          {/* Social Links */}
          <div className="grid grid-cols-3 gap-4 max-[450px]:grid-cols-1">
            {userData.socialLinks?.map((item, index) => (
              <div key={index} className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">
                  {socialLinkTitles[index]}
                </label>
                <Input
                  type="text"
                  name={`social-${index}`}
                  placeholder="Enter social links"
                  value={item}
                  onChange={(e) =>
                    handleSocialLinkChange(index, e.target.value)
                  }
                  className="w-full h-[52px] rounded-md px-3 border border-[#E9E6F3] focus:border-secondary outline-none"
                />
              </div>
            ))}
          </div>

          {/* Bio textarea */}
          <div className="flex flex-col gap-1 mt-2">
            <label className="text-sm text-gray-700">Bio</label>
            <textarea
              name="bio"
              id="bio"
              placeholder="Enter your bio"
              value={userData.bio}
              onChange={handleBioChange}
              className="w-full h-[100px] rounded-md px-3 border border-[#E9E6F3] focus:border-secondary outline-none resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="px-0 mt-4 flex max-[450px]:flex-col justify-end gap-4">
            <Button
              type="button"
              onClick={handleCancel}
              className="bg-transparent border border-[#E9E6F3] text-icon hover:text-white rounded-full p-6"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-icon text-white rounded-full p-6"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
