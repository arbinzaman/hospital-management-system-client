import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import Spinner from "../../../Shared/Spinner";
import formatDate from "../../../../utils/formatDate";
import Invoices from "./Invoices";

const PcDetails = () => {
  const [expense, setExpense] = useState({});
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    const fetchExpense = async () => {
      const response = await fetch(`https://hms-server-uniceh.vercel.app/api/v1/pc/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
        },
      });
      const data = await response.json();
      console.log(data?.data);
      setExpense(data?.data);
      setLoading(false);
    };
    fetchExpense();
  }, [refetch]);

  if (loading) return <Spinner />;

  return (
    <div className="px-10 pt-10">
      <Link to={`/pc`}>
        <p className="flex gap-2 mb-2 items-center hover:text-tahiti-primary transition-colors">
          <BsFillArrowLeftCircleFill className="scale-125"></BsFillArrowLeftCircleFill>
          Go Back
        </p>
      </Link>
      <div class="container flex flex-col mx-auto ">
        <h1 className="text-3xl font-semibold text-tahiti-primary mb-8">
          PC Details
        </h1>
        <div className=" flex w-1/2 mb-2">
          <p className="text-xl font-medium w-2/5">Name: </p>
          <p className="text-xl font-bold text-tahiti-mainBlue">
            {expense?.name}
          </p>
        </div>
        <div className=" flex w-1/2 mb-2">
          <p className="text-xl font-medium w-2/5">Id: </p>
          <p className="text-xl font-bold">{expense?.serialId}</p>
        </div>
        <div className=" flex w-1/2 mb-2">
          <p className="text-xl font-medium w-2/5">Phone: </p>
          <p className="text-xl font-bold">{expense?.phone}</p>
        </div>
        <div className=" flex w-1/2 mb-2">
          <p className="text-xl font-medium w-2/5"> Location</p>
          <p className="text-xl font-bold">{expense?.location}</p>
        </div>
        <div className=" flex w-1/2 mb-2">
          <p className="text-xl font-medium w-2/5">Organization: </p>
          <p className="text-xl font-bold">{expense?.organization}</p>
        </div>
        <div className=" flex w-1/2 mb-2">
          <p className="text-xl font-medium w-2/5">Added By: </p>
          <p className="text-xl font-bold">
            {expense?.addedBy?.firstName} {expense?.addedBy?.lastName || ""} (
            {expense?.addedBy?.role})
          </p>
        </div>

        <div className=" flex w-1/2 mb-2">
          <p className="text-xl font-medium w-2/5">Registered:</p>
          <p className="text-xl font-bold">
            {formatDate(expense?.createdAt) || "N/A"}
          </p>
        </div>
      </div>
      <div className="mt-10">
        <Link to={`/pc/update/${id}`}>
          <button className="btn btn-xs bg-tahiti-primary border-none">
            Update
          </button>
        </Link>
      </div>
      <Invoices
        expense={expense}
        refetch={refetch}
        setRefetch={setRefetch}
      ></Invoices>
    </div>
  );
};

export default PcDetails;
