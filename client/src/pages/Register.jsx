import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../utils/hooks/useAuth";
import axios from "../utils/apis/axios";
import useValidator from "../utils/hooks/useValidator";
import useNotify from "../utils/hooks/useNotify";

const Register = () => {
  const { setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const from = location?.state?.from?.pathname || "/";

  const notify = useNotify();
  const validate = useValidator();

  // For development environment
  const registerUser = async (data) => {
    return await axios.post("/authorize/register", data, {
      withCredentials: true,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.target);
    const userData = Object.fromEntries(formData.entries());

    // Validate the data
    const validationError = validate(userData, {
      type: "register"
    });
    if (validationError) {
      notify("error", validationError);
      setIsLoading(false);
      return; 
    }

    try {
      if(import.meta.env.VITE_NODE_ENV === "production"){
        await axios.post('/verify/account', { email: userData.email, username: userData.username });
        const response =  await axios.get(`/verify/${userData.email}`);
        setAuth({ userData, verificationCode: response.data?.verificationCode, from });
        notify("success", "Verification code sent to your email.");
        navigate(`/verify/${userData.email}`);
      }else{
        await axios.post('/verify/account', { email: userData.email, username: userData.username });
        const response = await registerUser(userData);
        setAuth(response.data);
        notify("success", "Registration successful!");
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.log("[CLIENT - Register] Error: ", err.stack);
      notify("error", err?.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page sign-up">
      <div className="container">
        <h1>Hello, There!</h1>
        <span>Fill out this form to create your account.</span>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            required
          />
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            required
          />
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            required
          />
          <span>
            Already have an account? <Link to="/sign-in">Sign in</Link>
          </span>
          <button type="submit">{isLoading ? "Loading" : "Register"}</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
