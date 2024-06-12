import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import Spinner from "../../../../../Shared/Spinner";

const UpdateTestName = () => {
  const [loading, setLoading] = useState(null);
  const [expense, setExpense] = useState({});
  const [creating, setCreating] = useState(null);

  const { categoryId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpense = async () => {
      const response = await fetch(
        `https://hms-server-uniceh.vercel.app/api/v1/test_name/${categoryId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
          },
        }
      );
      const data = await response.json();
      setExpense(data?.data);
      setLoading(false);
    };
    fetchExpense();
  }, []);

  const handleSubmit = (event) => {
    setCreating(true);
    event.preventDefault();
    const form = event.target;
    const name = form.name.value || expense?.name;
    const normalValue = form.description.value || expense?.normalValue;

    const createBedCategoryData = {
      name,
      normalValue,
    };

    fetch(`https://hms-server-uniceh.vercel.app/api/v1/test_name/${categoryId}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
      },
      body: JSON.stringify(createBedCategoryData),
    })
      .then((res) => res.json())
      .then((result) => {
        setCreating(false);
        if (result.status === "success") {
          toast.success(result.message);
          navigate(`/subCategory/${expense?.subCategory?._id}`);
          form.reset();
        } else {
          toast.error(result.error);
        }
      })
      .catch((error) => {
        setCreating(false);
        toast.error(error);
      });
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-10">
      <Link to={`/category/${expense?.subCategory?._id}`}>
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
            Update Test Name
          </h1>
          <fieldset class="grid grid-cols-2 gap-6 rounded-md justify-items-center">
            <div className="col-span-full flex w-1/2 sm:col-span-3">
              <p className="text-xl font-medium w-1/4">Name: </p>
              <input
                name="name"
                type="text"
                placeholder={expense?.name}
                className="w-3/4 rounded-md border p-1 "
              />
            </div>
            <div className="col-span-full flex w-1/2 sm:col-span-3">
              <p className="text-xl font-medium w-1/4">Normal Value:</p>
              <input
                name="description"
                type="text"
                placeholder={expense?.normalValue}
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
                "Update"
              )}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default UpdateTestName;
