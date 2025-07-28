import React, { Fragment, useState } from "react";
import { signupReq } from "./fetchApi";
import { useSnackbar } from 'notistack';
import { Helmet } from "react-helmet";

// Utility functions
const sanitize = (value) => value.replace(/[<>]/g, '');

const isStrongPassword = (pwd) =>
  pwd.length >= 8 &&
  /[A-Z]/.test(pwd) &&
  /[a-z]/.test(pwd) &&
  /\d/.test(pwd) &&
  /[\W]/.test(pwd); // symbol check

const Signup = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    cPassword: "",
    error: false,
    loading: false,
    success: false,
  });

  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  const alert = (msg, type) => (
    <div className={`text-sm text-${type}-500`}>{msg}</div>
  );

  const formSubmit = async () => {
    if (locked) return;

    if (data.cPassword !== data.password) {
      return setData({
        ...data,
        error: {
          cPassword: "Password doesn't match",
          password: "Password doesn't match",
        },
      });
    }

    if (!isStrongPassword(data.password)) {
      return setData({
        ...data,
        error: {
          password: "Password must be 8+ characters, include uppercase, number, and symbol",
        },
      });
    }

    setAttempts((prev) => prev + 1);
    if (attempts >= 5) {
      setLocked(true);
      enqueueSnackbar("Too many attempts. Try again later.", { variant: "error" });
      return;
    }

    setData({ ...data, loading: true });

    try {
      const responseData = await signupReq({
        name: sanitize(data.name),
        email: sanitize(data.email),
        password: data.password,
        cPassword: data.cPassword,
      });

      if (responseData.error) {
        setData({
          ...data,
          loading: false,
          error: responseData.error,
          password: "",
          cPassword: "",
        });
      } else if (responseData.success) {
        setData({
          success: responseData.success,
          name: "",
          email: "",
          password: "",
          cPassword: "",
          loading: false,
          error: false,
        });
        enqueueSnackbar("Account Created Successfully..!", { variant: "success" });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Fragment>
      <Helmet>
        <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; object-src 'none';" />
        <meta http-equiv="X-Content-Type-Options" content="nosniff" />
        <meta http-equiv="X-Frame-Options" content="DENY" />
      </Helmet>

      <div className="text-center text-2xl mb-6">Register</div>
      <form className="space-y-4">
        {data.success && alert(data.success, "green")}

        {/* Name Field */}
        <div className="flex flex-col">
          <label htmlFor="name">Name<span className="text-sm text-gray-600 ml-1">*</span></label>
          <input
            onChange={(e) => setData({ ...data, success: false, error: {}, name: sanitize(e.target.value) })}
            value={data.name}
            type="text"
            id="name"
            autoComplete="off"
            className={`${data.error.name ? "border-red-500" : ""} px-4 py-2 focus:outline-none border`}
          />
          {data.error.name && alert(data.error.name, "red")}
        </div>

        {/* Email Field */}
        <div className="flex flex-col">
          <label htmlFor="email">Email address<span className="text-sm text-gray-600 ml-1">*</span></label>
          <input
            onChange={(e) => setData({ ...data, success: false, error: {}, email: sanitize(e.target.value) })}
            value={data.email}
            type="email"
            id="email"
            autoComplete="off"
            className={`${data.error.email ? "border-red-500" : ""} px-4 py-2 focus:outline-none border`}
          />
          {data.error.email && alert(data.error.email, "red")}
        </div>

        {/* Password Field */}
        <div className="flex flex-col">
          <label htmlFor="password">Password<span className="text-sm text-gray-600 ml-1">*</span></label>
          <input
            onChange={(e) => {
              const value = e.target.value;
              setData({
                ...data,
                success: false,
                error: !isStrongPassword(value)
                  ? { password: "Must include upper/lowercase, number, symbol, 8+ chars" }
                  : {},
                password: value,
              });
            }}
            value={data.password}
            type="password"
            id="password"
            autoComplete="new-password"
            className={`${data.error.password ? "border-red-500" : ""} px-4 py-2 focus:outline-none border`}
          />
          {data.error.password && alert(data.error.password, "red")}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col">
          <label htmlFor="cPassword">Confirm password<span className="text-sm text-gray-600 ml-1">*</span></label>
          <input
            onChange={(e) => setData({ ...data, success: false, error: {}, cPassword: e.target.value })}
            value={data.cPassword}
            type="password"
            id="cPassword"
            autoComplete="new-password"
            className={`${data.error.cPassword ? "border-red-500" : ""} px-4 py-2 focus:outline-none border`}
          />
          {data.error.cPassword && alert(data.error.cPassword, "red")}
        </div>

        {/* Optional Remember Me */}
        <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:items-center">
          <div>
            <input type="checkbox" id="rememberMe" className="px-4 py-2 focus:outline-none border mr-1" />
            <label htmlFor="rememberMe">Remember me<span className="text-sm text-gray-600">*</span></label>
          </div>
          <a className="block text-gray-600" href="/forgot-password">Lost your password?</a>
        </div>

        {/* Submit Button */}
        <div
          onClick={formSubmit}
          style={{ background: "#303031" }}
          className="px-4 py-2 text-white text-center cursor-pointer font-medium"
        >
          {locked ? "Locked Out" : "Create an account"}
        </div>
      </form>
    </Fragment>
  );
};

export default Signup;
