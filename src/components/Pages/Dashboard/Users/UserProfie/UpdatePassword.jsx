import React, { useState } from "react";
import { toast } from "react-toastify";

const UpdatePassword = () => {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");
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

  const handleSubmit = (event) => {
    // Getting From Data
    setLoading(true);
    setError("");
    event.preventDefault();
    const form = event.target;
    const password = form.password.value;
    const newPassword = form.newPassword.value;
    const confirmNewPassword = form.confirmNewPassword.value;
    if (newPassword !== confirmNewPassword) {
      setError("Password didn't match");
      return;
    }

    if (
      errors.digit ||
      errors.char ||
      errors.length ||
      errors.lower ||
      errors.upper
    )
      return;

    const UpdatePasswordData = {
      password: password,
      newPassword: newPassword,
    };

    fetch(`https://hms-server-uniceh.vercel.app/api/v1/user/update-password`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("LoginToken")}`,
      },
      body: JSON.stringify(UpdatePasswordData),
    })
      .then((res) => res.json())
      .then((result) => {
        setLoading(false);
        if (result.status === "success") {
          toast.success(result.message);
        } else {
          toast.error(result.error);
        }
        form.reset();
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <div className="p-10 bg-tahiti-white">
      <form
        onSubmit={handleSubmit}
        novalidate=""
        action=""
        class="container flex flex-col  items-center mx-auto space-y-12 "
      >
        <h1 className="text-3xl font-semibold text-tahiti-primary ">
          Update Password
        </h1>
        <fieldset class="grid grid-cols-2 gap-6 p-6 rounded-md w-3/4 ">
          <div className="col-span-full sm:col-span-3 flex gap-2 ">
            <p for="password" className="text-xl w-1/4  font-medium">
              Current Password:{" "}
            </p>
            <input
              id="password"
              type="password"
              className="w-3/4 rounded-md border p-1 "
            />
          </div>
          <div className="col-span-full sm:col-span-3 flex gap-2 ">
            <p for="newPassword" className="text-xl  w-1/4 font-medium">
              New Password:{" "}
            </p>
            <input
              id="newPassword"
              type="password"
              onChange={handleNewPasswordChange}
              className="w-3/4 rounded-md border p-1 "
            />
          </div>
          <div className="col-span-full sm:col-span-3 flex gap-2 ">
            <p for="confirmNewPassword" className="text-xl  w-1/4 font-medium">
              Confirm Password:{" "}
            </p>
            <input
              id="confirmNewPassword"
              type="password"
              className="w-3/4 rounded-md border p-1 "
            />
          </div>
          <div>
            {error && <p className="text-tahiti-red">{error}</p>}
            {errors.digit && <p className="text-tahiti-red">{errors.digit}</p>}
            {errors.char && <p className="text-tahiti-red">{errors.char}</p>}
            {errors.lower && <p className="text-tahiti-red">{errors.lower}</p>}
            {errors.upper && <p className="text-tahiti-red">{errors.upper}</p>}
            {errors.length && (
              <p className="text-tahiti-red">{errors.length}</p>
            )}
          </div>
          <br />
          <button
            type="submit"
            className="btn btn-ghost btn-sm w-1/2 bg-tahiti-primary block mx-auto col-span-2"
          >
            {loading ? (
              <img
                src="/assets/loading.png"
                className="w-6 mx-auto animate-spin"
                alt=""
              />
            ) : (
              "Update Password"
            )}
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default UpdatePassword;
