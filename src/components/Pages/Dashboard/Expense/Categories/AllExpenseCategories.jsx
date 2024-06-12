import React, { useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import { MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import ExpCatRox from "./ExpCatRow";
import useUserData from "../../../../Hooks/useUserData";
import Spinner from "../../../../Shared/Spinner";

const initialState = {
  loading: true,
  invoices: [],
  key: "",
  value: "",
  refetch: true,
  count: 0,
  pageNumber: 1,
  size: 10,
  search: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INCREMENT_PAGE_NUMBER":
      if (state.pageNumber < state.pages) {
        return { ...state, pageNumber: state.pageNumber + 1 };
      }
      return state;
    case "DECREMENT_PAGE_NUMBER":
      if (state.pageNumber > 1) {
        return { ...state, pageNumber: state.pageNumber - 1 };
      }
      return state;
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
    case "SET_SEARCH":
      return {
        ...state,
        search: action.payload,
      };
    default:
      return state;
  }
};

const AllExpenseCategories = () => {
  const { role, loading } = useUserData();
  const [state, dispatch] = useReducer(reducer, initialState);
  const pages = Math.ceil(state?.count / state?.size);

  useEffect(() => {
    dispatch({
      type: "SET_SEARCH",
      payload: state.key && state.value ? true : false,
    });
    fetch(
      `https://hms-server-uniceh.vercel.app/api/v1/expense/category/all?page=${state.pageNumber}&limit=${state.size}&key=${state.key}&value=${state.value}`,
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
  else if (!state.count)
    return (
      <>
        <h2 className="text-tahiti-red text-center mt-60 text-3xl">
          No Expense Category Found
        </h2>
        {(state.key || state.value) && (
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
        )}
      </>
    );

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Expense Categories : {state.count}</h1>

      <div className="flex justify-between items-center">
        <div>
          <Link to="/expense/category/new">
            <button className=" lg:my-5 btn btn-xs lg:mr-5 font-semibold px-2 py-1 rounded-md btn-ghost bg-tahiti-darkGreen text-tahiti-white">
              Add New
            </button>
          </Link>
          <Link
            to={"/expense/all"}
            className="my-5 btn btn-xs font-semibold rounded-md btn-ghost bg-tahiti-darkGreen  text-tahiti-white"
          >
            All Expenses
          </Link>
        </div>
        <div className="flex gap-2">
          <select
            type="text"
            name="name"
            id="name"
            className="select select-xs focus:outline-none bg-tahiti-primary w-48 font-bold text-tahiti-white max-w-xs"
            onChange={(event) => {
              dispatch({ type: "SET_KEY", payload: event.target.value });
            }}
          >
            <option disabled selected>
              Select
            </option>
            <option className="cursor-pointer" value={"name"}>
              Name{" "}
            </option>
          </select>
          <input
            type="text"
            name="value"
            id="value"
            onChange={(e) =>
              dispatch({ type: "SET_VALUE", payload: e.target.value })
            }
            className="input input-info input-xs w-48 focus:outline-none"
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
            Showing results for expense categories with <b>{state.key}</b> of{" "}
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
        <table className="table w-full bg-tahiti-white">
          <thead>
            <tr>
              <th>Sl</th>
              <th className="text-center">Name</th>
              <th className="text-center">Details</th>
              {(role?.includes("super-admin") || role?.includes("admin")) && (
                <>
                  <th className="text-center">Update</th>
                  <th className="text-center">Delete</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {state.invoices?.map((invoice, i) => (
              <ExpCatRox
                key={invoice._id}
                i={i}
                expense={invoice}
                role={role}
                setRefetch={() => dispatch({ type: "SET_REFETCH" })}
              ></ExpCatRox>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Button */}
      <div className="flex flex-col items-center mt-5 mb-5">
        <span className="text-sm">
          Showing Page <span className="font-semibold">{state.pageNumber}</span>
          <span className="font-semibold"></span> of{" "}
          <span className="font-semibold">{pages}</span> Pages
        </span>
        <div className="inline-flex mt-2 xs:mt-0">
          <button
            onClick={() => dispatch({ type: "DECREMENT_PAGE_NUMBER" })}
            className="px-2 py-1 text-xs font-medium bg-tahiti-primary text-tahiti-white rounded-l  dark:hover:bg-tahiti-darkGreen dark:hover:text-tahiti-white"
          >
            Prev
          </button>
          <button
            onClick={() => dispatch({ type: "INCREMENT_PAGE_NUMBER" })}
            className="px-2 py-1 text-xs font-medium bg-tahiti-primary text-tahiti-white   border-0 border-l  rounded-r dark:hover:bg-tahiti-darkGreen dark:hover:text-tahiti-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllExpenseCategories;
