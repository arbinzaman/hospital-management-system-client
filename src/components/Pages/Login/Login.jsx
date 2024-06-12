import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../Shared/Spinner";

const Login = () => {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");
  // Redirect to current path
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleUserNamePassword = (event) => {
    event.preventDefault();
    setLoading(true);
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    const loginData = {
      email: email,
      password: password,
    };
    // login send to backend
    fetch("https://hms-server-uniceh.vercel.app/api/v1/user/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
      .then((res) => res.json())
      .then((result) => {
        setLoading(false);

        if (result.status === "fail") {
          return setError(result.error);
        }
        // set JWT token in local storage
        localStorage.setItem("LoginToken", result.data.token);
        toast.success(`Login successful`);
        navigate(from, { replace: true });
        navigate("/");
        form.reset();
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
      });
    if (loading) return <Spinner></Spinner>;
  };

  return (
    <div className="bg-tahiti-green  min-h-screen flex justify-center items-center">
      <div className="bg-tahiti-white shadow-xl w-full max-w-md p-8 space-y-3 rounded-xl">
        <div className="text-center">
          <h1 className="my-3 text-4xl font-bold pb-4">
            <span className="text-tahiti-primary">UNIECH</span>
            <span className="text-tahiti-dark"> HMS</span>{" "}
          </h1>
          <p className="text-xl font-semibold">
            {" "}
            <span className="text-tahiti-dark">Login to you </span>{" "}
            <span className="text-tahiti-primary">account</span>{" "}
          </p>
        </div>
        <form
          onSubmit={handleUserNamePassword}
          noValidate=""
          action=""
          className="space-y-12 ng-untouched ng-pristine ng-valid"
        >
          <div className="space-y-4">
            <div>
              <label
                for="email"
                className="block mb-2 text-sm text-tahiti-primary"
              >
                EMAIL{" "}
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                className="w-full focus:outline-none pb-3 text-xs text-tahiti-primary"
              />
              <hr className="w-full text-tahiti-primary" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label for="password" className="text-sm  text-tahiti-primary">
                  PASSWORD
                </label>
              </div>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="password"
                className="w-full focus:outline-none pb-3 text-xs text-tahiti-primary"
              />
              <hr className="w-full text-tahiti-primary" />
              <a
                rel="noopener noreferrer"
                href="#"
                className="text-xs hover:underline text-tahiti-primary "
              >
                Forgot password?
              </a>
            </div>
            {error && <p className="text-tahiti-red"> {error} </p>}
          </div>
          <div className="space-y-2">
            <div>
              <button
                type="submit"
                className="w-full px-8 py-3 font-semibold rounded-md bg-tahiti-primary "
              >
                {loading ? (
                  <img
                    className="animate-spin w-6 inline-block"
                    src="/assets/loading.png"
                  />
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
