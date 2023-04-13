import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useUserData from "../../../../Hooks/useUserData";
import Spinner from "../../../../Shared/Spinner";

const UserProfile = () => {
  const [image, setImage] = useState(null);
  const [userData, role, loading] = useUserData();

  const imageInput = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  // Update Profile Picture
  const updateProfilePic = () => {
    const formData = new FormData();
    formData.append("image", image, image?.name);
    //  send to backend
    fetch("https://hms-server.onrender.com/api/v1/user/upload-picture", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          toast.success(`Profile Picture Updated.
          Please Refresh to see updated picture`);
        } else {
          toast.error(result.error);
        }
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
      });
  };
  // if (loading) return <Spinner></Spinner>

  if (loading) return <Spinner></Spinner>;

  return (
    <div className="grid justify-items-center  ">
      <section className="pt-16 bg-blueGray-50 w-full p-56 ">
        <div className="w-full  px-4 mx-auto  ">
          <div className="relative bg-tahiti-white  flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full px-4 flex justify-center">
                  <div className="w-48 h-48 bg-indigo-100 bg-tahiti-white   mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
                    {userData?.imageURL ? (
                      <img
                        src={userData?.imageURL}
                        className="rounded-full w-48 h-48 object-cover"
                        alt=""
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-24 w-24 "
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="w-full px-4 text-center mt-20"></div>
              </div>
              <div className="text-center mt-12 pb-20">
                <h3 className="text-xl font-semibold leading-normal text-blueGray-700 mb-2">
                  {userData?.firstName} {userData?.lastName}
                </h3>
                <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                  <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                  {role}
                </div>
                <div className="mb-2 text-blueGray-600 mt-10">
                  <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
                  Email: <b>{userData?.email}</b>
                </div>
                <div className="mb-2 text-blueGray-600">
                  <i className="fas fa-university mr-2 text-lg text-blueGray-400"></i>
                  Phone: <b>{userData?.phone}</b>
                </div>

                <input
                  type="file"
                  onChange={imageInput}
                  name="file"
                  id="file"
                  placeholder=""
                  className="w-full px-3 py-2 rounded-md "
                />
                <button
                  className="btn btn-ghost bg-tahiti-primary"
                  onClick={updateProfilePic}
                >
                  Update Profile PIcture
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserProfile;
