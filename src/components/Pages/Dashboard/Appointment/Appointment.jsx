import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../../../Shared/Spinner';

const Appointment = () => {
    const [error, setError] = useState("");
    const [doctors, setDoctors] = useState({});
    const [loading, setLoading] = useState({});
    console.log(doctors);
    const { id } = useParams();
    console.log(id);


    // fetch doctors data from backend
    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            const response = await fetch(`https://hms.uniech.com/api/v1/user/all-doctors`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
                }
            })
            const data = await response.json();
            setDoctors(data.data);
            setLoading(false);
        };
        fetchUserData();
    }, []);

    if (loading) return <Spinner></Spinner>;


    const handleSubmit = event => {
        // Getting From Data 
        event.preventDefault();
        const form = event.target;
        const reason = form.reason.value;
        const appointed_to = form.appointed_to.value;
        const paymentCompleted = form.paymentCompleted.value;

        const appointmentData = {
            reason: reason,
            appointed_to: appointed_to,
            paymentCompleted: paymentCompleted,
        };
        console.log(appointmentData);
        
        // add appointment to the backend
        setLoading(true);
        fetch(`https://hms.uniech.com/api/v1/appointment/add-appointment/${id}`, {
            method: 'POST',
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("LoginToken")}`,
            },
            body: JSON.stringify(appointmentData)
        })
            .then(res => res.json())
            .then(result => {
                setLoading(false);
                console.log(result);
                if (result.status === "success") {
                    toast.success("Appointment Added")
                }
                else{
                    toast.error(result.error)
                }
                form.reset();

            })
            .catch(error => {
                console.error(error)
                setError(error.message);
            });

    }

    return (
        <div className='bg-tahiti-white m-20 shadow-lg rounded-md'>
            <h1 className=' text-tahiti-lightGreen font-bold text-center  text-5xl pt-10'>Appointment</h1>
            <form onSubmit={handleSubmit} noValidate="" action="" className="container flex flex-col   mx-auto space-y-12 ng-untouched ng-pristine ng-valid">
                <fieldset className="lg:px-32 py-20">

                    <div className="">
                        <div className="mt-5">
                            <label for="reason" className="text-tahiti-lightGreen">Reason</label>
                            <input id="reason" type="reason" placeholder="" className="w-full focus:outline-none" />
                            <hr className='text-tahiti-lightGreen' />
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-x-2">
                            <select type="appointed_to" name="appointed_to" id="appointed_to" className="select bg-tahiti-primary font-bold  text-tahiti-white">
                                <option disabled selected>Appointed To</option>
                                {
                                    doctors.map((doctor) =>
                                        <option className='font-bold ' key={doctor?._id} value={doctor?._id} >
                                            {doctor?.firstName} {doctor?.lastName}</option>
                                    )
                                }
                            </select>

                            <select type="paymentCompleted" name="paymentCompleted" id="paymentCompleted" className="select bg-tahiti-primary font-bold  text-tahiti-white">
                                <option disabled selected>Payment Status</option>
                                <option className='font-bold ' >true</option>
                                <option className='font-bold ' >false</option>

                            </select>
                        </div>
                        <div>
                            <button type="submit" className=" block mx-auto p-2 px-4 mt-20 font-semibold bg-tahiti-darkGreen text-tahiti-white rounded-md hover:bg-tahiti-lightGreen">Add Appointment</button>
                        </div>
                    </div>
                </fieldset>

            </form>

        </div>
    );
};

export default Appointment;