import React, { useEffect, useState } from "react";
import { AiOutlineFileImage } from "react-icons/ai";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const RichTextUpdate = ({ id }) => {
  const [testData, setTestData] = useState({
    remarks: "",
    image_url: "",
  });
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const navigate = useNavigate();

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  const selectFile = (e) => {
    setImage(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
  ];

  useEffect(() => {
    fetch(`https://hms-server-uniceh.vercel.app/api/v1/test/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          setTestData({
            remarks: result.data.remarks,
            image_url: result.data.image_url,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong while fetching the test details!",
            footer: result.error,
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong while fetching the test details!",
          footer: error.message,
        });
      });
  }, []);

  const handleSubmit = () => {
    Swal.fire({
      title: "Uploading File",
      html: "Please wait while we upload the file...",
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = new FormData();
    if (imageUrl) formData.append("image", image, image?.name);
    if (content) formData.append("remarks", content);

    fetch(`https://hms-server-uniceh.vercel.app/api/v1/test/upload-image/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          Swal.fire({
            icon: "success",
            title: result.message,
          }).then(() => {
            navigate(`/testDetails/${id}`);
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong while uploading the file!",
            footer: result.error,
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong while uploading the file!",
          footer: error.message,
        });
      });
    window.URL.revokeObjectURL(imageUrl);
  };

  console.log(testData.remarks);

  return (
    <div>
      <ReactQuill
        value={content}
        onChange={setContent}
        modules={modules}
        formats={formats}
      />
      {imageUrl ? (
        <div className="mt-4 relative">
          <p className="text-xs mb-2">
            *** Please note that this image will be placed at the top right of
            the test result document***
          </p>
          <img className="w-64" src={imageUrl} alt="" />
          <button
            onClick={() => {
              URL.revokeObjectURL(imageUrl);
              setImage(null);
              setImageUrl(null);
            }}
            className="btn btn-xs absolute top-6 left-48 bg-tahiti-red border-0"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="flex mt-4">
          <p className="font-medium mr-4">Choose File: </p>
          <label htmlFor="file-upload">
            <AiOutlineFileImage className="text-2xl cursor-pointer" />
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={selectFile}
            className="hidden"
            accept="image/*"
          />
        </div>
      )}
      <button
        onClick={handleSubmit}
        className="btn btn-sm mt-2 bg-tahiti-primary border-0 "
      >
        Confirm
      </button>
    </div>
  );
};

export default RichTextUpdate;
