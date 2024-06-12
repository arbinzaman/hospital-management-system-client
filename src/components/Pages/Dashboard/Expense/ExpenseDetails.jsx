import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Spinner from "../../../Shared/Spinner";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import useUserData from "../../../Hooks/useUserData";

const ExpenseDetails = () => {
  const [expense, setExpense] = useState({});
  const [loading, setLoading] = useState(true);

  const { expenseId } = useParams();
  const { role } = useUserData();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { year: "numeric", month: "short", day: "numeric" };
    const formattedDate = date
      .toLocaleDateString("en-US", options)
      .replace(/ /g, "/");
    return formattedDate.replace(",", "");
  };

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

  if (loading) return <Spinner />;

  return (
    <div className="p-10">
      <div class="container flex flex-col mx-auto ">
        <h1 className="text-3xl font-semibold text-tahiti-primary mb-8">
          Expense Details
        </h1>
        <div className=" flex w-1/2 mb-2">
          <p className="text-xl font-medium w-2/5">Id: </p>
          <p className="text-xl font-bold text-tahiti-mainBlue">
            {expense?.serialId}
          </p>
        </div>
        <div className="flex w-1/2 mb-2 items-center">
          <p className="text-xl font-medium w-2/5">Created: </p>
          <p className="text-xl font-bold">{formatDate(expense?.createdAt)}</p>
        </div>
        <div className="flex w-1/2 mb-2 items-center">
          <p className="text-xl font-medium w-2/5">Last Updated: </p>
          <p className="text-xl font-bold">{formatDate(expense?.updatedAt)}</p>
        </div>
        <div className=" flex w-1/2 mb-2">
          <p className="text-xl font-medium w-2/5">Category: </p>
          <p className="text-xl font-bold">{expense?.category?.name}</p>
        </div>
        <div className="flex w-1/2 mb-2 items-center">
          <p className="text-xl font-medium w-2/5">Amount: </p>
          <p className="text-xl font-bold">{expense?.amount}</p>
        </div>
        <div className=" flex w-1/2 mb-2">
          <p className="text-xl font-medium w-2/5">Description:</p>
          <p className="text-xl font-bold">{expense?.description || "N/A"}</p>
        </div>
      </div>
      <div className="flex items-center gap-x-4 mt-10">
        {(role === "admin" || role === "super-admin") && (
          <Link to={`/expense/update/${expenseId}`}>
            <button className="btn btn-sm bg-tahiti-primary border-none">
              Update
            </button>
          </Link>
        )}
        <Link to="/expense/all">
          <p className="flex gap-2  items-center hover:text-tahiti-primary transition-colors">
            <BsFillArrowLeftCircleFill className="scale-125"></BsFillArrowLeftCircleFill>
            Go Back
          </p>
        </Link>
      </div>
    </div>
  );
};

export default ExpenseDetails;
