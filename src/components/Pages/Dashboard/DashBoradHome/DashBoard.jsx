import React, { useEffect, useReducer } from "react";
import NewPatientTable from "../NewPatientTable/NewPatientTable";
import { FaAccessibleIcon, FaBed, FaUserMd } from "react-icons/fa";
import DashboardCard from "./DashboardCard";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Spinner from "../../../Shared/Spinner";

const initialStates = {
  patients: 0,
  doctors: 0,
  beds: 0,
  newPatientCount: 0,
  newPatients: [],
  availableBeds: 0,
  availableDoctors: 0,
  loading: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PATIENTS":
      return { ...state, patients: action.payload };
    case "SET_DOCTORS":
      return { ...state, doctors: action.payload };
    case "SET_BEDS":
      return { ...state, beds: action.payload };
    case "SET_NEW_PATIENT_COUNT":
      return { ...state, newPatientCount: action.payload };
    case "SET_NEW_PATIENTS":
      return { ...state, newPatients: action.payload };
    case "SET_AVAILABLE_BEDS":
      return { ...state, availableBeds: action.payload };
    case "SET_AVAILABLE_DOCTORS":
      return { ...state, availableDoctors: action.payload };
    case "SET_LOADING":
      return { ...state, loading: false };
    default:
      return state;
  }
};

const DashBoard = () => {
  const [state, dispatch] = useReducer(reducer, initialStates);

  const navigate = useNavigate();

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("LoginToken")}`
    );

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("https://hms-server-uniceh.vercel.app/api/v1/dashboard", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        dispatch({
          type: "SET_PATIENTS",
          payload: result?.data?.totalPatientsCount,
        });
        dispatch({
          type: "SET_DOCTORS",
          payload: result?.data?.totalDoctorsCount,
        });
        dispatch({
          type: "SET_NEW_PATIENT_COUNT",
          payload: result?.data?.newPatientsCount,
        });
        dispatch({
          type: "SET_NEW_PATIENTS",
          payload: result?.data?.newPatients,
        });
        dispatch({
          type: "SET_AVAILABLE_BEDS",
          payload: result?.data?.availableBeds,
        });
        dispatch({
          type: "SET_BEDS",
          payload: result?.data?.totalBeds,
        });
        dispatch({ type: "SET_LOADING" });
      })
      .catch((error) => {
        dispatch({ type: "SET_LOADING" });
        toast.error(error.message);
        navigate("/user/login");
      });
  }, []);

  const cards = [
    {
      title: "Patients",
      icon: <FaAccessibleIcon className="text-6xl text-tahiti-grey" />,
      count: state.patients,
    },
    {
      title: "Doctors",
      icon: <FaUserMd className="text-6xl text-tahiti-grey" />,
      count: state.doctors,
    },
    {
      title: "Beds",
      icon: <FaBed className="text-6xl text-tahiti-grey" />,
      count: state.beds,
    },
    {
      title: "New Patient",
      icon: <FaAccessibleIcon className="text-6xl text-tahiti-grey" />,
      count: state.newPatientCount,
    },
    {
      title: "Available Doctors",
      icon: <FaUserMd className="text-6xl text-tahiti-grey" />,
      count: state.availableDoctors,
    },
    {
      title: "Available Beds",
      icon: <FaBed className="text-6xl text-tahiti-grey" />,
      count: state.availableBeds,
    },
  ];

  const tileClassName = ({ date, view }) => {
    if (
      view === "month" &&
      date.getDate() === new Date().getDate() &&
      new Date().getMonth() === date.getMonth()
    ) {
      return "today";
    }
  };

  if (state.loading) return <Spinner></Spinner>;

  return (
    <div className="p-10">
      <div className="grid gap-y-10 gap-x-20 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
        {cards.map((card, i) => (
          <DashboardCard key={i} data={card}></DashboardCard>
        ))}
      </div>
      <div className="mt-10 grid grid-cols-3 gap-x-20">
        <Calendar
          className="rounded-lg w-full border-none"
          tileClassName={tileClassName}
        />
        <NewPatientTable newPatients={state.newPatients}></NewPatientTable>
      </div>
    </div>
  );
};

export default DashBoard;
