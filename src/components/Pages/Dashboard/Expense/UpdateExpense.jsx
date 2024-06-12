import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import Spinner from "../../../Shared/Spinner";

const UpdateExpense = () => {
  const [loading, setLoading] = useState(true);
  const [expense, setExpense] = useState({})
  const [creating, setCreating] = useState(null);

  const { expenseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpense = async () => {
      const response = await fetch(
        `https://hms-server-uniceh.vercel.app/api/v1/expense/${expenseId}`,
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
    const amount = form.amount.value;
    const description = form.description.value;

    const createInvoiceCategoryData = {
      amount,
      description,
    };

    fetch(`https://hms-server-uniceh.vercel.app/api/v1/expense/${expenseId}`, {
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
          navigate(`/expense/${expenseId}`);
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

  return (
    <div className="p-10">
      <Link to="/expense/all">
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
            Update Expense
          </h1>
          <fieldset class="grid grid-cols-2 gap-6 rounded-md justify-items-center">
            <div className="col-span-full flex w-1/2 sm:col-span-3">
              <p className="text-xl font-medium w-1/4">Id: </p>
              <p className="text-xl font-medium"> {expense?.serialId}</p>
            </div>
            <div className="col-span-full flex w-1/2 sm:col-span-3">
              <p className="text-xl font-medium w-1/4">Category: </p>
              <p className="text-xl font-medium"> {expense?.category?.name}</p>
            </div>
            <div className="col-span-full flex w-1/2 sm:col-span-3">
              <p className="text-xl font-medium w-1/4">Amount: </p>
              <input
                name="amount"
                type="number"
                placeholder={expense?.amount}
                className="w-3/4 rounded-md border p-1 "
              />
            </div>
            <div className="col-span-full flex w-1/2 sm:col-span-3">
              <p className="text-xl font-medium w-1/4">
                Description: <br /> <span className="text-xs">(Optional)</span>{" "}
              </p>
              <textarea
                name="description"
                type="number"
                placeholder={expense?.description}
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

export default UpdateExpense;
