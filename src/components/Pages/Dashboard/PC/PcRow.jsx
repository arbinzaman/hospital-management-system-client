import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const PcRow = ({ invoice, i, role, refetch, setRefetch }) => {
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
              This process can't be undone!`,
      showCancelButton: true,
      confirmButtonText: "Okay",
    }).then((results) => {
      if (results.isConfirmed) {
        fetch(`https://hms-server-uniceh.vercel.app/api/v1/pc/${id}`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            if (result.status === "success") toast.success(result.message);
            else toast.error(result.error);
            setRefetch(!refetch);
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

  return (
    <tr key={invoice?._id}>
      <th className="text-center py-2">{invoice?.serialId}</th>
      <td className="text-center py-2">{invoice?.name}</td>
      <td className="text-center py-2">{invoice?.phone}</td>
      <td className="text-center py-2">{invoice?.location}</td>
      <td className="text-center py-2">
        <button className="btn btn-xs">
          <Link to={`/pc/details/${invoice._id}`}>Details</Link>
        </button>
      </td>

      {(role?.includes("super-admin") || role?.includes("admin")) && (
        <td className="py-2">
          {delLoading ? (
            <img
              className="w-6 animate-spin mx-auto"
              src="/assets/loading.png"
              alt=""
            />
          ) : (
            <FaTrash
              onClick={() => handleDelete(invoice?._id)}
              className="text-tahiti-red cursor-pointer mx-auto"
            ></FaTrash>
          )}
        </td>
      )}
    </tr>
  );
};

export default PcRow;
