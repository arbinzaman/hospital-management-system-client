import React, { useEffect, useRef, useState } from "react";
import Spinner from "../../../Shared/Spinner";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Swal from "sweetalert2";

const InvoicePage = () => {
  const { invoiceId } = useParams();
  const [loading, setLoading] = useState(null);
  const [refetch, setRefetch] = useState(true);
  const [invoice, setInvoice] = useState({});

  const formatDate = (date) => {
    const newDate = new Date(date);
    const options = { year: "numeric", month: "short", day: "numeric" };
    const formattedDate = newDate
      .toLocaleDateString("en-US", options)
      .replace(/ /g, "/");
    return formattedDate.replace(",", "");
  };

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleStatusUpdate = () => {
    Swal.fire({
      title: "Submit Payment",
      html: `
        <input type="number" id="numberInput" class="input input-bordered border-tahiti-dark" placeholder=${
          invoice?.dueAmount + "৳"
        }>
        <p class="text-xs text-center text-tahiti-red mt-4" >Please make sure you don't enter a value greater than the due amount!</p>`,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      didOpen: () => {
        const input = document.getElementById("numberInput");
        input.addEventListener("keydown", handleKeyDown);
        input.focus();
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const input = document.getElementById("numberInput");
        const numberInput = Number(input.value);

        Swal.fire({
          title: "Loading",
          html: "Processing your request...",
          allowOutsideClick: false,
          didOpen: async () => {
            Swal.showLoading();

            const response = await fetch(
              `https://hms-server-uniceh.vercel.app/api/v1/invoice/status/${invoiceId}`,
              {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
                },
                body: JSON.stringify({
                  paidAmount: numberInput,
                }),
              }
            );
            const data = await response.json();
            if (data.status === "success") {
              Swal.close();
              Swal.fire({
                title: "Success",
                text: data.message,
                icon: "success",
              }).then((result) => {
                if (result.isConfirmed) {
                  setRefetch(!refetch);
                }
              });
            } else {
              Swal.close();
              Swal.fire({
                title: "Error",
                text: data.error,
                icon: "error",
              });
            }
          },
        });
      }
    });

    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        Swal.clickConfirm();
      }
    };
  };

  useEffect(() => {
    const fetchInvoiceData = async () => {
      setLoading(true);
      const response = await fetch(
        `https://hms-server-uniceh.vercel.app/api/v1/invoice/${invoiceId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
          },
        }
      );
      const data = await response.json();
      setInvoice(data?.data);
      setLoading(false);
    };
    fetchInvoiceData();
  }, [refetch]);

  if (loading) return <Spinner></Spinner>;

  return (
    <div className="p-10 pb-0">
      <div ref={componentRef}>
      <div>
        <p className="text-xl text-tahiti-lightGreen my-2-5 mx-10 font-semibold print:mt-4">
          HMS UNIECH
        </p>
      </div>
        <div className="grid grid-cols-3 bg-tahiti-white p-10">
          <div>
            <p>From,</p>
            <p className="font-medium">
              {invoice?.createdBy?.firstName} {invoice?.createdBy?.lastName}
            </p>
            <p className="font-medium capitalize">{invoice?.createdBy?.role}</p>
            <p>
              Phone:{" "}
              <span className="font-medium">{invoice?.createdBy?.phone}</span>{" "}
            </p>
            <p>
              Email:{" "}
              <span className="font-medium">{invoice?.createdBy?.email}</span>
            </p>
          </div>
          <div>
            <p>To</p>
            <p>Patient Name: {invoice?.patient?.name}</p>
            <p>Phone: {invoice?.patient?.phone}</p>
            <p>Id: {invoice?.patient?.serialId}</p>
          </div>
          <div>
            <p>
              Invoice Id: <span className="font-bold">{invoice?.serialId}</span>
            </p>
            <p>
              Payment Status:{" "}
              <span className="font-bold">
                {" "}
                {invoice?.dueAmount === 0 ? "Paid" : "Unpaid"}
              </span>
            </p>
            <p>Created: {formatDate(invoice?.createdAt)}</p>
            <p>Updated: {formatDate(invoice?.updatedAt)}</p>
          </div>
        </div>
        <div className="px-10 bg-tahiti-white">
          <div className="overflow-x-auto bg-tahiti-white border text-sm rounded-lg">
            <table className="table w-full">
              <thead>
                <tr>
                  <th className="p-2">Item</th>
                  <th className="p-2 text-center print:hidden">PC Comission</th>
                  <th className="text-right p-2">Amount</th>
                </tr>
              </thead>
              {invoice?.tests?.map((payment, i) => (
                <tr key={payment?._id}>
                  <td className="p-2">{payment.name}</td>
                  <td className="p-2 text-center print:hidden">
                    {Math.ceil((payment.charge * payment.pcRate) / 100)}৳
                  </td>
                  <td className="text-right p-2">{payment.charge}৳</td>
                </tr>
              ))}
              {invoice?.bedding?.days > 0 && (
                <tr>
                  <td className="p-2">
                    Bedding Charge : <b>{invoice?.bedding?.bed?.name}</b> (
                    {invoice?.bedding?.days} days){" "}
                  </td>
                  <td className="p-2 text-center print:hidden">-</td>
                  <td className="text-right p-2">
                    {invoice?.bedding?.charge}৳
                  </td>
                </tr>
              )}
              {invoice?.medicineCharge > 0 && (
                <tr>
                  <td className="p-2">Medicine Charge </td>
                  <td className="p-2 text-center print:hidden">-</td>
                  <td className="text-right p-2">{invoice?.medicineCharge}৳</td>
                </tr>
              )}
              {invoice?.serviceCharge > 0 && (
                <tr>
                  <td className="p-2">Service Charge </td>
                  <td className="p-2 text-center print:hidden">-</td>
                  <td className="text-right p-2">{invoice?.serviceCharge}৳</td>
                </tr>
              )}
              {invoice?.otherCharges?.map((charge) => {
                if (charge.name && charge.amount) {
                  return (
                    <tr key={charge._id}>
                      <td className="p-2">{charge.name}</td>
                      <td className="p-2 text-center print:hidden">-</td>
                      <td className="text-right p-2">{charge.amount}৳</td>
                    </tr>
                  );
                } else {
                  return null; // Skip rendering if name or amount is not valid
                }
              })}
            </table>
          </div>
        </div>
        <div className="grid grid-cols-3 bg-tahiti-white p-10">
          <div className="mt-auto space-x-4">
            {invoice?.dueAmount > 0 && (
              <button
                onClick={handleStatusUpdate}
                className="btn btn-xs btn-success print:hidden "
              >
                Submit Payment
              </button>
            )}
            <button
              onClick={handlePrint}
              className="btn btn-ghost btn-xs bg-tahiti-primary print:hidden"
            >
              Print
            </button>
          </div>
          <div>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <tbody>
                  {/* row 1 */}
                  <tr className="print:hidden">
                    <td className="p-2">PC Commission: </td>
                    <td className="font-bold text-right p-2">
                      {invoice?.total_PC_Commission}৳
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2">Tax Amount:</td>
                    <td className="font-bold text-right p-2">
                      {invoice?.VAT?.vatAmount}৳
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2">Payment Due:</td>
                    <td className="font-bold text-right p-2">
                      {invoice?.dueAmount}৳
                    </td>
                  </tr>
                  <tr className="print:border-b-2">
                    <td className="p-2">Paid Amount: </td>
                    <td className="font-bold text-right p-2">
                      {invoice?.paidAmount}৳
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <tbody>
                  {/* row 1 */}
                  <tr>
                    <td className="p-2">Tax:</td>
                    <td className="font-bold text-right p-2">
                      +{invoice?.VAT?.vatPercentage}%
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2">Discount:</td>
                    <td className="font-bold text-right p-2">
                      {invoice?.discount}৳
                    </td>
                  </tr>
                  <tr className="print:border-b-2">
                    <td className="p-2">Sub Total: </td>
                    <td className="font-bold text-right p-2">
                      {invoice?.sub_total}৳
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2">Grand Total: </td>
                    <td className="font-bold text-right p-2">
                      {invoice?.grand_total}৳
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
