import React from "react";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { GrDocumentUpdate } from "react-icons/gr";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const BedCategoryRow = ({ category, i, refetch, setRefetch }) => {
  const [delLoading, setDelLoading] = useState(null);
  console.log(category);
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
        fetch(
          `https://hms-server-uniceh.vercel.app/api/v1/bed/category/${id}`,
          requestOptions
        )
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
      <th>{i + 1}</th>
      <td className="text-center">{category?.name}</td>
      <td className="text-center">{category?.charge}৳</td>
      <td>
        <Link to ={`/bed/updatecategory/${category._id}`}>
          <GrDocumentUpdate className="text-xl mx-auto cursor-pointer"></GrDocumentUpdate>
        </Link>
      </td>
      <td>
        {delLoading ? (
          <img
            className="w-6 animate-spin mx-auto"
            src="assets/loading.png"
            alt=""
          />
        ) : (
          <FaTrash
            onClick={() => handleDelete(category?._id)}
            className="text-tahiti-red cursor-pointer mx-auto text-xl"
          ></FaTrash>
        )}
      </td>
    </tr>
  );
};

export default BedCategoryRow;
