import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const UpdatePresciption = () => {
  const { id } = useParams();

  const [diagnosis, setDiagnosis] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [tests, setTests] = useState([]);

  const [loading, setLoading] = useState(null);
  const [dosageError, setDosageError] = useState("");

  const addDiagnosis = () => {
    const value = document.getElementById("diagnosis").value;
    if (!value) return;
    setDiagnosis([...diagnosis, value]);
    document.getElementById("diagnosis").value = "";
  };

  const addTest = () => {
    const value = document.getElementById("test").value;
    if (!value) return;
    setTests([...tests, value]);
    document.getElementById("test").value = "";
  };

  const addMedic = () => {
    setDosageError("");
    const name = document.getElementById("medicine").value;
    const dosage = document.getElementById("dosage").value;
    if (!dosage || dosage.includes("Dosage"))
      return setDosageError("Please provide medicine dosage");
    if (!name) return setDosageError("Please provide medicine name");
    setMedicines([...medicines, { name, dosage }]);
    document.getElementById("medicine").value = "";
    document.getElementById("dosage").value = "Dosage";
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setLoading(true);

    const form = event.target;

    const presciptionData = {
      diagnosis,
      tests,
      medicines,
      followUp: form.followUp.value,
    };

    Swal.fire({
      title: `Confirm prescription data`,
      showCancelButton: true,
      confirmButtonText: "Book",
    }).then((results) => {
      if (results.isConfirmed) {
        fetch(`https://hms-server-uniceh.vercel.app/api/v1/appointment/${id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
            "content-type": "application/json",
          },
          body: JSON.stringify(presciptionData),
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.status === "success") toast.success(result.message);
            setLoading(false);
          })
          .catch((error) => {
            console.error(error);
            setLoading(false);
            toast.error(error);
          });
      }
    });
  };

  return (
    <div className="lg:p-20">
      <section className="p-6  bg-tahiti-white shadow-xl rounded-xl ">
        <div className="mb-8 text-center">
          <h1 className="my-3 text-4xl font-bold ">
            <span className="text-tahiti-dark">Presciption</span>{" "}
          </h1>
        </div>
        <form
          onSubmit={handleSubmit}
          noValidate=""
          action=""
          className="container flex flex-col mx-auto space-y-12"
        >
          <fieldset className="p-6">
            <div className=" space-y-6 px-40">
              <div className="col-span-full sm:col-span-3">
                <div className="flex gap-2 flex-wrap mb-2">
                  {diagnosis.map((b, index) => (
                    <div
                      key={index}
                      className="w-fit p-2 rounded-md mb-2 bg-tahiti-darkGreen text-tahiti-white"
                    >
                      <p>
                        {b.slice(0, 15)}
                        {b.length > 15 && "..."}
                        <span
                          onClick={() => {
                            const others = diagnosis.filter((ben) => ben !== b);
                            setDiagnosis(others);
                          }}
                          className="cursor-pointer ml-2"
                        >
                          ✕
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
                <label
                  for="diagnosis"
                  className="text-tahiti-lightGreen font-bold text-xl"
                >
                  Diagnosis
                </label>
                <div className="flex">
                  <input
                    id="diagnosis"
                    type="diagnosis"
                    placeholder=""
                    className="w-full focus:outline-none "
                  />
                  <p
                    onClick={addDiagnosis}
                    className="btn btn-xs mb-1 bg-tahiti-darkGreen"
                  >
                    Add Diagnosis
                  </p>
                </div>
                <hr className="text-tahiti-lightGreen" />
              </div>

              <div className="col-span-full sm:col-span-3">
                <div className="flex gap-2 flex-wrap">
                  {tests.map((b, index) => (
                    <div
                      key={index}
                      className="w-fit p-2 rounded-md mb-2 bg-tahiti-darkGreen text-tahiti-white"
                    >
                      <p>
                        {b.slice(0, 15)}
                        {b.length > 15 && "..."}
                        <span
                          onClick={() => {
                            const others = tests.filter((ben) => ben !== b);
                            setTests(others);
                          }}
                          className="text-black cursor-pointer ml-2"
                        >
                          ✕
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
                <label
                  for="test"
                  className="text-tahiti-lightGreen font-bold text-xl"
                >
                  Tests
                </label>
                <div className="flex">
                  <input
                    id="test"
                    type="test"
                    placeholder=""
                    className="w-full placeholder-tahiti-lightGreen focus:outline-none"
                  />
                  <p
                    onClick={addTest}
                    className="btn btn-xs mb-1 bg-tahiti-darkGreen"
                  >
                    Add Tests
                  </p>
                </div>
                <hr className="text-tahiti-lightGreen" />
              </div>

              <div className="col-span-full sm:col-span-3">
                <label
                  for="followUp"
                  className="text-tahiti-lightGreen text-xl font-bold"
                >
                  Follow Up Date
                </label>
                <input
                  name="followUp"
                  type="date"
                  placeholder=""
                  className="w-full placeholder-tahiti-lightGreen focus:outline-none"
                />
                <hr className="text-tahiti-lightGreen" />
              </div>

              <div>
                <div className="flex gap-2 flex-wrap mb-2">
                  {medicines.map((b, index) => (
                    <div
                      key={index}
                      className="w-fit p-2 rounded-md mb-2 bg-tahiti-darkGreen text-tahiti-white"
                    >
                      <p>
                        {b.name.slice(0, 15)}
                        {b.name.length > 15 && "..."}
                        <span
                          onClick={() => {
                            const others = medicines.filter(
                              (ben) => ben.name !== b.name
                            );
                            setMedicines(others);
                          }}
                          className="cursor-pointer ml-2"
                        >
                          ✕
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
                <label
                  for="medicine"
                  className="text-tahiti-lightGreen font-bold text-xl"
                >
                  Medicine Name
                </label>
                <div className="flex w-full">
                  <input
                    id="medicine"
                    type="text"
                    placeholder=""
                    className="w-full focus:outline-none"
                  />
                  <p
                    onClick={addMedic}
                    className="btn btn-xs mb-1 bg-tahiti-darkGreen"
                  >
                    Add Medicines
                  </p>
                </div>
                <hr className="text-tahiti-lightGreen" />
              </div>
              <div className="col-span-full sm:col-span-3">
                <select
                  type="text"
                  name="dosage"
                  id="dosage"
                  className="select focus:outline-none bg-tahiti-primary font-bold w-full text-tahiti-white"
                >
                  <option disabled selected>
                    Dosage
                  </option>
                  <option className="font-bold ">0-1-0</option>
                  <option className="font-bold ">1-1-1</option>
                  <option className="font-bold ">0-0-1</option>
                  <option className="font-bold ">1-0-1</option>
                  <option className="font-bold ">1-0-0</option>
                  <option className="font-bold ">1-1-0</option>
                  <option className="font-bold ">0-1-1</option>
                </select>
                {dosageError && (
                  <span className="text-tahiti-red my-2">{dosageError}</span>
                )}
              </div>
            </div>
          </fieldset>
          <button
            type="submit"
            className="w-fit px-6 block mx-auto py-2 mt-4 font-semibold bg-tahiti-darkGreen text-tahiti-white rounded-full"
          >
            {loading ? (
              <img
                src="assets/loading.png"
                className="animate-spin w-6 mx-12"
              />
            ) : (
              "Complete Presciption"
            )}
          </button>
        </form>
      </section>
    </div>
  );
};

export default UpdatePresciption;
