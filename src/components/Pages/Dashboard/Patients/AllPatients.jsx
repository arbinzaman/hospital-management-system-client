import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useUserData from "../../../Hooks/useUserData";
import Spinner from "../../../Shared/Spinner";
import PatientsRow from "./PatientsRow";
import { MdSearch } from "react-icons/md";
import { useReducer } from "react";
import { toast } from "react-toastify";

const initialState = {
  name: "",
  value: "",
  loading: true,
  patients: [],
  refetch: true,
  count: 0,
  pageNumber: 1,
  size: 10,
  search: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_NAME":
      return {
        ...state,
        name: action.payload,
      };
    case "SET_VALUE":
      return {
        ...state,
        value: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_PATIENTS":
      return {
        ...state,
        patients: action.payload,
      };
    case "SET_REFETCH":
      return {
        ...state,
        refetch: !state.refetch,
      };
    case "SET_COUNT":
      return {
        ...state,
        count: action.payload,
      };
    case "SET_PAGENUMBER":
      return {
        ...state,
        pageNumber: action.payload,
      };
    case "SET_SIZE":
      return {
        ...state,
        size: action.payload,
      };
    case "SET_SEARCH":
      return {
        ...state,
        search: action.payload,
      };
    default:
      return state;
  }
};

const AllPatients = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { role } = useUserData();

  // pagination

  const pages = Math.ceil(state.count / state.size);

  const increasePageNumber = () => {
    if (state.pageNumber < pages) {
      dispatch({ type: "SET_PAGENUMBER", payload: state.pageNumber + 1 });
    }
  };

  const decreasePageNumber = () => {
    if (state.pageNumber > 1) {
      dispatch({ type: "SET_PAGENUMBER", payload: state.pageNumber - 1 });
    } else {
      dispatch({ type: "SET_PAGENUMBER", payload: 1 });
    }
  };

  // All Patient fetch data  ?page=1&limit=10
  useEffect(() => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({
      type: "SET_SEARCH",
      payload: state.name && state.value ? true : false,
    });
    fetch(
      `https://hms-server-uniceh.vercel.app/api/v1/patient/all-patient?page=${state.pageNumber}&limit=${state.size}&key=${state.name}&value=${state.value}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "SET_LOADING", payload: false });
        dispatch({ type: "SET_COUNT", payload: data?.total });
        dispatch({ type: "SET_PATIENTS", payload: data?.data });
      });
  }, [state.pageNumber, state.size, state.refetch]);

  // Loading functionality
  if (state.loading) return <Spinner></Spinner>;
  else if (!state.count)
    return (
      <>
        <h2 className="text-tahiti-red text-center mt-60 text-3xl ">
          No Patient Found
        </h2>
        {state.name || state.value ? (
          <button
            onClick={() => {
              dispatch({ type: "SET_NAME", payload: "" });
              dispatch({ type: "SET_VALUE", payload: "" });
              dispatch({ type: "SET_REFETCH" });
            }}
            className="lg:my-5 font-semibold p-1 rounded-md btn-ghost block mx-auto bg-tahiti-darkGreen text-tahiti-white px-4"
          >
            Go Back
          </button>
        ) : (
          <div className="flex justify-center items-center gap-4">
            {(role?.includes("receptionist") ||
              role === "super-admin" ||
              role === "admin") && (
              <Link to="/addapatient">
                <button className="btn btn-sm rounded-md bg-tahiti-darkGreen text-tahiti-white">
                  Add New
                </button>
              </Link>
            )}
            <Link to={"/"}>
              <button className="lg:my-5 font-semibold p-1 rounded-md btn-ghost block mx-auto bg-tahiti-darkGreen text-tahiti-white px-4">
                Back to Dashboard
              </button>
            </Link>
          </div>
        )}
      </>
    );

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Patients : {state.count}</h1>
      <div
        className={`flex ${
          role?.includes("receptionist") ||
          role === "super-admin" ||
          role === "admin"
            ? "justify-between"
            : "justify-end"
        }`}
      >
        <div className="flex mb-4 gap-2">
          <select
            type="text"
            name="name"
            id="name"
            onChange={(e) =>
              dispatch({ type: "SET_NAME", payload: e.target.value })
            }
            className="select select-xs focus:outline-none bg-tahiti-primary font-bold  text-tahiti-white "
          >
            <option disabled selected>
              Select
            </option>
            <option value={"serialId"}>Serial ID </option>
            <option value={"name"}>Name</option>
            <option value={"phone"}>Phone</option>
            <option value={"gender"}>Gender</option>
            <option value={"bloodGroup"}>Blood Group</option>
            <option value={"age"}>Age</option>
          </select>
          <input
            type="text"
            name="value"
            id="value"
            onChange={(e) =>
              dispatch({ type: "SET_VALUE", payload: e.target.value })
            }
            className="input input-bordered focus:outline-none input-info  input-xs  max-w-xs"
          />
          <button
            onClick={() => {
              if (state.name && state.value) dispatch({ type: "SET_REFETCH" });
              else return toast.error("Please select from options to search");
            }}
            className="btn btn-xs"
          >
            <MdSearch className="cursor-pointer mx-auto" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {state.search && (
          <p className="mb-2">
            Showing results for patients with <b>{state.name}</b> of{" "}
            <b>{state.value}</b>{" "}
            <button
              className="btn btn-xs bg-tahiti-grey text-tahiti-red"
              onClick={() => {
                dispatch({ type: "SET_NAME", payload: "" });
                dispatch({ type: "SET_VALUE", payload: "" });
                dispatch({ type: "SET_REFETCH" });
              }}
            >
              X
            </button>{" "}
          </p>
        )}
        <table className="table w-full bg-tahiti-white text-sm">
          <thead>
            <tr>
              <th className="text-center">Sl</th>
              <th className="text-center">Patient ID</th>
              <th className="text-center">Name</th>
              <th className="text-center">Date</th>
              <th className="text-center">Age</th>
              <th className="text-center">Blood Group</th>
              <th className="text-center">Gender</th>
              <th className="text-center">Phone</th>
              {(role?.includes("receptionist") || role?.includes("admin")) && (
                <th className="text-center">Payment</th>
              )}
              <th className="text-center">Details</th>
              {role?.includes("admin") && (
                <th className="text-center">Delete</th>
              )}
            </tr>
          </thead>
          <tbody>
            {state.patients.map((patient, i) => (
              <PatientsRow
                key={patient._id}
                patient={patient}
                i={i}
                role={role}
                refetch={state.refetch}
                pageNumber={state.pageNumber}
                setRefetch={() => dispatch({ type: "SET_REFETCH" })}
              ></PatientsRow>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Button */}
      <div className="flex flex-col items-center mt-5 mb-5 text-xl">
        <span className="text-sm text-gray-700 dark:text-gray-400">
          Showing Page{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {state.pageNumber}
          </span>
          <span className="font-semibold text-gray-900 dark:text-white"></span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {pages}
          </span>{" "}
          Pages
        </span>
        <div className="inline-flex mt-2 xs:mt-0">
          <button
            onClick={decreasePageNumber}
            className="px-2 py-1 text-xs font-medium bg-tahiti-primary text-tahiti-white rounded-l  dark:hover:bg-tahiti-darkGreen dark:hover:text-tahiti-white"
          >
            Prev
          </button>
          <button
            onClick={increasePageNumber}
            className="px-2 py-1 text-xs font-medium bg-tahiti-primary text-tahiti-white   border-0 border-l  rounded-r dark:hover:bg-tahiti-darkGreen dark:hover:text-tahiti-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllPatients;
