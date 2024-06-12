import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PatientReports from "./PatientReports";
import PatientPresciption from "./PatientPresciption";
import Spinner from "../../../Shared/Spinner";
import QRCode from "react-qr-code";
import { useReactToPrint } from "react-to-print";
import { FaAccessibleIcon } from "react-icons/fa";
import { MdLocalPrintshop } from "react-icons/md";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { toast } from "react-toastify";

const NewPatientProfile = ({ qr }) => {
  const [newPatient, setNewPatient] = useState({});
  const [loading, setLoading] = useState(true);
  const [isPrescription, setIsPrescription] = useState(false);

  const { id } = useParams();

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleDisCharge = (bedId) => {
    var raw = JSON.stringify({
      patient: id,
    });

    const requestOptions = {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
      },
      body: raw,
      redirect: "follow",
    };

    fetch(
      `https://hms-server-uniceh.vercel.app/api/v1/bed/unassign/${bedId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          toast.success(result?.message);
          setTimeout(() => {
            window.location.reload();
          }, 450);
        } else {
          toast.error(result?.error);
        }
      });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch(
        qr
          ? `https://hms-server-uniceh.vercel.app/api/v1/patient/qr/${id}`
          : `https://hms-server-uniceh.vercel.app/api/v1/patient/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
          },
        }
      );
      const data = await response.json();
      setNewPatient(data);
      setLoading(false);
    };
    fetchUserData();
  }, []);

  if (loading) return <Spinner bg></Spinner>;

  return (
    <div className="bg-tahiti-darkGreen min-h-screen sm:p-10">
      {!qr && (
        <>
          <Link to="/">
            <p className="mb-4 flex text-tahiti-white gap-2 items-center hover:text-tahiti-primary transition-colors">
              <BsFillArrowLeftCircleFill className="scale-125"></BsFillArrowLeftCircleFill>
              Back to Dashboard
            </p>
          </Link>
        </>
      )}
      <div className="grid min-h-[calc(100vh-120px)] lg:grid-cols-2 grid-cols-1 gap-x-4 md:gap-y-10 bg-tahiti-green rounded-xl">
        <div className="gap-y-2">
          <h1 className="text-2xl font-semibold col-span-2 mt-4 text-center">
            <span>PATIENT</span>{" "}
            <span className="text-tahiti-lightGreen">INFORMATION</span>
          </h1>
          <div className="flex items-center flex-col md:flex-row mx-10 my-4 gap-10 bg-tahiti-white rounded-lg p-4 border">
            <div className="bg-tahiti-white rounded-full border border-tahiti-primary p-6 shadow-xl">
              <FaAccessibleIcon className="text-7xl"></FaAccessibleIcon>
            </div>
            <div className="space-y-1">
              <h1 className="font-bold text-2xl capitalize">
                {" "}
                {newPatient?.data?.name},{" "}
                <span className="font-normal">{newPatient?.data?.age}</span>
              </h1>
              <p className="text-xl">
                <span className="font-bold">Patient ID</span>:{" "}
                {newPatient?.data?.serialId}
              </p>
              <p className="text-xl">
                <span className="font-bold">Phone</span>:{" "}
                {newPatient?.data?.phone}
              </p>
              <p className="text-xl">
                <span className="font-bold">Blood Group</span>:{" "}
                {newPatient?.data?.bloodGroup}
              </p>
              <p className="text-xl">
                <span className="font-bold">Gender</span>:{" "}
                {newPatient?.data?.gender}
              </p>
            </div>
          </div>
        </div>
        <PatientReports
          qr={qr}
          normal
          reports={newPatient?.data?.tests}
        ></PatientReports>
        <div className="lg:grid grid-cols-3 gap-y-4">
          <h1 className="text-2xl font-semibold col-span-3 text-center mt-4">
            <span>EMERGENCY</span>{" "}
            <span className="text-tahiti-lightGreen uppercase">Contact</span>
          </h1>
          <QRCode
            className="w-1/4 lg:w-1/2 lg:mx-auto hidden lg:block"
            style={{ height: "auto" }}
            value={`${window.location.host}/qr/newpatientprofile/${newPatient?.data?._id}/`}
          />
          <div className="col-span-2 mb-4 mx-10 lg:mx-0">
            <h3 className="text-2xl font-semibold ">
              {newPatient?.data?.emergency_contact?.name}
            </h3>
            <h3 className="text-xl  ">
              <span className="font-bold">Phone</span>:{" "}
              {newPatient?.data?.emergency_contact?.phone}
            </h3>
            <h3 className="text-xl ">
              <span className="font-bold">Relation</span>:{" "}
              {newPatient?.data?.emergency_contact?.relation}
            </h3>
            {!qr && (
              <div className="flex mt-4">
                <button className="btn btn-sm bg-tahiti-primary border-none rounded-md py-2 p-4 font-medium">
                  <Link to={`/appointment/${newPatient?.data?._id}`}>
                    Add Apppointment
                  </Link>
                </button>
                <button
                  onClick={handlePrint}
                  className="btn btn-sm bg-tahiti-darkGreen rounded-md ml-2"
                >
                  <MdLocalPrintshop className="text-xl" />
                </button>
                {newPatient?.data?.admitted ? (
                  <button
                    onClick={() => handleDisCharge(newPatient?.data?.bed)}
                    className="btn btn-sm bg-tahiti-darkGreen rounded-md ml-2"
                  >
                    Discharge
                  </button>
                ) : (
                  <Link
                    to={`/admit/${newPatient?.data?._id}`}
                    className="btn btn-sm bg-tahiti-darkGreen rounded-md ml-2"
                  >
                    Admit
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
        <PatientPresciption
          qr={qr}
          reports={newPatient?.data?.tests}
          normal
        ></PatientPresciption>
        <div className="lg:hidden mx-auto">
          <div className="bg-tahiti-white rounded-3xl mb-4 relative">
            <button
              onClick={() => setIsPrescription(false)}
              className={`py-2 px-4  ${
                !isPrescription &&
                "transition-colors duration-300 text-tahiti-white"
              }`}
              style={{ zIndex: 10, position: "relative" }}
            >
              Reports
            </button>
            <button
              onClick={() => setIsPrescription(true)}
              className={`py-2 px-4 ${
                isPrescription &&
                "transition-colors duration-300 text-tahiti-white"
              }`}
              style={{ zIndex: 10, position: "relative" }}
            >
              Invoices
            </button>
            <span
              className="absolute bottom-0 left-0 h-10 rounded-3xl -z-50 bg-tahiti-primary"
              style={{
                width: isPrescription ? "60%" : "50%",
                transition: "transform 0.3s",
                transform: isPrescription
                  ? "translateX(75%)"
                  : "translateX(0%)",
                zIndex: 1,
              }}
            />
          </div>
        </div>
        <div className="lg:hidden">
          {isPrescription ? (
            <PatientPresciption qr={qr} reports={newPatient?.data?.invoices} />
          ) : (
            <PatientReports qr={qr} reports={newPatient?.data?.tests} />
          )}
        </div>
      </div>

      {/* print section */}
      <div
        className="bg-tahiti-white hidden print:block w-96 border m-2 mx-auto"
        ref={componentRef}
      >
        <div className="py-2">
          <h1 className="font-bold text-lg text-center">The Labaid Hospital</h1>
          <h3 className="text-center text-sm">
            MollaTowar, Soy Tala Bus stand, <br /> Jamghora, Ashulia, Dhaka
          </h3>
          <h3 className="text-center text-sm">01739-088461</h3>
          <hr className="border-dashed bg-tahiti-black" />
          <h1 className="font-bold text-lg text-center mt-2">
            Patient Information
          </h1>
          <h1 className="text-xl font-medium text-gray-700 capitalize text-center mt-3">
            {" "}
            {newPatient?.data?.name}
          </h1>
          <p className=" text-lg text-center">
            Patient ID: {newPatient?.data?.serialId}
          </p>
          <p className=" text-lg text-center">
            Phone: {newPatient?.data?.phone}
          </p>
          <div className="flex justify-center">
            <QRCode
              className="m-2 border p-2"
              style={{ height: "auto", maxWidth: "50%", width: "40%" }}
              value={`${window.location.host}/qr/newpatientprofile/${newPatient?.data?._id}/`}
            />
          </div>
          <hr className="border-dashed bg-tahiti-black mt-10" />
          <h1 className="font-bold text-xl text-center mt-10">
            Thank You For Choosing Us
          </h1>
        </div>
      </div>
    </div>
  );
};

export default NewPatientProfile;
