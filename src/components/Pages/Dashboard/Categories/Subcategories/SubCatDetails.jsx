import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import Spinner from "../../../../Shared/Spinner";
import TestNames from "./TestName/TestNames";

const SubCatDetails = () => {
  const [expense, setExpense] = useState({});
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(true);

  const { categoryId } = useParams();

  useEffect(() => {
    const fetchExpense = async () => {
      const response = await fetch(
        `https://hms-server-uniceh.vercel.app/api/v1/sub_category/${categoryId}`,
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
  }, [refetch]);

  if (loading) return <Spinner />;

  return (
    <div className="px-10 pt-10">
      <Link to={`/category/${expense.mainCategory._id}`}>
        <p className="flex gap-2 mb-2 items-center hover:text-tahiti-primary transition-colors">
          <BsFillArrowLeftCircleFill className="scale-125"></BsFillArrowLeftCircleFill>
          Go Back
        </p>
      </Link>
      <div class="container flex flex-col mx-auto ">
        <h1 className="text-3xl font-semibold text-tahiti-primary mb-8">
          Sub Category Details
        </h1>
        <div className=" flex w-1/2 mb-2">
          <p className="text-xl font-medium w-2/5">Name: </p>
          <p className="text-xl font-bold text-tahiti-mainBlue">
            {expense?.name}
          </p>
        </div>
        <div className=" flex w-1/2 mb-2">
          <p className="text-xl font-medium w-2/5">Charge: </p>
          <p className="text-xl font-bold">{expense?.charge}৳</p>
        </div>
        <div className=" flex w-1/2 mb-2">
          <p className="text-xl font-medium w-2/5">PC rate(%): </p>
          <p className="text-xl font-bold">{expense?.pcRate}%</p>
        </div>
        <div className=" flex w-1/2 mb-2">
          <p className="text-xl font-medium w-2/5">Type </p>
          <p className="text-xl font-bold">{expense?.type}</p>
        </div>
        <div className=" flex w-1/2 mb-2">
          <p className="text-xl font-medium w-2/5">Nature of exam: </p>
          <p className="text-xl font-bold">{expense?.nature}</p>
        </div>
        <div className=" flex w-1/2 mb-2">
          <p className="text-xl font-medium w-2/5">Main Category: </p>
          <p className="text-xl font-bold">{expense?.mainCategory?.name}</p>
        </div>

        <div className=" flex w-1/2 mb-2">
          <p className="text-xl font-medium w-2/5">Description:</p>
          <p className="text-xl font-bold">{expense?.description || "N/A"}</p>
        </div>
      </div>
      <div className="mt-10">
        <Link to={`/subCategory/update/${categoryId}`}>
          <button className="btn btn-xs bg-tahiti-primary border-none">
            Update
          </button>
        </Link>
      </div>
      <TestNames
        expense={expense}
        refetch={refetch}
        setRefetch={setRefetch}
      ></TestNames>
    </div>
  );
};

export default SubCatDetails;
