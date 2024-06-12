import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { useEffect } from "react";
import Spinner from "../../../Shared/Spinner";

const CreateBed = () => {
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(null);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const response = await fetch(
        `https://hms-server-uniceh.vercel.app/api/v1/bed/category`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
          },
        }
      );
      const data = await response.json();
      setCategories(data?.data);
      setLoading(false);
    };
    fetchCategories();
  }, []);

  const handleSubmit = (event) => {
    setCreating(true);
    event.preventDefault();
    const form = event.target;
    const category = form.category.value;
    const name = form.name.value;
    const description = form.description.value;

    const createInvoiceCategoryData = {
      category,
      name,
      description,
    };

    fetch(`https://hms-server-uniceh.vercel.app/api/v1/bed/create`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
      },
      body: JSON.stringify(createInvoiceCategoryData),
    })
      .then((res) => res.json())
      .then((result) => {
        setCreating(false);
        if (result.status === "success") {
          toast.success(result.message);
          navigate("/beds");
        } else {
          toast.error(result.error);
        }
        form.reset();
      })
      .catch((error) => {
        setCreating(false);
        toast.error(error);
      });
  };

  if (loading) return <Spinner></Spinner>;

  if (!categories.length)
    return (
      <>
        <h2 className="text-tahiti-red text-center mt-60 text-3xl">
          No Categories Found for Bed
        </h2>
        <Link to="/bed/createbedcategory">
          <button className=" lg:my-5 font-semibold p-1 rounded-md btn-ghost block mx-auto bg-tahiti-darkGreen text-tahiti-white px-4">
            Add New Category
          </button>
        </Link>
      </>
    );

  return (
    <div className="p-10">
      <Link to="/beds">
        <p className="mb-2 flex gap-2 items-center hover:text-tahiti-primary transition-colors">
          <BsFillArrowLeftCircleFill className="scale-125"></BsFillArrowLeftCircleFill>
          Go Back
        </p>
      </Link>
      <div className="py-10 bg-tahiti-white border border-tahiti-cyan rounded-md">
        <form
          onSubmit={handleSubmit}
          action=""
          class="container flex flex-col mx-auto space-y-12"
        >
          <h1 className="text-3xl font-semibold text-tahiti-primary text-center">
            Add New Bed
          </h1>
          <fieldset class="grid grid-cols-2 gap-6 rounded-md justify-items-center">
            <div className="col-span-full flex w-1/2 sm:col-span-3">
              <p className="text-xl font-medium w-1/4">Category: </p>
              <select
                type="appointed_to"
                name="category"
                id="category"
                className="select select-sm focus:outline-none w-3/4 bg-tahiti-darkGreen font-bold  text-tahiti-white"
              >
                <option disabled selected>
                  Select
                </option>
                {categories.map((doctor) => (
                  <option
                    className="font-bold text-tahiti-white"
                    key={doctor?._id}
                    value={doctor?._id}
                  >
                    {doctor?.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-full flex w-1/2 sm:col-span-3">
              <p className="text-xl font-medium w-1/4">Name: </p>
              <input
                name="name"
                type="text"
                className="w-3/4 rounded-md border p-1 "
              />
            </div>
            <div className="col-span-full flex w-1/2 sm:col-span-3">
              <p className="text-xl font-medium w-1/4">
                Description: <br /> <span className="text-xs">(Optional)</span>{" "}
              </p>
              <textarea
                name="description"
                type="text"
                className="w-3/4 rounded-md border p-1 "
              />
            </div>
            <button
              type="submit"
              className="btn btn-ghost btn-sm w-1/4 bg-tahiti-primary col-span-2"
            >
              {creating ? (
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
    </div>
  );
};

export default CreateBed;
