import React from "react";
import useUserData from "../../../../Hooks/useUserData";
import Spinner from "../../../../Shared/Spinner";
import { FaUserAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AiOutlineSetting } from "react-icons/ai";
import Swal from "sweetalert2";

const UserProfile = () => {
  const {user, role, loading} = useUserData();

  // Update Profile Picture
  const handleImageChange = (e) => {
    const image = e.target.files[0];
    const imageUrl = URL.createObjectURL(image);
    Swal.fire({
      title: "Preview of " + image.name,
      imageUrl: imageUrl,
      imageAlt: image.name,
      showCancelButton: true,
      confirmButtonColor: "#00CC99",
      cancelButtonColor: "#f00",
      confirmButtonText: "Confirm",
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, upload the image
        Swal.fire({
          title: "Uploading Image...",
          html: "Please wait while we upload your image...",
          allowOutsideClick: false,
          onBeforeOpen: () => {
            Swal.showLoading();
          },
        });
        const formData = new FormData();
        formData.append("image", image, image?.name);
        // send to backend
        fetch("https://hms-server-uniceh.vercel.app/api/v1/user/upload-picture", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
          },
          body: formData,
        })
          .then((res) => res.json())
          .then((result) => {
            URL.revokeObjectURL(imageUrl);
            if (result.status === "success") {
              Swal.fire({
                icon: "success",
                title: result.message,
              }).then(() => {
                window.location.reload();
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong while uploading the file!",
                footer: error.message,
              });
            }
          });
      }
    });
  };

  if (loading) return <Spinner></Spinner>;

  return (
    <section className="pt-16 w-full px-20">
      <div className="w-full px-4 mx-auto">
        <div className="relative bg-tahiti-white flex w-full mb-6 shadow-xl rounded-lg">
          <div className="px-6 w-full">
            <div className="flex flex-wrap justify-center">
              <div className="p-4">
                <div className="w-48 h-48 bg-indigo-100 bg-tahiti-white rounded-full">
                  {user?.imageURL ? (
                    <img
                      src={user?.imageURL}
                      className="rounded-full w-48 h-48 object-cover border border-tahiti-lightGreen"
                      alt=""
                    />
                  ) : (
                    <FaUserAlt className="text-tahiti-dark opacity-50 text-8xl" />
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold leading-normal text-blueGray-700 mb-2">
                  {user?.firstName} {user?.lastName}
                </h3>
                <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                  {role}
                </div>
                <div className="mb-2 text-blueGray-600 mt-10">
                  Email: <b>{user?.email}</b>
                </div>
                <div className="mb-2 text-blueGray-600">
                  Phone: <b>{user?.phone}</b>
                </div>
              </div>
              <div className="dropdown dropdown-end ml-auto">
                <label tabIndex={0} className="m-1 cursor-pointer">
                  <AiOutlineSetting className="text-xl" />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-tahiti-grey rounded-box w-52"
                >
                  <li>
                    <Link to="/user/updatepassword">Update Password</Link>
                  </li>
                  <li>
                    <div>
                      <label htmlFor="file" className="cursor-pointer">
                        Update Picture
                      </label>
                      <input
                        type="file"
                        onChange={handleImageChange}
                        name="file"
                        id="file"
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
