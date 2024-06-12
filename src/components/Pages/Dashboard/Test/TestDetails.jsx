import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../../Shared/Spinner";
import formatDate from "../../../../utils/formatDate";
import MainTestDetails from "./MainTestDetails";
import DescDetails from "./DescDetails";
import FileTestDetails from "./FileTestDetails";
import { saveAs } from "file-saver";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useReactToPrint } from "react-to-print";

const TestDetails = () => {
  const [test, setTest] = useState({});
  const [loading, setLoading] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const { testId } = useParams();
  const reportRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
  });

  useEffect(() => {
    setLoading(true);
    fetch(`https://hms-server-uniceh.vercel.app/api/v1/test/${testId}`)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          console.log(result.data);
          setTest(result.data);
        } else {
          toast.error(result.error);
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner></Spinner>;

  const handleDownload = async () => {
    setDownloading(true);

    if (test?.file_url) {
      const patientName = test?.patient?.name;
      const testName = test?.category?.name;

      const response = await fetch(test?.file_url, {
        method: "GET",
        headers: {
          "Content-Type": "application/pdf",
        },
      });

      const fileBlob = await response.blob();
      saveAs(fileBlob, `${patientName}-${testName}-report.pdf`);
    } else {
      const capture = document.getElementById("report");

      html2canvas(capture).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const doc = new jsPDF("P", "mm", "a4");
        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();
        doc.addImage(imgData, "PNG", 0, 0, width, height);
        doc.save(`${test?.patient?.name}-${test?.category?.name}-report.pdf`);
      });
    }
    setDownloading(false);
  };

  return (
    <div className="mx-20 my-10">
      <div className="p-4" id="report" ref={reportRef}>
        <div className="grid grid-cols-3 gap-x-4 italic border p-2 mb-6 pb-4">
          <div>
            <div className="flex justify-between">
              <p>ID no: </p>
              <p>{test?.serialId}</p>
            </div>
            <div className="flex justify-between">
              <p>Patient's Name: </p>
              <p>{test?.patient?.name}</p>
            </div>
            <div className="flex justify-between">
              <p>Referred By: </p>
              <p>{test?.invoiceId?.referredBy?.name || "Self"}</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between">
              <p>Specimen: </p>
              <p className="capitalize">{test?.category?.nature}</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between">
              <p>Recieving Date: </p>
              <p className="capitalize">{formatDate(test?.createdAt)}</p>
            </div>
            <div className="flex justify-between">
              <p>Age: </p>
              <p>{test?.patient?.age}years</p>
            </div>
            <div className="flex justify-between">
              <p>Sex: </p>
              <p>{test?.patient?.gender}</p>
            </div>
          </div>
        </div>
        <h1 className="text-3xl pb-2 text-center mb-4 border w-fit mx-auto px-2 py-1 italic font-semibold">
          {test?.category?.name}
        </h1>
        {test?.category?.type === "main" && (
          <MainTestDetails test={test}></MainTestDetails>
        )}
        {test?.category?.type === "description" && (
          <DescDetails test={test}></DescDetails>
        )}
      </div>

      {test?.category?.type === "file" && (
        <FileTestDetails test={test}></FileTestDetails>
      )}

      <div className="flex gap-4 justify-center">
        <NavLink to={`/test/${testId}`}>
          <button className="btn btn-sm bg-tahiti-primary border-0 mt-4">
            Update
          </button>
        </NavLink>
        <button
          onClick={handleDownload}
          className="btn btn-sm bg-tahiti-mainBlue border-0 mt-4"
        >
          {downloading ? (
            <img className="w-4 animate-spin" src="/assets/loading.png" />
          ) : (
            "Download Report"
          )}
        </button>
        <button
          onClick={handlePrint}
          className="btn btn-sm bg-tahiti-mainBlue border-0 mt-4"
        >
          {downloading ? (
            <img className="w-4 animate-spin" src="/assets/loading.png" />
          ) : (
            "Print Report"
          )}
        </button>
      </div>
    </div>
  );
};

export default TestDetails;
