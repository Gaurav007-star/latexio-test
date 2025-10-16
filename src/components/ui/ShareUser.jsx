import { useMemo, useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { Input } from "./input";
import InfiniteScroll from "react-infinite-scroll-component";
import { Highlighter } from "../magicui/highlighter";
import { useAuth } from "@/context/AuthContext";
import { TbLocationShare } from "react-icons/tb";
import { Button } from "./button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { apiFetch } from "@/api/apiFetch";

const ShareInputComponent = ({ users, shareUser, setShareUser, projectId }) => {
  const { user } = useAuth();
  const [searchShareUser, setSearchShareUser] = useState("");
  const [filterUser, setFilterUser] = useState([]);
  const [displayUsers, setDisplayUsers] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [count, setCount] = useState(4);

  // Permissions for each invited user
  const [permissions, setPermissions] = useState({});

  const StoreShareUser = (e) => {
    setSearchShareUser(e.target.value);
  };

  useMemo(() => {
    if (searchShareUser.length > 2) {
      let searchResult = users.filter((user) =>
        user.email.toLowerCase().includes(searchShareUser.toLowerCase())
      );
      setFilterUser(searchResult);
      setDisplayUsers(searchResult.slice(0, 4));
      setCount(4);
      setHasMore(searchResult.length > 4);
    }
  }, [searchShareUser, users]);

  const fetchMoreData = () => {
    if (displayUsers.length >= filterUser.length) {
      setHasMore(false);
      return;
    }
    const nextCount = count + 4;
    setDisplayUsers(filterUser.slice(0, nextCount));
    setCount(nextCount);
  };

  const SubmitSearchShare = async (usr) => {
    try {
      const response = await apiFetch(
        `/project/invite/${projectId}`,
        {
          method: "POST",
          body: JSON.stringify({
            email: usr.email,
          }),
          
        }
      );
      console.log(response);
      
    } catch (error) {
      console.log(error);
      
    }
  };

  const handlePermissionChange = (email, level) => {
    setPermissions((prev) => ({ ...prev, [email]: level }));
  };

  const removeUser = (email) => {
    const updated = shareUser.filter((u) => u.email !== email);
    setShareUser(updated);
    localStorage.setItem("share-user", JSON.stringify(updated));
  };

  return (
    <div className="share-input-wrapper w-full max-w-lg mx-auto bg-white p-6 rounded-2xl">
      <h1 className="text-center text-[30px] font-semibold text-gray-800 mb-4">
        Add <Highlighter>Collaborator</Highlighter>
      </h1>

      {/* Selected Users (chips) */}
      {shareUser.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {shareUser.map((u) => (
            <div
              key={u.email}
              className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 text-sm"
            >
              <img
                src={
                  u.imageUrl ||
                  "https://xsgames.co/randomusers/avatar.php?g=pixel"
                }
                alt={u.email}
                className="w-6 h-6 rounded-full"
              />
              <span>{u.email}</span>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => removeUser(u.email)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input + Search */}
      <div className="relative mb-4">
        <IoIosSearch className="text-gray-500 absolute top-1/2 left-3 -translate-y-1/2 text-lg" />
        <Input
          type="email"
          placeholder="Add people or groups"
          className="w-full pl-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-secondary h-[7vh]"
          onChange={StoreShareUser}
          value={searchShareUser}
        />

        {searchShareUser && (
          <div className="absolute top-15 bg-white border rounded-lg shadow-lg z-50 w-full max-h-48 overflow-y-auto">
            {filterUser.length > 0 ? (
              <InfiniteScroll
                dataLength={displayUsers.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={
                  <h4 className="text-center py-2 text-gray-500">Loading...</h4>
                }
                scrollableTarget="scrollableDiv"
                className="flex flex-col file-scrollbar"
              >
                {displayUsers.map((usr) => {
                  const nameExists = shareUser.some(
                    (item) => item.email === usr.email
                  );
                  return (
                    <div
                      key={usr.id}
                      className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer file-scroll "
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            usr.imageUrl ||
                            "https://xsgames.co/randomusers/avatar.php?g=pixel"
                          }
                          alt={usr.email}
                          className="w-8 h-8 rounded-full"
                        />
                        <span>{usr.email}</span>
                      </div>
                      {nameExists ? (
                        <span className="text-sm text-blue-500 font-medium">
                          Added
                        </span>
                      ) : (
                        <button
                          className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800"
                          onClick={() => SubmitSearchShare(usr)}
                        >
                          Add <FaTelegramPlane />
                        </button>
                      )}
                    </div>
                  );
                })}
              </InfiniteScroll>
            ) : (
              <p className="text-center text-gray-500 py-3">No user found</p>
            )}
          </div>
        )}
      </div>

      {/* People with access */}
      <div className="mt-5 border-t pt-4">
        <h2 className="text-lg font-medium text-gray-800 mb-2">
          People with access
        </h2>

        {/* Owner */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <img
              src="https://xsgames.co/randomusers/avatar.php?g=pixel"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-gray-700">{user.email}</span>
          </div>
          <span className="text-gray-500 text-sm">Owner</span>
        </div>

        {/* Invited Users with permission control */}
        {shareUser.map((usr) => (
          <div
            key={usr.email}
            className="flex items-center justify-between py-2 border-b last:border-none"
          >
            <div className="flex items-center gap-3">
              <img
                src={
                  usr.imageUrl ||
                  "https://xsgames.co/randomusers/avatar.php?g=pixel"
                }
                className="w-8 h-8 rounded-full"
              />
              <span className="text-gray-700">{usr.email}</span>
            </div>

            <select
              className="select w-[100px] select-md border-primary border outline-none"
              value={permissions[usr.email] || "Viewer"}
              onChange={(e) =>
                handlePermissionChange(usr.email, e.target.value)
              }
            >
              <option>Accept</option>
              <option>View</option>
              <option>Remove</option>
            </select>
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-end">
        <button
          className="bg-primary hover:bg-secondary text-white font-medium px-5 py-2 rounded-lg transition-all flex items-center gap-1"
          onClick={() => alert("Invites sent!")}
        >
          <TbLocationShare /> Send
        </button>
      </div>
    </div>
  );
};

export default ShareInputComponent;
