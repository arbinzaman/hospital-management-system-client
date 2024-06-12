import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import Spinner from "../../../../Shared/Spinner";
import useUserData from "../../../../Hooks/useUserData";

const ExpCatDetails = () => {
  const [expense, setExpense] = useState({});
  const [loading, setLoading] = useState(true);

  const { categoryId } = useParams();
  const { role } = useUserData();

  useEffect(() => {
    const fetchExpense = async () => {
      const response = await fetch(
        `https://hms-server-uniceh.vercel.app/api/v1/expense/category/${categoryId}`,
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
          Expense Category Details
        </h1>
        <div className=" flex w-1/2 mb-2">
          <p className="text-xl font-medium w-2/5">Name: </p>
          <p className="text-xl font-bold">{expense?.name}</p>
        </div>
        <div className=" flex w-1/2 mb-2">
          <p className="text-xl font-medium w-2/5">Description:</p>
          <p className="text-xl font-bold">{expense?.description || "N/A"}</p>
        </div>
      </div>
      <div className="flex items-center gap-x-4 mt-10">
        {(role === "admin" || role === "super-admin") && (
          <Link to={`/expense/category/update/${categoryId}`}>
            <button className="btn btn-sm bg-tahiti-primary border-none">
              Update
            </button>
          </Link>
        )}
        <Link to="/expense/category/all">
          <p className="flex gap-2  items-center hover:text-tahiti-primary transition-colors">
            <BsFillArrowLeftCircleFill className="scale-125"></BsFillArrowLeftCircleFill>
            Go Back
          </p>
        </Link>
      </div>
    </div>
  );
};

export default ExpCatDetails;
