import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const AppointmentsRow = ({ appointment, index, role, refetch, setRefetch }) => {
  const [delLoading, setDelLoading] = useState(null);

  const date = new Date(appointment?.createdAt);
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = date
    .toLocaleDateString("en-US", options)
    .replace(/ /g, "/");

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
        fetch(`https://server.thelabaidhospital.com/api/v1/appointment/${id}`, requestOptions)
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
    <tr key={appointment?._id}>
      <th className="text-center">{index + 1}</th>
      <td className="text-center">{appointment?.serialId}</td>
      <td className="text-center">{formattedDate.replace(",", '')}</td>
      <td className="text-center">{appointment?.patient?.name}</td>
        <td className="text-center">{appointment?.patient?.phone}</td>
      <td className="text-center">{appointment?.reason}</td>
      <td className="text-center">
        {appointment?.paymentCompleted ? (
          <span className="text-tahiti-darkGreen">Paid</span>
        ) : (
          <span className="text-tahiti-red">Unpaid</span>
        )}
      </td>
      <td className="text-center">
        <button className="btn btn-xs">
          <Link to={`/appointment`}>Details</Link>
        </button>
      </td>

      {(role.includes("super-admin") || role.includes("admin")) && (
        <td>
          {delLoading ? (
            <img
              className="w-6 animate-spin mx-auto"
              src="assets/loading.png"
              alt=""
            />
          ) : (
            <FaTrash
              onClick={() => handleDelete(appointment?._id)}
              className="text-tahiti-red cursor-pointer mx-auto"
            ></FaTrash>
          )}
        </td>
      )}
    </tr>
  );
};

export default AppointmentsRow;
