import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    // if login token not available login redirect
    if (!localStorage.getItem("LoginToken") || (user.status === 'fail')) {
        navigate('/user/login')
    }
    // const { user } = useContext(UserContext);
    // const [loading, useLoading] = useState(null);
    const location = useLocation();

    // fetching userInfo from backend
    useEffect(() => {
        fetch("https://hms-server-uniceh.vercel.app/api/v1/user/user-info", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 'fail') {
                    navigate('/user/login')   
                }
            })

    }, []);


    // if (loading) {
    //     return <Spinner></Spinner>
    // }
    if (!user) {
        return <Navigate to="/user/login"
            state={{ from: location }}
            replace></Navigate>
    }
    return children;

};

export default PrivateRoute;
