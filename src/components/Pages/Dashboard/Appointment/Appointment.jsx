import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../../Shared/Spinner";

const Appointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(null);
  const [apptLoading, setApptLoading] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  // fetch doctors data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const response = await fetch(
        `https://hms-server-uniceh.vercel.app/api/v1/user/all-doctors`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
          },
        }
      );
      const data = await response.json();
      setDoctors(data.data);
      setLoading(false);
    };
    fetchUserData();
  }, []);

  const handleSubmit = (event) => {
    // Getting From Data
    event.preventDefault();
    setApptLoading(true);
    const form = event.target;
    const reason = form.reason.value;
    const appointed_to = form.appointed_to.value;
    const amount = form.amount.value;
    const paymentCompleted = form.paymentCompleted.value;

    const appointmentData = { reason, appointed_to, paymentCompleted, amount };

    // add appointment to the backend
    fetch(`https://hms-server-uniceh.vercel.app/api/v1/appointment/add-appointment/${id}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
      },
      body: JSON.stringify(appointmentData),
    })
      .then((res) => res.json())
      .then((result) => {
        setApptLoading(false);
        if (result.status === "success") {
          toast.success(result?.message);
          navigate("/appointment");
        } else {
          toast.error(result.error);
        }
        form.reset();
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  if (loading) return <Spinner></Spinner>;

  return (
    <div className="bg-tahiti-white mt-10 mx-32 shadow-lg rounded-md">
      <h1 className=" text-tahiti-lightGreen font-bold text-center text-3xl">
        Book Appointment
      </h1>
      <form onSubmit={handleSubmit} className="container flex flex-col mx-auto">
        <fieldset className="lg:px-32 py-10">
          <div className="grid grid-cols-2 gap-x-12">
            <div className="mt-5">
              <label for="reason" className="text-tahiti-darkGreen font-bold">
                Reason
              </label>
              <input
                id="reason"
                type="text"
                placeholder=""
                className="w-full focus:outline-none"
              />
              <hr className="text-tahiti-darkGreen" />
            </div>

            <div className="mt-5">
              <label for="reason" className="text-tahiti-darkGreen font-bold">
                Amount
              </label>
              <input
                id="amount"
                type="number"
                placeholder=""
                className="w-full focus:outline-none"
              />
              <hr className="text-tahiti-darkGreen" />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-x-12">
            <select
              type="appointed_to"
              name="appointed_to"
              id="appointed_to"
              className="select select-sm focus:outline-none bg-tahiti-darkGreen font-bold  text-tahiti-white"
            >
              <option disabled selected>
                Appointed To
              </option>
              {doctors.map((doctor) => (
                <option
                  className="font-bold "
                  key={doctor?._id}
                  value={doctor?._id}
                >
                  {doctor?.firstName} {doctor?.lastName}
                </option>
              ))}
            </select>

            <select
              type="paymentCompleted"
              name="paymentCompleted"
              id="paymentCompleted"
              className="select select-sm focus:outline-none bg-tahiti-darkGreen font-bold  text-tahiti-white"
            >
              <option disabled selected>
                Payment Status
              </option>
              <option className="font-bold" value={true}>
                YES
              </option>
              <option className="font-bold" value={false}>
                NO
              </option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              className=" block mx-auto p-2 px-4 mt-10 font-semibold bg-tahiti-primary text-tahiti-white rounded-md hover:bg-tahiti-lightGreen"
            >
              {apptLoading ? (
                <img
                  src="/assets/loading.png"
                  className="w-6 mx-20 animate-spin"
                  alt=""
                />
              ) : (
                "Add Appointment"
              )}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Appointment;
