import React, { useEffect, useReducer, useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import formatDate from "../../../../utils/formatDate";
import { useCallback } from "react";
import RichTextUpdate from "./RichTextUpdate";

const initialState = {
  test: null,
  loading: false,
  image: null,
  fileUrl: "",
  results: [],
  fileUpToggle: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_TEST":
      return {
        ...state,
        test: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_IMAGE":
      return {
        ...state,
        image: action.payload,
      };
    case "SET_FILE_URL":
      return {
        ...state,
        fileUrl: action.payload,
      };
    case "ADD_RESULT":
      const existingResultIndex = state.results.findIndex(
        (result) => result.testId === action.payload.testId
      );
      if (existingResultIndex !== -1) {
        const updatedResults = [...state.results];
        updatedResults[existingResultIndex] = action.payload;
        return {
          ...state,
          results: updatedResults,
        };
      } else {
        return {
          ...state,
          results: [...state.results, action.payload],
        };
      }
    case "TOGGLE_FILE_UPLOAD": {
      return {
        ...state,
        fileUpToggle: action.payload,
      };
    }
    default:
      return state;
  }
};

const UpdateTest = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const navigate = useNavigate();
  const { testId } = useParams();

  const selectFile = (e) => {
    dispatch({ type: "SET_IMAGE", payload: e.target.files[0] });
    dispatch({
      type: "SET_FILE_URL",
      payload: URL.createObjectURL(e.target.files[0]),
    });
  };

  const handleKeyDown = useCallback(
    (event, testId) => {
      if (event.key === "Tab" || event.key === "Enter") {
        const inputValue = event.target.value;
        const newResult = { testId, value: inputValue };
        dispatch({ type: "ADD_RESULT", payload: newResult });
      }
    },
    [dispatch]
  );

  const handleSubmit = () => {
    const data = {
      type: state?.test?.category?.type,
      results: state.results,
    };

    Swal.showLoading();

    fetch(`https://hms-server-uniceh.vercel.app/api/v1/test/${testId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        Swal.close();
        if (result.status === "success") {
          Swal.fire({
            icon: "success",
            title: result.message,
          }).then(() => {
            navigate(`/testDetails/${testId}`);
          });
        } else {
          Swal.close();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: result.error,
          });
        }
      });
  };

  console.log(state.test);

  const handleFileUpload = () => {
    Swal.fire({
      title: "Uploading File",
      html: "Please wait while we upload the file...",
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });
    const formData = new FormData();
    formData.append("pdf", state.image, state.image?.name);

    fetch(`https://hms-server-uniceh.vercel.app/api/v1/test/upload/${testId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          Swal.fire({
            icon: "success",
            title: result.message,
          }).then(() => {
            navigate(`/testDetails/${testId}`);
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong while uploading the file!",
            footer: result.error,
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong while uploading the file!",
          footer: error.message,
        });
      });
    window.URL.revokeObjectURL(fileUrl);
  };

  useEffect(() => {
    const fetchInvoiceData = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await fetch(
        `https://hms-server-uniceh.vercel.app/api/v1/test/${testId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
          },
        }
      );
      const data = await response.json();
      dispatch({ type: "SET_LOADING", payload: false });
      dispatch({ type: "SET_TEST", payload: data?.data });
    };
    fetchInvoiceData();
  }, []);

  return (
    <div className="mx-20 my-10">
      <div className="grid grid-cols-3 gap-x-4 italic border p-2 mb-6">
        <div>
          <div className="flex justify-between">
            <p>ID no: </p>
            <p>{state?.test?.serialId}</p>
          </div>
          <div className="flex justify-between">
            <p>Patient's Name: </p>
            <p>{state?.test?.patient?.name}</p>
          </div>
          <div className="flex justify-between">
            <p>Referred By: </p>
            <p>{state?.test?.invoiceId?.referredBy || "Self"}</p>
          </div>
        </div>
        <div>
          <div className="flex justify-between">
            <p>Nature of Exam: </p>
            <p className="capitalize">{state?.test?.category?.nature}</p>
          </div>
        </div>
        <div>
          <div className="flex justify-between">
            <p>Recieving Date: </p>
            <p className="capitalize">{formatDate(state?.test?.createdAt)}</p>
          </div>
          <div className="flex justify-between">
            <p>Age: </p>
            <p>{state?.test?.patient?.age}years</p>
          </div>
          <div className="flex justify-between">
            <p>Sex: </p>
            <p>{state?.test?.patient?.gender}</p>
          </div>
        </div>
      </div>
      <h1 className="text-3xl text-center mb-4 border w-fit mx-auto px-2 py-1 italic font-semibold">
        {state.test?.category?.name}
      </h1>
      {state?.test?.category?.type === "description" && !state.fileUpToggle && (
        <>
          <RichTextUpdate id={testId}></RichTextUpdate>
          <button
            onClick={() => {
              dispatch({
                type: "TOGGLE_FILE_UPLOAD",
                payload: true,
              });
            }}
            className="btn btn-sm bg-tahiti-cyan border-0 mt-2"
          >
            Upload File instead
          </button>
        </>
      )}
      {state?.test?.category?.type === "main" && !state.fileUpToggle && (
        <div className="overflow-x-auto">
          <table className="table w-full">
            {/* head */}
            <thead>
              <tr className="text-center">
                <th className="text-sm py-2">Test</th>
                <th className="text-sm py-2">Result</th>
                <th className="text-sm py-2">Normal Value</th>
              </tr>
            </thead>
            <tbody>
              {state?.test?.results?.map((test) => (
                <tr key={test?._id}>
                  <td className="py-2">{test?.test?.name}</td>
                  <td className="text-center py-2">
                    <input
                      type="text"
                      placeholder={test?.result || "Enter result"}
                      className="input input-bordered input-sm border-tahiti-dark px-2 focus:outline-none"
                      onKeyDown={(e) => handleKeyDown(e, test?._id)}
                    />
                  </td>
                  <td className="text-center py-2">
                    {test?.test?.normalValue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center items-center gap-x-4 mt-4">
            <button
              onClick={handleSubmit}
              className="btn btn-sm bg-tahiti-primary border-0 "
            >
              Confirm
            </button>
            <button
              onClick={() => {
                dispatch({
                  type: "TOGGLE_FILE_UPLOAD",
                  payload: true,
                });
              }}
              className="btn btn-sm bg-tahiti-cyan border-0"
            >
              Upload File instead
            </button>
          </div>
        </div>
      )}
      {(state?.test?.category?.type === "file" || state.fileUpToggle) && (
        <>
          {state.fileUrl ? (
            <div>
              <div>
                <p className="text-center mb-2 text-lg">
                  Preview of <b>{state.image?.name} </b>!{" "}
                  <span
                    onClick={() => {
                      URL.revokeObjectURL(state.fileUrl);
                      dispatch({ type: "SET_FILE_URL", payload: "" });
                      dispatch({ type: "SET_IMAGE", payload: null });
                    }}
                    className="hover:underline cursor-pointer"
                  >
                    remove?
                  </span>
                </p>
                <iframe
                  className="mx-auto rounded-lg"
                  src={state.fileUrl}
                  width="100%"
                  height={window.innerHeight}
                />
              </div>
              <button
                onClick={handleFileUpload}
                className="btn btn-sm bg-tahiti-primary border-0 block mx-auto mt-4"
              >
                Confirm
              </button>
            </div>
          ) : (
            <div className="flex gap-x-4 items-center justify-center">
              {state?.test?.category?.type === "main" && (
                <button
                  onClick={() => {
                    dispatch({
                      type: "TOGGLE_FILE_UPLOAD",
                      payload: false,
                    });
                  }}
                  className="btn btn-sm bg-tahiti-cyan border-0"
                >
                  Revert Back
                </button>
              )}
              <p for="password" className="font-medium mr-4">
                Choose File:{" "}
              </p>
              <label htmlFor="file-upload">
                <FaFileUpload className="text-2xl cursor-pointer" />
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={selectFile}
                className="hidden"
                accept="application/pdf"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UpdateTest;
