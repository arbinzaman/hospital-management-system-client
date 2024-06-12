import React, { useEffect } from "react";
import Spinner from "../../../Shared/Spinner";
import useUserData from "../../../Hooks/useUserData";
import AppointmentsRow from "./AppointmentsRow";
import { MdSearch } from "react-icons/md";
import { useReducer } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const initialState = {
  loading: true,
  refetch: true,
  appointments: [],
  key: "",
  value: "",
  count: 0,
  pageNumber: 1,
  size: 10,
  search: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: false };
    case "SET_REFETCH":
      return { ...state, refetch: !state.refetch };
    case "SET_APPOINTMENTS":
      return { ...state, appointments: action.payload };
    case "SET_KEY":
      return { ...state, key: action.payload };
    case "SET_VALUE":
      return { ...state, value: action.payload };
    case "SET_COUNT":
      return { ...state, count: action.payload };
    case "SET_PAGE_NUMBER":
      return { ...state, pageNumber: action.payload };
    case "SET_SIZE":
      return { ...state, size: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    default:
      return state;
  }
};

const AllApointments = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {role} = useUserData();
  const pages = Math.ceil(state.count / state.size);

  const increasePageNumber = () => {
    if (state.pageNumber < state.pages) {
      dispatch({ type: "SET_PAGE_NUMBER", payload: state.pageNumber + 1 });
    }
  };

  const decreasePageNumber = () => {
    if (state.pageNumber > 1) {
      dispatch({ type: "SET_PAGE_NUMBER", payload: state.pageNumber - 1 });
    } else {
      dispatch({ type: "SET_PAGE_NUMBER", payload: 1 });
    }
  };

  // All Appointment fetch data  ?page=1&limit=10
  useEffect(() => {
    dispatch({
      type: "SET_SEARCH",
      payload: state.key && state.value ? true : false,
    });
    fetch(
      `https://hms-server-uniceh.vercel.app/api/v1/appointment/all-appointments?page=${state.pageNumber}&limit=${state.size}&key=${state.key}&value=${state.value}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "SET_APPOINTMENTS", payload: data?.data });
        dispatch({ type: "SET_COUNT", payload: data?.total });
        dispatch({ type: "SET_LOADING"});
      });
  }, [state.pageNumber, state.size, state.refetch]);

  // Loading functionality
  if (state.loading) return <Spinner></Spinner>;
  if (!state.count)
    return (
      <>
        <h2 className="text-tahiti-red text-center mt-60 text-3xl ">
          No Appointment Found
        </h2>
        {state.key || state.value ? (
          <button
            onClick={() => {
              dispatch({ type: "SET_KEY", payload: "" });
              dispatch({ type: "SET_VALUE", payload: "" });
              dispatch({ type: "SET_REFETCH" });
            }}
            className="lg:my-5 font-semibold p-1 rounded-md btn-ghost block mx-auto bg-tahiti-darkGreen text-tahiti-white px-4"
          >
            Go Back to previous page
          </button>
        ) : (
          <Link to={"/patients"}>
            <button className="lg:my-5 font-semibold p-1 rounded-md btn-ghost block mx-auto bg-tahiti-darkGreen text-tahiti-white px-4">
              Add New Appointment for patients
            </button>
          </Link>
        )}
      </>
    );

  return (
    <div className="p-10">
      <div className="flex justify-between mb-3">
        <h1 className="text-3xl font-bold">Appointment : {state.count}</h1>
        {/* <Link to="/addapatient"><button className=' lg:mb-5 lg:mt-5 font-semibold p-1 rounded-sm btn-ghost bg-tahiti-darkGreen text-tahiti-white'>Add New</button></Link> */}
        {/* Search Field */}
        <div className=" flex gap-2">
          <select
            type="text"
            onChange={(e) =>
              dispatch({ type: "SET_KEY", payload: e.target.value })
            }
            className="select select-xs focus:outline-none bg-tahiti-primary font-bold  text-tahiti-white "
          >
            <option disabled selected>
              Select
            </option>
            <option value={"serialId"}>Serial ID </option>
            <option value={"reason"}>Reason</option>
          </select>
          <input
            type="text"
            onChange={(e) =>
              dispatch({ type: "SET_VALUE", payload: e.target.value })
            }
            className="input input-bordered input-info  input-xs  max-w-xs"
          />
          <button
            onClick={() => {
              if (state.key && state.value) dispatch({ type: "SET_REFETCH" });
              else toast.error("Please select from options to search");
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
            Showing results for Appointments with <b>{state.key}</b> of{" "}
            <b>{state.value}</b>{" "}
            <button
              className="btn btn-xs bg-tahiti-grey text-tahiti-red"
              onClick={() => {
                dispatch({ type: "SET_KEY", payload: "" });
                dispatch({ type: "SET_VALUE", payload: "" });
                dispatch({ type: "SET_REFETCH" });
              }}
            >
              X
            </button>{" "}
          </p>
        )}
        <table className="table w-full text-sm">
          <thead>
            <tr>
              <th className="text-center">SL</th>
              <th className="text-center">Appt ID</th>
              <th className="text-center">Date</th>
              <th className="text-center">Patient</th>
              <th className="text-center">Phone</th>
              <th className="text-center">Reason</th>
              <th className="text-center">Payment Status</th>
              <th className="text-center">Details</th>
              {(role?.includes("super-admin") || role?.includes("admin")) && (
                <th className="text-center">Delete</th>
              )}
            </tr>
          </thead>
          <tbody>
            {state.appointments.map((appointment, i) => (
              <AppointmentsRow
                key={appointment?._id}
                role={role}
                refetch={state.refetch}
                setRefetch={() => dispatch({ type: "SET_REFETCH" })}
                index={i}
                appointment={appointment}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Button */}
      <div class="flex flex-col items-center mt-5 mb-5">
        <span class="text-sm">
          Showing Page <span class="font-semibold">{state.pageNumber}</span>
          <span class="font-semibold"></span> of{" "}
          <span class="font-semibold">{pages}</span> Pages
        </span>
        <div class="inline-flex mt-2">
          <button
            onClick={decreasePageNumber}
            class="px-2 py-1 text-xs font-medium bg-tahiti-primary text-tahiti-white rounded-l  dark:hover:bg-tahiti-darkGreen dark:hover:text-tahiti-white"
          >
            Prev
          </button>
          <button
            onClick={increasePageNumber}
            class="px-2 py-1 text-xs font-medium bg-tahiti-primary text-tahiti-white   border-0 border-l  rounded-r dark:hover:bg-tahiti-darkGreen dark:hover:text-tahiti-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllApointments;
