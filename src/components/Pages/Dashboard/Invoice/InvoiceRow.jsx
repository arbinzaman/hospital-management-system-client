import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const InvoiceRow = ({ invoice, i, role, refetch, setRefetch }) => {
  // `${window.location.host}/qr/patient/${invoice?.serialId}`
  
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
        fetch(`https://hms-server-uniceh.vercel.app/api/v1/invoice/${id}`, requestOptions)
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

  const date = new Date(invoice?.createdAt);
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = date
    .toLocaleDateString("en-US", options)
    .replace(/ /g, "/");

  return (
    <tr key={invoice?._id}>
      <th className="text-center">{i + 1}</th>
      <td>{invoice?.serialId}</td>
      <td className="text-center">{invoice?.patient?.name}</td>
      <td className="text-center">{formattedDate.replace(",", "")}</td>
      <td className="text-center">{invoice?.dueAmount}৳</td>
      <td className="text-center">{invoice?.grand_total}৳</td>
      <td className="text-center">
        {invoice?.dueAmount === 0 ? "Paid" : "Unpaid"}
      </td>
      <td className="text-center">
        <button className="btn btn-xs">
          <Link to={`/payment/invoice/${invoice._id}`}>Details</Link>
        </button>
      </td>

      {(role?.includes("super-admin") || role?.includes("admin")) && (
        <td>
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

export default InvoiceRow;
