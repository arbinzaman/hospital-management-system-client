import React, { useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import useUserData from "../../../Hooks/useUserData";
import Spinner from "../../../Shared/Spinner";
import { MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import TestRow from "./TestRow";

const initialState = {
  loading: true,
  invoices: [],
  key: "",
  value: "",
  refetch: true,
  count: 0,
  pageNumber: 1,
  size: 10,
  dropdown: false,
  search: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: false,
      };
    case "SET_INVOICES":
      return {
        ...state,
        invoices: action.payload,
      };
    case "SET_COUNT":
      return {
        ...state,
        count: action.payload,
      };
    case "SET_PAGE_NUMBER":
      return {
        ...state,
        pageNumber: action.payload,
      };
    case "SET_SIZE":
      return {
        ...state,
        size: action.payload,
      };
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
    case "SET_REFETCH":
      return {
        ...state,
        refetch: !state.refetch,
      };
    case "SET_DROPDOWN":
      return {
        ...state,
        dropdown: action.payload,
      };
    case "SET_SEARCH":
      return {
        ...state,
        search: action.payload,
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
    default:
      return state;
  }
};

const AllTest = () => {
  const { role, loading } = useUserData();

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

  useEffect(() => {
    dispatch({
      type: "SET_SEARCH",
      payload: state.key && state.value ? true : false,
    });
    fetch(
      `https://hms-server-uniceh.vercel.app/api/v1/test/all?page=${state.pageNumber}&limit=${state.size}&key=${state.key}&value=${state.value}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "SET_LOADING" });
        dispatch({
          type: "SET_COUNT",
          payload: data?.total,
        });
        dispatch({
          type: "SET_INVOICES",
          payload: data?.data,
        });
      });
  }, [state.pageNumber, state.size, state.refetch]);

  // Loading functionality
  if (state.loading || loading) return <Spinner></Spinner>;
  else if (state.invoices?.length === 0)
    return (
      <>
        <h2 className="text-tahiti-red text-center mt-40 text-3xl">
          No Test Found
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
          <div className="flex justify-center gap-4">
            <Link to={"/"}>
              <button className="lg:my-5 font-semibold p-1 rounded-md btn-ghost block mx-auto bg-tahiti-darkGreen text-tahiti-white px-4">
                Back to Dashboard
              </button>
            </Link>
            <Link to={"/categories"}>
              <button className="lg:my-5 font-semibold p-1 rounded-md btn-ghost block mx-auto bg-tahiti-darkGreen text-tahiti-white px-4">
                Test Categories
              </button>
            </Link>
          </div>
        )}
      </>
    );

  return (
    <div className="px-10 bg-tahiti-white">
      <div className="mb-4 mt-10">
        <h1 className="text-3xl font-bold mb-2">Tests : {state.count}</h1>
        <div className="flex items-center justify-between">
          <Link
            to={"/categories"}
            className=" btn btn-xs font-semibold rounded-md btn-ghost bg-tahiti-darkGreen  text-tahiti-white"
          >
            all categories
          </Link>
          <div className="flex gap-2 items-center">
            <select
              type="text"
              name="name"
              id="name"
              className="select select-xs focus:outline-none bg-tahiti-primary w-40 font-bold text-tahiti-white max-w-xs"
              onChange={(e) => {
                dispatch({ type: "SET_KEY", payload: e.target.value });
                if (e.target.value === "available")
                  dispatch({ type: "SET_DROPDOWN", payload: true });
                else dispatch({ type: "SET_DROPDOWN", payload: false });
              }}
            >
              <option disabled selected>
                Select
              </option>
              <option className="cursor-pointer" value={"serialId"}>
                Serial ID{" "}
              </option>
              <option className="cursor-pointer" value={"available"}>
                Status{" "}
              </option>
            </select>

            {state.dropdown ? (
              <select
                type="text"
                className="select select-xs focus:outline-none bg-tahiti-lightBlue w-40 font-bold max-w-xs"
                onChange={(e) => {
                  dispatch({ type: "SET_VALUE", payload: e.target.value });
                }}
              >
                <option disabled selected>
                  Select
                </option>
                <option className="cursor-pointer" value={"true"}>
                  Yes{" "}
                </option>
                <option className="cursor-pointer" value={"false"}>
                  No{" "}
                </option>
              </select>
            ) : (
              <input
                type="text"
                name="value"
                id="value"
                onChange={(e) =>
                  dispatch({ type: "SET_VALUE", payload: e.target.value })
                }
                className="input input-info input-xs w-40 focus:outline-none"
              />
            )}
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
      </div>

      <div className="overflow-x-auto ">
        {state.search && (
          <p className="mb-2">
            Showing results for tests with <b>{state.key}</b> of{" "}
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
        <table className="table w-full bg-tahiti-white text-sm">
          <thead>
            <tr>
              <th>Serial ID</th>
              <th className="text-center">Patient</th>
              <th className="text-center">Test</th>
              <th className="text-center">Date</th>
              <th className="text-center">Status</th>
              {role?.includes("labaratorist") && (
                <th className="text-center">Update</th>
              )}
              <th className="text-center">Details</th>
              {(role?.includes("super-admin") || role?.includes("admin")) && (
                <th className="text-center">Delete</th>
              )}
            </tr>
          </thead>
          <tbody>
            {state.invoices?.map((patient, i) => (
              <TestRow
                key={patient._id}
                invoice={patient}
                i={i}
                role={role}
                setRefetch={() =>
                  dispatch({ type: "SET_REFETCH", payload: !state.refetch })
                }
              ></TestRow>
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
            className="px-4 py-2 text-sm font-medium bg-tahiti-primary text-tahiti-white rounded-l  dark:hover:bg-tahiti-darkGreen dark:hover:text-tahiti-white"
          >
            Prev
          </button>
          <button
            onClick={increasePageNumber}
            className="px-4 py-2 text-sm font-medium bg-tahiti-primary text-tahiti-white   border-0 border-l  rounded-r dark:hover:bg-tahiti-darkGreen dark:hover:text-tahiti-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllTest;
