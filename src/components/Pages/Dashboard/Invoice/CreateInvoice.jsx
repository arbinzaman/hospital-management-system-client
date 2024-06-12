import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { BiCheck } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { useReducer } from "react";
import Spinner from "../../../Shared/Spinner";
import { initialState, reducer } from "./reducer";
import { toast } from "react-toastify";

const CreateInvoice = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { patientId } = useParams();
  const navigate = useNavigate();

  const baseUrl = "https://hms-server-uniceh.vercel.app/api/v1";

  const fetchData = async (path, successActionType) => {
    const response = await fetch(`${baseUrl}${path}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
      },
    });
    const data = await response.json();
    return { successActionType, data: data?.data };
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      dispatch({ type: "SET_LOADING", payload: true });

      try {
        const promises = [
          fetchData("/category/all", "SET_MAIN_CATEGORIES"),
          fetchData(`/patient/${patientId}`, "SET_PATIENT"),
          fetchData("/user/all-doctors?limit=1000", "SET_DOCTORS"),
          fetchData("/pc/all?limit=1000", "SET_PCS"),
        ];

        const results = await Promise.all(promises);
        results.forEach(({ successActionType, data }) => {
          dispatch({ type: successActionType, payload: data });
        });
      } catch (error) {
        // Handle error
      }

      dispatch({ type: "SET_LOADING", payload: false });
    };

    fetchDataAsync();
  }, [patientId]);

  const handleSubmit = () => {
    dispatch({ type: "SET_CREATING", payload: true });

    const data = {
      patient: patientId,
      tests: state.tests,
      bedding: {
        bed: state.patient?.bed?._id,
        charge: state.beddingCharge,
        days: state.admittedDays,
      },
      medicineCharge: state.medicineCharge,
      serviceCharge: state.serviceCharge,
      otherCharges: state.customFields.map((field) => ({
        name: field.name,
        amount: field.amount,
      })),
      sub_total: state.total,
      discount: state.discount,
      VAT: {
        vatPercentage: state.vatPercentage,
        vatAmount: state.vatAmount,
      },
      paidAmount: state.paidAmount,
      dueAmount: state.due,
      referredBy: state.refferedBy || null,
      appointedTo: state.selectedDoctor || null,
      total_PC_Commission: state.total_PC_commision,
      grand_total: state.grandTotal,
    };

    fetch(`https://hms-server-uniceh.vercel.app/api/v1/invoice/create/${patientId}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch({ type: "CREATING_INVOICE", payload: false })
        if (result.status === "success") {
          toast.success(result.message);
          navigate("/allinvoice");
        } else {
          toast.error(result.error);
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const fetchSubCategories = async (id) => {
    dispatch({ type: "SET_SUB_CATEGORIES", payload: [] });
    dispatch({ type: "SET_SUB_CAT_LOADING", payload: true });
    if (id === "Select")
      return dispatch({ type: "SET_SUB_CAT_LOADING", payload: false });
    const response = await fetch(
      `https://hms-server-uniceh.vercel.app/api/v1/category/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
        },
      }
    );
    const data = await response.json();

    const filteredSubCategories = data?.data?.subCategories.filter(
      (category) => {
        return !state.tests.some((test) => test._id === category._id);
      }
    );

    dispatch({
      type: "SET_SUB_CATEGORIES",
      payload: filteredSubCategories,
    });
    dispatch({ type: "SET_SUB_CAT_LOADING", payload: false });
  };

  if (state.loading) return <Spinner></Spinner>;

  return (
    <div className="bg-tahiti-white m-10 shadow-lg rounded-md">
      <h1 className=" text-tahiti-lightGreen font-bold text-center text-3xl py-4">
        Create Invoice
      </h1>
      <div className="grid grid-cols-2 gap-x-4 px-12">
        <div className="grid grid-cols-2 gap-x-4">
          <p>Patient: </p>
          <p>{state.patient?.name}</p>
          <p>Phone:</p>
          <p>{state.patient?.phone}</p>
          <p>Id:</p>
          <p>{state.patient?.serialId}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid grid-cols-12">
            <select
              className="rounded-l-lg border col-span-10 bg-tahiti-primary text-tahiti-white rounded-r-none select select-sm focus:outline-none"
              onChange={(event) => {
                const options = event.target.options;
                for (let i = 0; i < options.length; i++) {
                  if (options[i].selected) {
                    dispatch({
                      type: "SET_REFFERED_BY",
                      payload: options[i].value,
                    });
                  }
                }
              }}
            >
              <option disabled selected>
                Referred By
              </option>
              {state.pcs.map((pc) => (
                <option value={pc._id} key={pc._id}>
                  {pc?.name}
                </option>
              ))}
            </select>
            <button className="btn btn-sm col-span-2 bg-tahiti-lightGreen border-r-0 border-t-0 border-b-0 rounded-l-none">
              <FaPlus></FaPlus>
            </button>
          </div>
          <div className="grid grid-cols-12">
            <select
              onChange={(event) => {
                const options = event.target.options;
                for (let i = 0; i < options.length; i++) {
                  if (options[i].selected) {
                    dispatch({
                      type: "SET_SELECTED_DOCTOR",
                      payload: options[i].value,
                    });
                  }
                }
              }}
              className="rounded-l-lg border col-span-10 bg-tahiti-primary text-tahiti-white rounded-r-none select select-sm focus:outline-none"
            >
              <option disabled selected>
                Appointed to
              </option>
              {state.doctors.map((doctor) => (
                <option value={doctor._id} key={doctor._id}>
                  {doctor.firstName + " " + doctor.lastName}
                </option>
              ))}
            </select>
            <button className="btn btn-sm col-span-2 bg-tahiti-lightGreen border-r-0 border-t-0 border-b-0 rounded-l-none">
              <FaPlus></FaPlus>
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div className="col-span-2 lg:col-span-1">
          <fieldset className="px-12 py-10">
            <div className="mb-4">
              <p className="text-lg font-medium">Test</p>
              <div className="grid grid-cols-2 gap-4 w-full">
                <select
                  onChange={(event) => {
                    const options = event.target.options;
                    for (let i = 0; i < options.length; i++) {
                      if (options[i].selected) {
                        fetchSubCategories(options[i].value);
                      }
                    }
                  }}
                  type="text"
                  className="select w-full bg-tahiti-primary focus:outline-none font-bold text-tahiti-white select-sm"
                >
                  <option selected disabled>
                    Category
                  </option>
                  {state.mainCategories.map((category) => (
                    <option value={category?._id} key={category._id}>
                      {category?.name}
                    </option>
                  ))}
                </select>
                {state.subCatLoading ? (
                  <button className="bg-tahiti-green focus:outline-none font-bold w-full btn btn-sm border-none">
                    <img
                      className="w-5 animate-spin"
                      src="/assets/loading.png"
                      alt="Loading"
                    />
                  </button>
                ) : (
                  <select
                    onChange={(event) => {
                      const selectedOptions = Array.from(
                        event.target.options
                      ).filter((option) => option.selected);

                      const selectedValues = selectedOptions.map(
                        (option) => option.value
                      );

                      dispatch({
                        type: "ADD_TEST",
                        payload: selectedValues[0],
                      });
                      event.target.value = "Sub Category";
                    }}
                    type="text"
                    className={` ${
                      state.subCategories.length > 0
                        ? "bg-tahiti-primary"
                        : "bg-tahiti-green select-disabled "
                    } focus:outline-none font-bold w-full text-tahiti-white select select-sm`}
                  >
                    <option selected disabled>
                      Sub Category
                    </option>
                    {state.subCategories.map((category) => (
                      <option value={category?._id} key={category._id}>
                        {category?.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <div className="mb-4">
              <p className="text-lg font-medium">Bedding</p>
              <div className="grid grid-cols-2 gap-4">
                <input
                  id="bedding"
                  disabled
                  type="text"
                  className="input w-full input-sm focus:outline-none disabled:placeholder:text-tahiti-dark"
                  placeholder={
                    state.patient?.bed?.name &&
                    state?.patient?.bed?.name +
                      " (" +
                      state?.patient?.bed?.category?.charge +
                      "৳/day)"
                  }
                />
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    dispatch({
                      type: "SET_ADMITTED_DAYS",
                      payload: event.target.admittedDays.value,
                    });
                    dispatch({
                      type: "SET_BEDDING_CHARGE",
                      payload:
                        state.patient?.bed?.category.charge *
                        event.target.admittedDays.value,
                    });
                  }}
                  className="flex w-full"
                >
                  <input
                    type="number"
                    name="admittedDays"
                    disabled={!state.patient?.bed?.name || state.admittedDays}
                    placeholder="Days"
                    className="rounded-l-lg w-full border focus:outline-none border-r-0 pl-2 disabled:cursor-not-allowed disabled:bg-tahiti-babyPink disabled:text-tahiti-dark "
                  />
                  <button
                    type="submit"
                    className="btn btn-sm bg-tahiti-primary border-l-0 rounded-l-none"
                  >
                    <BiCheck className="text-xl" />
                  </button>
                </form>
              </div>
            </div>
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4">
                <p className="text-lg font-medium">Medicine Charge:</p>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    dispatch({
                      type: "SET_MEDICINE_CHARGE",
                      payload: event.target.medicine.value,
                    });
                  }}
                  className="flex w-full"
                >
                  <input
                    name="medicine"
                    type="number"
                    className="rounded-l-lg w-full pl-2 border focus:outline-none border-r-0"
                  />
                  <button
                    type="submit"
                    className="btn btn-sm bg-tahiti-primary border-l-0 rounded-l-none"
                  >
                    <BiCheck className="text-xl"></BiCheck>
                  </button>
                </form>
              </div>
            </div>
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4">
                <p className="text-lg font-medium">Service Charge:</p>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    dispatch({
                      type: "SET_SERVICE_CHARGE",
                      payload: event.target.service.value,
                    });
                  }}
                  className="flex w-full"
                >
                  <input
                    name="service"
                    type="number"
                    className="rounded-l-lg w-full pl-2 border focus:outline-none border-r-0"
                  />
                  <button
                    type="submit"
                    className="btn btn-sm bg-tahiti-primary border-l-0 rounded-l-none"
                  >
                    <BiCheck className="text-xl"></BiCheck>
                  </button>
                </form>
              </div>
            </div>
            {state.customFields.map((field) => (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const updatedField = {
                    id: field.id,
                    name: event.target.chargeType.value,
                    amount: Number(event.target.charge.value),
                  };
                  dispatch({
                    type: "UPDATE_CUSTOM_FIELD",
                    payload: { id: field.id, updatedField },
                  });
                }}
                className="mb-2"
                key={field.id}
              >
                <label className="mb-1 block font-medium" htmlFor="Sub-Total">
                  Charge Type {field.id}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      name="chargeType"
                      type="text"
                      className="input w-full input-sm input-bordered border-tahiti-dark focus:outline-none"
                    />
                  </div>
                  <div className="flex w-full">
                    <input
                      name="charge"
                      type="number"
                      className="rounded-l-lg w-full pl-2 border focus:outline-none border-r-0"
                    />
                    <button
                      type="submit"
                      className="btn btn-sm bg-tahiti-primary border-l-0 rounded-l-none"
                    >
                      <BiCheck className="text-xl"></BiCheck>
                    </button>
                  </div>
                </div>
              </form>
            ))}
            <div className="mb-4">
              <p
                onClick={() => {
                  dispatch({ type: "ADD_CUSTOM_FIELD" });
                }}
                className="font-bold btn btn-sm bg-tahiti-primary border-0"
              >
                Add Custom Field{" "}
                <span className="text-tahiti-darkGreen ml-1">+</span>
              </p>
            </div>
          </fieldset>
        </div>
        <div className="col-span-2 lg:col-span-1 pr-12 pb-10">
          <div className="overflow-x-auto mx-auto border border-tahiti-primary rounded-md mt-16">
            <table className="table w-full bg-tahiti-white">
              <thead>
                <tr>
                  <th className="p-2 text-xs">Name</th>
                  <th className="text-center p-2 text-xs">PC Rate</th>
                  <th className="text-center p-2 text-xs">PC Commission</th>
                  <th className="text-center p-2 text-xs">Amount</th>
                  <th className="text-center p-2 text-xs">Remove</th>
                </tr>
              </thead>
              <tbody>
                {state.tests?.length > 0 ||
                state.beddingCharge > 0 ||
                state.medicineCharge > 0 ||
                state.serviceCharge > 0 ||
                state.customFields[0]?.name ? (
                  state.tests.map((category) => (
                    <tr key={category._id}>
                      <td className=" p-2 text-xs">{category?.name}</td>
                      <td className="text-center p-2 text-xs">
                        {category?.pcRate}%
                      </td>
                      <td className="text-center p-2 text-xs">
                        {Math.ceil(category?.charge * (category?.pcRate / 100))}
                        ৳
                      </td>
                      <td className="text-center p-2 text-xs">
                        {category?.charge}৳
                      </td>
                      <td className="p-2 text-xs">
                        <FaTrash
                          onClick={() =>
                            dispatch({
                              type: "REMOVE_TEST",
                              payload: category._id,
                            })
                          }
                          className="text-tahiti-red cursor-pointer mx-auto"
                        ></FaTrash>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td></td>
                    <td></td>
                    <td className="text-center p-2 text-xs">Add payments...</td>
                    <td></td>
                    <td></td>
                  </tr>
                )}
                {state.beddingCharge > 0 && (
                  <tr>
                    <td className="p-2 text-xs ">
                      {state.patient?.bed?.name} ({state.admittedDays} days){" "}
                    </td>
                    <td className="p-2 text-xs text-center">-</td>
                    <td className="p-2 text-xs text-center">-</td>
                    <td className="p-2 text-xs text-center">
                      {state.beddingCharge} ৳
                    </td>
                    <td className="p-2 text-xs">
                      <FaTrash
                        onClick={() => {
                          dispatch({
                            type: "REMOVE_BEDDING_CHARGE",
                            payload: state.beddingCharge,
                          });
                          dispatch({
                            type: "SET_ADMITTED_DAYS",
                            payload: 0,
                          });
                        }}
                        className="text-tahiti-red cursor-pointer mx-auto"
                      ></FaTrash>
                    </td>
                  </tr>
                )}
                {state.medicineCharge > 0 && (
                  <tr>
                    <td className="p-2 text-xs ">Medicine</td>
                    <td className="p-2 text-xs text-center">-</td>
                    <td className="p-2 text-xs text-center">-</td>
                    <td className="p-2 text-xs text-center">
                      {state.medicineCharge} ৳
                    </td>
                    <td className="p-2 text-xs">
                      <FaTrash
                        onClick={() =>
                          dispatch({
                            type: "REMOVE_MEDICINE_CHARGE",
                            payload: state.medicineCharge,
                          })
                        }
                        className="text-tahiti-red cursor-pointer mx-auto"
                      ></FaTrash>
                    </td>
                  </tr>
                )}
                {state.serviceCharge > 0 && (
                  <tr>
                    <td className="p-2 text-xs ">Service</td>
                    <td className="p-2 text-xs text-center">-</td>
                    <td className="p-2 text-xs text-center">-</td>
                    <td className="p-2 text-xs text-center">
                      {state.serviceCharge}৳
                    </td>
                    <td className="p-2 text-xs">
                      <FaTrash
                        onClick={() =>
                          dispatch({
                            type: "REMOVE_SERVICE_CHARGE",
                            payload: state.serviceCharge,
                          })
                        }
                        className="text-tahiti-red cursor-pointer mx-auto"
                      ></FaTrash>
                    </td>
                  </tr>
                )}
                {state.customFields[0]?.name &&
                  state.customFields.map(
                    (field) =>
                      field?.name &&
                      field?.amount && (
                        <tr key={field.id}>
                          <td className="p-2 text-xs">{field?.name}</td>
                          <td className="text-center p-2 text-xs">-</td>
                          <td className="text-center p-2 text-xs">-</td>
                          <td className="text-center p-2 text-xs">
                            {field.amount}৳
                          </td>
                          <td className="p-2 text-xs">
                            <FaTrash
                              onClick={() =>
                                dispatch({
                                  type: "REMOVE_CUSTOM_FIELD",
                                  payload: field.id,
                                })
                              }
                              className="text-tahiti-red cursor-pointer mx-auto"
                            ></FaTrash>
                          </td>
                        </tr>
                      )
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="px-10 pb-10 grid grid-cols-4 gap-x-10 gap-y-2">
        <div>
          <label className="block" htmlFor="Sub-Total">
            VAT (%)
          </label>
          <div className="grid grid-cols-2">
            <div className="border-r">
              <input
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    dispatch({
                      type: "SET_VAT_PERCENTAGE",
                      payload: event.target.value,
                    });
                  }
                }}
                disabled={!state.total}
                id="tax"
                type="text"
                className="input w-full rounded-r-none  border-r-2 bg-tahiti-babyPink input-sm focus:outline-none disabled:placeholder:text-tahiti-dark"
              />
            </div>
            <input
              id="tax_amount"
              type="text"
              disabled
              placeholder={state.vatAmount}
              className="input w-full rounded-l-none bg-tahiti-babyPink input-sm focus:outline-none disabled:placeholder:text-tahiti-dark"
            />
          </div>
        </div>
        <div>
          <label className="block" htmlFor="Sub-Total">
            Discount
          </label>
          <input
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                dispatch({
                  type: "SET_DISCOUNT",
                  payload: event.target.value,
                });
              }
            }}
            disabled={!state.total}
            type="text"
            className="input w-full bg-tahiti-babyPink input-sm focus:outline-none disabled:placeholder:text-tahiti-dark"
          />
        </div>
        <div>
          <label className="block" htmlFor="Sub-Total">
            Paid Amount <span className="text-tahiti-red">*</span>
          </label>
          <input
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                dispatch({
                  type: "SET_PAID_AMOUNT",
                  payload: event.target.value,
                });
              }
            }}
            disabled={!state.total}
            type="text"
            placeholder={state.paidAmount}
            className="input w-full bg-tahiti-babyPink input-sm focus:outline-none disabled:placeholder:text-tahiti-dark"
          />
        </div>
        <div>
          <label className="block" htmlFor="Sub-Total">
            Due
          </label>
          <input
            disabled
            type="text"
            className="input w-full bg-tahiti-babyPink input-sm focus:outline-none disabled:placeholder:text-tahiti-dark"
            placeholder={state.due}
          />
        </div>
        <div>
          <label className="block" htmlFor="Sub-Total">
            Total PC Commision
          </label>
          <input
            id="Sub-Total"
            disabled
            type="text"
            className="input w-full input-sm focus:outline-none disabled:placeholder:text-tahiti-dark"
            placeholder={state.total_PC_commision}
          />
        </div>
        <div>
          <label className="block" htmlFor="Sub-Total">
            Sub Total
          </label>
          <input
            id="Sub-Total"
            disabled
            type="text"
            className="input w-full input-sm focus:outline-none disabled:placeholder:text-tahiti-dark"
            placeholder={state.total}
          />
        </div>
        <div>
          <label className="block">Total</label>
          <input
            id="total"
            disabled
            type="text"
            className="input w-full input-sm focus:outline-none disabled:placeholder:text-tahiti-dark"
            placeholder={state.grandTotal}
          />
        </div>
        <button
          onClick={handleSubmit}
          className="btn btn-sm bg-tahiti-primary mt-6 border-0"
        >
          {state.creating ? (
            <img
              className="w-4 mx-auto animate-spin"
              src="/assets/loading.png"
            />
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateInvoice;
