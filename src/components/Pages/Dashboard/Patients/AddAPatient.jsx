import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AddAPatient = () => {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // js date function
  // const currDate = new Date().toLocaleDateString();

  const handleSubmit = (event) => {
    setLoading(true);
    // Getting Form-Data
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const phone = form.phone.value;
    const address = form.address.value;
    const age = form.number.value;
    const bloodGroup = form.bloodGroup.value;
    const gender = form.gender.value;
    const emergencyContactName = form.emergencyContactName.value;
    const emergencyContactPhone = form.emergencyContactPhone.value;
    const relation = form.relation.value;

    const patientData = {
      name: name,
      phone: phone,
      address: address,
      age: age,
      bloodGroup: bloodGroup,
      gender: gender,
      emergency_contact: {
        name: emergencyContactName,
        phone: emergencyContactPhone,
        relation: relation,
      },
    };

    // All Patient Send To Backend
    fetch("https://hms-server-uniceh.vercel.app/api/v1/patient/add-new-patient", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(patientData),
    })
      .then((res) => res.json())
      .then((result) => {
        setLoading(false);
        if (result.status === "success") {
          Swal.fire({
            title: `${result.message} 
                    Book Appointment for ${name} now?`,
            showCancelButton: true,
            confirmButtonText: "Book",
          }).then((results) => {
            if (results.isConfirmed)
              navigate(`/appointment/${result?.data?._id}`);
            if (results.isDismissed) navigate("/patients");
          });
        } else {
          setError(result.error);
        }

        // form.reset();
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  };
  return (
    <div className="lg:p-10 lg:pb-0">
      <section className="p-6 bg-tahiti-white shadow-xl rounded-xl">
        <div className="mb-4 text-center">
          <h1 className="my-2 text-2xl font-bold">
            <span className="text-tahiti-primary">PATIENT</span>
            <span className="text-tahiti-dark"> INFORMATION</span>
          </h1>
        </div>
        <form
          onSubmit={handleSubmit}
          noValidate=""
          action=""
          className="container flex flex-col mx-auto space-y-12 ng-untouched ng-pristine ng-valid"
        >
          <fieldset className="grid gap-6 px-36">
            <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
              <div className="col-span-full sm:col-span-3">
                <label
                  for="name"
                  className="text-tahiti-lightGreen font-bold uppercase"
                >
                  FULL NAME
                </label>
                <input
                  id="name"
                  type="name"
                  placeholder=""
                  className="w-full focus:outline-none"
                />
                <hr className="text-tahiti-lightGreen" />
              </div>
              <div className="col-span-full sm:col-span-3">
                <label
                  for="phone"
                  className="text-tahiti-lightGreen font-bold uppercase"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  type="phone"
                  placeholder=""
                  className="w-full  focus:outline-none"
                />
                <hr className="text-tahiti-lightGreen" />
              </div>
              <div className="col-span-full sm:col-span-3">
                <label
                  for="address"
                  className="text-tahiti-lightGreen font-bold uppercase"
                >
                  ADDRESS
                </label>
                <input
                  id="address"
                  type="address"
                  placeholder=""
                  className="w-full  focus:outline-none"
                />
                <hr className="text-tahiti-lightGreen" />
              </div>

              <div className="col-span-full sm:col-span-3">
                <label
                  for="number"
                  className="text-tahiti-lightGreen font-bold uppercase"
                >
                  Age
                </label>
                <input
                  id="number"
                  type="number"
                  placeholder=""
                  className="w-full placeholder-tahiti-lightGreen focus:outline-none"
                />
                <hr className="text-tahiti-lightGreen" />
              </div>

              <select
                type="bloodGroup"
                name="bloodGroup"
                id="bloodGroup"
                className="select select-sm bg-tahiti-primary col-span-full sm:col-span-3 focus:outline-none font-bold w-full text-tahiti-white"
              >
                <option disabled selected>
                  Blood Group
                </option>
                <option className="font-bold ">O+</option>
                <option className="font-bold ">O-</option>
                <option className="font-bold ">A+</option>
                <option className="font-bold ">A-</option>
                <option className="font-bold ">B+</option>
                <option className="font-bold ">B-</option>
                <option className="font-bold ">AB+</option>
                <option className="font-bold ">AB-</option>
              </select>

              <select
                type="gender"
                name="gender"
                id="gender"
                className="select select-sm bg-tahiti-primary col-span-full sm:col-span-3 focus:outline-none font-bold w-full text-tahiti-white"
              >
                <option disabled selected>
                  Gender
                </option>
                <option className="font-bold ">Male</option>
                <option className="font-bold ">Female</option>
                <option className="font-bold ">Other</option>
              </select>

              <div className="mb-4 col-span-full flex justify-center sm:col-span-6 ">
                <p className="text-xl font-bold mt-4 uppercase">
                  {" "}
                  <span className="text-tahiti-dark">Emergency </span>{" "}
                  <span className="text-tahiti-primary">Contact</span>{" "}
                </p>
              </div>

              <div className="col-span-full sm:col-span-3">
                <label
                  for="emergencyContactName"
                  className="text-tahiti-lightGreen font-bold uppercase"
                >
                  Name
                </label>
                <input
                  id="emergencyContactName"
                  type="emergencyContactName"
                  placeholder=""
                  className="w-full  focus:outline-none"
                />
                <hr className="text-tahiti-lightGreen" />
              </div>
              <div className="col-span-full sm:col-span-3">
                <label
                  for="emergencyContactPhone"
                  className="text-tahiti-lightGreen font-bold uppercase"
                >
                  Phone
                </label>
                <input
                  id="emergencyContactPhone"
                  type="emergencyContactPhone"
                  placeholder=""
                  className="w-full  focus:outline-none"
                />
                <hr className="text-tahiti-lightGreen" />
              </div>
              <div className="col-span-full sm:col-span-3">
                <label
                  for="relation"
                  className="text-tahiti-lightGreen font-bold uppercase"
                >
                  Relation
                </label>
                <input
                  id="relation"
                  type="relation"
                  placeholder=""
                  className="w-full  focus:outline-none"
                />
                <hr className="text-tahiti-lightGreen" />
              </div>
            </div>
            {error && (
              <p className="text-tahiti-red">{error}</p>
            )}
          </fieldset>
          <div className="mt-0">
            <button
              type="submit"
              className="w-fit mx-auto block px-6 pt-2 pb-2 font-semibold bg-tahiti-dark text-tahiti-white rounded-full"
            >
              {loading ? (
                <img
                  src="assets/loading.png"
                  className="w-6 mx-8 animate-spin"
                  alt=""
                />
              ) : (
                "Add Patient"
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddAPatient;
