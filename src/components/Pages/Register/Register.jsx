import React, { useState } from "react";
import { toast } from "react-toastify";

const Register = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(null);
  const [errors, setErrors] = useState({
    digit: "",
    lower: "",
    upper: "",
    length: "",
    char: "",
  });

  const handleNewPasswordChange = (event) => {
    const newPasswordValue = event.target.value;

    // Check if the new password matches each regex validation
    const digitRegex = /\d/;
    const lowerRegex = /[a-z]/;
    const upperRegex = /[A-Z]/;
    const lengthRegex = /^.{8,}$/;
    const charRegex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    let newPasswordErrors = { ...errors };

    newPasswordErrors.digit = digitRegex.test(newPasswordValue)
      ? ""
      : "Password must contain at least one digit.";
    newPasswordErrors.lower = lowerRegex.test(newPasswordValue)
      ? ""
      : "Password must contain at least one lowercase letter.";
    newPasswordErrors.upper = upperRegex.test(newPasswordValue)
      ? ""
      : "Password must contain at least one uppercase letter.";
    newPasswordErrors.length = lengthRegex.test(newPasswordValue)
      ? ""
      : "Password must be at least 8 characters long.";
    newPasswordErrors.char = charRegex.test(newPasswordValue)
      ? ""
      : "Password must contain at least one special character.";

    setErrors(newPasswordErrors);
  };
  // For Error Functionality
  // const [loginResult, setLoginResult] = useState({});

  const handleSubmit = (event) => {
    setLoading(true);
    setError("");
    // Getting From Data
    event.preventDefault();
    const form = event.target;
    const firstName = form.firstName.value;
    const lastName = form.lastName.value;
    const phone = form.phone.value;
    const role = form.role.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    if (password !== confirmPassword) {
      setError("Password didn't match");
      return;
    }
    const signUpData = {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      role: role,
      email: email,
      password: password,
    };

    // login send to backend
    fetch("https://hms-server-uniceh.vercel.app/api/v1/user/signup", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(signUpData),
    })
      .then((res) => res.json())
      .then((result) => {
        setLoading(false);
        if (result?.status === "success") {
          toast.success(result?.message);
          form.reset();
        } else {
          toast.error(result.error);
        }
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <div className="p-10 px-32">
      <section className="p-4 flex flex-col items-center bg-tahiti-white shadow-xl rounded-xl">
        <div className=" text-center">
          <h1 className="my-3 text-4xl font-bold pb-2">
            <span className="text-tahiti-primary">UNIECH</span>
            <span className="text-tahiti-dark"> HMS</span>{" "}
          </h1>
          <p className="text-xl font-semibold">
            {" "}
            <span className="text-tahiti-dark">Register </span>{" "}
            <span className="text-tahiti-primary">New User</span>{" "}
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="container flex items-center flex-col space-y-12 p px-20"
        >
          <fieldset className="grid gap-6 p-6 pb-0 rounded-md  ">
            <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3  ">
              <div className="col-span-full sm:col-span-3">
                <label
                  for="firstName"
                  className="text-stext-md font-semibold text-tahiti-lightGreen"
                >
                  First name
                </label>
                <input
                  name="firstName"
                  type="text"
                  placeholder=""
                  className="w-full focus:outline-none"
                />
                <hr className="text-tahiti-lightGreen" />
              </div>
              <div className="col-span-full sm:col-span-3">
                <label
                  for="lastName"
                  className="text-md font-semibold text-tahiti-lightGreen"
                >
                  Last name
                </label>
                <input
                  name="lastName"
                  type="text"
                  placeholder=""
                  className="w-full focus:outline-none"
                />
                <hr className="text-tahiti-lightGreen" />
              </div>
              <div className="col-span-full sm:col-span-3">
                <label
                  for="email"
                  className="text-md font-semibold text-tahiti-lightGreen"
                >
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder=""
                  className="w-full focus:outline-none"
                />
                <hr className="text-tahiti-lightGreen" />
              </div>
              <div className="col-span-full sm:col-span-3">
                <label
                  for="phone"
                  className="text-md font-semibold text-tahiti-lightGreen"
                >
                  Phone
                </label>
                <input
                  name="phone"
                  type="phone"
                  placeholder=""
                  className="w-full focus:outline-none"
                />
                <hr className="text-tahiti-lightGreen" />
              </div>
              <div className="col-span-full sm:col-span-3">
                <label
                  for="password"
                  className="text-md font-semibold text-tahiti-lightGreen"
                >
                  Password
                </label>
                <input
                  onChange={handleNewPasswordChange}
                  name="password"
                  type="password"
                  placeholder=""
                  className="w-full focus:outline-none"
                />
                <hr className="text-tahiti-lightGreen" />
              </div>
              <div className="col-span-full sm:col-span-3">
                <label
                  for="confirmPassword"
                  className="text-md font-semibold text-tahiti-lightGreen"
                >
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder=""
                  className="w-full focus:outline-none"
                />
                <hr className="text-tahiti-lightGreen" />
              </div>
            </div>
            <div>
              <select
                type="role"
                name="role"
                id="role"
                className="select bg-tahiti-primary font-bold text-tahiti-white"
              >
                <option disabled selected>
                  Choose Role
                </option>
                <option className="font-bold" value={"admin"}>
                  Admin
                </option>
                <option className="font-bold" value={"doctor"}>
                  Doctor
                </option>
                <option className="font-bold" value={"receptionist"}>
                  Receptionist
                </option>
                <option className="font-bold" value={"labaratorist"}>
                  Labaratorist
                </option>
              </select>
              <div className="mt-2">
                {error && <p className="text-tahiti-red">{error}</p>}
                {errors.digit && (
                  <p className="text-tahiti-red">{errors.digit}</p>
                )}
                {errors.char && (
                  <p className="text-tahiti-red">{errors.char}</p>
                )}
                {errors.lower && (
                  <p className="text-tahiti-red">{errors.lower}</p>
                )}
                {errors.upper && (
                  <p className="text-tahiti-red">{errors.upper}</p>
                )}
                {errors.length && (
                  <p className="text-tahiti-red">{errors.length}</p>
                )}
              </div>
            </div>
          </fieldset>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-60 py-2 text-sm font-semibold rounded-md bg-tahiti-darkGreen text-tahiti-white "
            >
              {loading ? (
                  <img
                    className="animate-spin w-6 inline-block"
                    src="/assets/loading.png"
                  />
                ) : (
                  "Sign Up"
                )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Register;
