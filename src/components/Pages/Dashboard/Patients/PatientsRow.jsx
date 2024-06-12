import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FcMoneyTransfer, FcViewDetails } from "react-icons/fc";

const PatientsRow = ({ patient, i, role, setRefetch, pageNumber }) => {
  const [delLoading, setDelLoading] = useState(null);

  const date = new Date(patient?.createdAt);
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
        fetch(`https://hms-server-uniceh.vercel.app/api/v1/patient/${id}`, requestOptions)
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

  return (
    <tr>
      <th className="text-center py-2">{(pageNumber - 1) * 10 + (i + 1)}</th>
      <td className="text-center py-2">{patient?.serialId}</td>
      <td className="text-center py-2">{patient?.name}</td>
      <td className="text-center py-2">{formattedDate.replace(",", "")}</td>
      <td className="text-center py-2">{patient?.age}</td>
      <td className="text-center py-2">{patient?.bloodGroup}</td>
      <td className="text-center py-2">{patient?.gender}</td>
      <td className="text-center py-2">{patient?.phone}</td>
      {
        (role?.includes("receptionist") || role?.includes("admin")) && <td className="text-center py-2">
        <Link to={`/createinvoice/${patient._id}`}>
          <FcMoneyTransfer className="mx-auto text-2xl"></FcMoneyTransfer>
        </Link>
      </td>
      }
      <td className="text-center py-2">
        <Link to={`/patient/newpatientprofile/${patient._id}`}>
          <FcViewDetails className="text-2xl mx-auto"></FcViewDetails>
        </Link>
      </td>

      {(role?.includes("super-admin") || role?.includes("admin")) && (
        <td>
          {delLoading ? (
            <img
              className="w-6 animate-spin mx-auto"
              src="assets/loading.png"
              alt=""
            />
          ) : (
            <FaTrash
              onClick={() => handleDelete(patient?._id)}
              className="text-tahiti-red cursor-pointer mx-auto"
            ></FaTrash>
          )}
        </td>
      )}
    </tr>
  );
};

export default PatientsRow;
