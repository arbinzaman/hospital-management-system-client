import React, { useState } from "react";
import { FaFileUpload, FaTrash } from "react-icons/fa";
import { FcViewDetails } from "react-icons/fc";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const TestRow = ({ invoice, role, setRefetch }) => {
  const [delLoading, setDelLoading] = useState(null);

  const myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    `Bearer ${localStorage.getItem("LoginToken")}`
  );

  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow",
  };

  const handleDelete = (id) => {
    setDelLoading(true);

    Swal.fire({
      title: `Are you sure?
              This process can't be undone!`,
      showCancelButton: true,
      confirmButtonText: "Okay",
    }).then((results) => {
      if (results.isConfirmed) {
        fetch(
          `https://hms-server-uniceh.vercel.app/api/v1/test/${id}`,
          requestOptions
        )
          .then((response) => response.json())
          .then((result) => {
            if (result.status === "success") toast.success(result.message);
            else toast.error(result.error);
            setRefetch();
            setDelLoading(false);
          })
          .catch((error) => {
            toast.error(error);
            setDelLoading(false);
          });
      }
      if (results.isDismissed) setDelLoading(false);
    });
  };

  const date = new Date(invoice?.createdAt);
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = date
    .toLocaleDateString("en-US", options)
    .replace(/ /g, "/");

  return (
    <tr>
      <td className="py-2">{invoice?.serialId}</td>
      <td className="text-center py-2">{invoice?.patient?.name}</td>
      <td className="text-center py-2">{invoice?.category?.name}</td>
      <td className="text-center py-2">{formattedDate.replace(",", "")}</td>
      <td className="text-center py-2">
        {invoice?.available ? "Available" : "Not Available"}
      </td>
      {role?.includes("labaratorist") && (
        <>
          <td className="py-2">
            <Link to={`/test/${invoice?._id}`}>
              <FaFileUpload className="text-2xl cursor-pointer mx-auto" />
            </Link>
          </td>
        </>
      )}
      <td className="text-center py-2">
        <Link to={`/testDetails/${invoice?._id}`}>
          <FcViewDetails className="text-2xl mx-auto"></FcViewDetails>
        </Link>
      </td>
      {(role?.includes("super-admin") || role?.includes("admin")) && (
        <td className="py-2">
          {delLoading ? (
            <img
              className="w-6 animate-spin mx-auto"
              src="assets/loading.png"
              alt=""
            />
          ) : (
            <FaTrash
              onClick={() => handleDelete(invoice?._id)}
              className="text-tahiti-red text-lg cursor-pointer mx-auto"
            ></FaTrash>
          )}
        </td>
      )}
    </tr>
  );
};

export default TestRow;
