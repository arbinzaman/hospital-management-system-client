import React from "react";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FcEditImage } from "react-icons/fc";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const TestNameRow = ({ category, i, refetch, setRefetch }) => {
  const [delLoading, setDelLoading] = useState(null);
  const handleDelete = (id) => {
    setDelLoading(true);

    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("LoginToken")}`
    );

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    Swal.fire({
      title: `Are you sure?
              This process cannot be undone!`,
      showCancelButton: true,
      confirmButtonText: "Okay",
    }).then((results) => {
      if (results.isConfirmed) {
        fetch(`https://hms-server-uniceh.vercel.app/api/v1/test_name/${id}`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            setDelLoading(false);
            if (result.status === "success") toast.success(result.message);
            else toast.error(result.error);
            setRefetch(!refetch);
          })
          .catch((error) => {
            toast.error(error);
            setDelLoading(false);
          });
      }
      if (results.isDismissed) setDelLoading(false);
    });
  };

  return (
    <tr>
      <th className=" py-2">{i + 1}</th>
      <td className=" py-2">{category?.name}</td>
      <td className=" py-2">{category?.normalValue}</td>
      <td className="py-2 text-center">
        <Link to={`/testName/update/${category?._id}`}>
            <FcEditImage className="text-lg mx-auto"></FcEditImage>
        </Link>
      </td>
      <td className=" py-2">
        {delLoading ? (
          <img
            className="w-4 animate-spin mx-auto"
            src="/assets/loading.png"
            alt=""
          />
        ) : (
          <FaTrash
            onClick={() => handleDelete(category?._id)}
            className="text-tahiti-red cursor-pointer mx-auto"
          ></FaTrash>
        )}
      </td>
    </tr>
  );
};

export default TestNameRow;
