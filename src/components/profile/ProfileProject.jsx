import React from "react";

const ProfileProject = ({ projects, title }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 w-max rounded-md ">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {projects.map((item) => {
          return (
            <div className="bg-white border-2 border-shadow rounded-md p-4 hover:scale-95 transition-transform cursor-pointer">
              <p className="text-sm text-gray-500">{item.date}</p>
              <h3 className="text-lg font-semibold mt-1">{item.name}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileProject;
