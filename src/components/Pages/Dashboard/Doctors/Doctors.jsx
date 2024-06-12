import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Spinner from "../../../Shared/Spinner";
import { MdSearch } from "react-icons/md";
import { useReducer } from "react";

const initialState = {
  key: "",
  value: "",
  loading: true,
  doctors: [],
  refetch: true,
  count: 0,
  pageNumber: 1,
  size: 10,
  search: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_KEY":
      return {
        ...state,
        key: action.payload,
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
    case "SET_DOCTORS":
      return {
        ...state,
        doctors: action.payload,
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

const Doctors = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
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

  // ALL Doctors Fetch Api
  useEffect(() => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({
      type: "SET_SEARCH",
      payload: state.key && state.value ? true : false,
    });
    fetch(
      `https://hms-server-uniceh.vercel.app/api/v1/user/all-doctors?page=${state.pageNumber}&limit=${state.size}&key=${state.key}&value=${state.value}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "SET_LOADING", payload: false });
        dispatch({ type: "SET_DOCTORS", payload: data?.data });
        dispatch({ type: "SET_COUNT", payload: data?.total });
      });
  }, [state.pageNumber, state.size, state.refetch]);

  if (state.loading) return <Spinner></Spinner>;

  if (!state.count)
    return (
      <>
        <h2 className="text-tahiti-red text-center mt-60 text-5xl ">
          No Doctor Found
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
            Go Back
          </button>
        ) : (
          <Link to={"/"}>
            <button className="lg:my-5 font-semibold p-1 rounded-md btn-ghost block mx-auto bg-tahiti-darkGreen text-tahiti-white px-4">
              Back to Dashboard
            </button>
          </Link>
        )}
      </>
    );

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold ">Doctor : {state.count}</h1>
      <div className="flex justify-between my-2">
        <Link to="/signup">
          <button className=" lg:mb-5 lg:mt-5 text-xs font-semibold p-1 rounded-md btn-ghost bg-tahiti-darkGreen text-tahiti-white">
            Add New
          </button>
        </Link>
        <div className=" flex gap-2 lg:mt-5 ">
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
            <option value={"firstName"}>First Name</option>
            <option value={"lastName"}>Last Name</option>
            <option value={"email"}>Email</option>
            <option value={"phone"}>Phone</option>
            <option value={"serialId"}>Serial Id</option>
            <option value={"status"}>Status</option>
          </select>
          <input
            type="text"
            onChange={(e) =>
              dispatch({ type: "SET_VALUE", payload: e.target.value })
            }
            className="input input-bordered input-info focus:outline-none input-xs  max-w-xs"
          />
          <button
            onClick={() => {
              if (state.key && state.value) dispatch({ type: "SET_REFETCH" });
              else toast.error("Please select from options to search");
            }}
            type="submit"
            className="btn btn-xs"
          >
            <MdSearch className="cursor-pointer mx-auto" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto text-sm">
        {state.search && (
          <p className="mb-2">
            Showing results for doctors with <b>{state.key}</b> of{" "}
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
        <table className="table w-full">
          <thead>
            <tr>
              <th className="text-center">Sl</th>
              <th className="text-center">Id</th>
              <th className="text-center">First Name</th>
              <th className="text-center">Last Name</th>
              <th className="text-center">Email</th>
              <th className="text-center">Phone</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {state.doctors.map((doctor, i) => (
              <tr key={doctor._id}>
                <th className="text-center">{i + 1}</th>
                <td className="text-center">{doctor?.serialId}</td>
                <td className="text-center">{doctor?.firstName}</td>
                <td className="text-center">{doctor?.lastName}</td>
                <td className="text-center">{doctor?.email}</td>
                <td className="text-center">{doctor?.phone}</td>
                <td className="text-center capitalize">{doctor?.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Button */}

      <div className="flex flex-col items-center mt-5 mb-5">
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

export default Doctors;
