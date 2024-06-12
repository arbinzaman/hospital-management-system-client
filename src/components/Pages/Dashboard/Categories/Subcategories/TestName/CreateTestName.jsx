import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";

const CreateTestName = () => {
  const [loading, setLoading] = useState(null);
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    setLoading(true);

    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const normalValue = form.normalValue.value;
    const subCategory = categoryId;

    const createInvoiceCategoryData = {
      name, subCategory, normalValue
    };

    // return console.log(createInvoiceCategoryData);
    fetch(`https://hms-server-uniceh.vercel.app/api/v1/test_name/create`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
      },
      body: JSON.stringify(createInvoiceCategoryData),
    })
      .then((res) => res.json())
      .then((result) => {
        setLoading(false);
        console.log(result);
        if (result.status === "success") {
          toast.success(result.message);
          navigate(`/subCategory/${categoryId}`);
        } else {
          toast.error(result.error);
        }
      })
      .catch((error) => {
        form.reset();
        setLoading(false);
        toast.error(error);
      });
  };

  return (
    <>
      <Link to={`/subCategory/${categoryId}`}>
        <p className="m-5 ml-20 flex gap-2 items-center hover:text-tahiti-primary transition-colors">
          <BsFillArrowLeftCircleFill className="scale-125"></BsFillArrowLeftCircleFill>
          Go Back
        </p>
      </Link>
      <div className="mx-20 p-10 bg-tahiti-white border border-tahiti-cyan rounded-md">
        <form
          onSubmit={handleSubmit}
          action=""
          class="container flex flex-col mx-auto space-y-12"
        >
          <h1 className="text-3xl font-semibold text-tahiti-primary text-center">
            Create Test Name
          </h1>
          <fieldset class="grid grid-cols-2 gap-6 rounded-md justify-items-center">
            <div className="col-span-full flex w-1/2 sm:col-span-3">
              <p className="text-xl font-medium w-1/4">Name: </p>
              <input
                id="name"
                type="text"
                className="w-3/4 rounded-md border p-1 "
              />
            </div>
            <div className="col-span-full flex w-1/2 sm:col-span-3">
              <div class="w-1/4">
                <p className="text-xl font-medium">Normal Value: </p>
              </div>
              <input
                id="normalValue"
                type="text"
                className="w-3/4 rounded-md border p-1 "
              />
            </div>
            <button
              type="submit"
              className="btn btn-ghost btn-sm w-1/4 bg-tahiti-primary col-span-2"
            >
              {loading ? (
                <img
                  src="/assets/loading.png"
                  className="w-6 mx-8 animate-spin"
                  alt=""
                />
              ) : (
                "Submit"
              )}
            </button>
          </fieldset>
        </form>
      </div>
    </>
  );
};

export default CreateTestName;
