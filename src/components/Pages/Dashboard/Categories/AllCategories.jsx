import React from "react";
import { Link } from "react-router-dom";
import CategoryRow from "./CategoryRow";
import { useEffect } from "react";
import { useState } from "react";
import Spinner from "../../../Shared/Spinner";

const AllCategories = () => {
  const [loading, setLoading] = useState(null);
  const [categories, setCategories] = useState([]);
  const [refetch, setRefetch] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`https://hms-server-uniceh.vercel.app/api/v1/category/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCount(data?.total);
        setLoading(false);
        setCategories(data?.data);
      });
  }, [refetch]);

  if (loading) return <Spinner></Spinner>;
  else if (!count)
    return (
      <>
        <h2 className="text-tahiti-red text-center mt-60 text-3xl">
          No Categories Found
        </h2>
        <Link to="/category/new">
          <button className=" lg:my-5 font-semibold p-1 rounded-md btn-ghost block mx-auto bg-tahiti-darkGreen text-tahiti-white px-4">
            Add New Category
          </button>
        </Link>
      </>
    );

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold ">Test Categories: {count}</h1>
      <Link to="/category/new">
        <button className=" lg:my-5 font-semibold px-2 py-1 text-xs rounded-md bg-tahiti-darkGreen text-tahiti-white">
          Add New
        </button>
      </Link>
      <div className="overflow-x-auto">
        <table className="table w-full text-sm bg-tahiti-white">
          <thead>
            <tr>
              <th className=" py-2" >Sl</th>
              <th className=" py-2">Name</th>
              <th className="text-center py-2">Details</th>
              <th className="text-center py-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, i) => (
              <CategoryRow
                key={category._id}
                category={category}
                i={i}
                refetch={refetch}
                setRefetch={setRefetch}
              ></CategoryRow>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllCategories;
