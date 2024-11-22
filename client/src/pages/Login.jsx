import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../utils/hooks/useAuth";
import axios from "../utils/apis/axios";
import useNotify from "../utils/hooks/useNotify";
import useValidator from "../utils/hooks/useValidator";


const Login = () => {
  const { setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";

  const notify = useNotify();
  const validate = useValidator();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    const validationError = validate(data, {
      type: "login"
    });
    if (validationError) {
      notify("error", validationError);
      setIsLoading(false);
      return; 
    }

    try {
      const response = await axios.post("/authorize/login", data, {
        withCredentials: true, // Allows the server to set httpOnly cookie
      });
      setAuth(response.data);
      // Login successful! Redirecting you now...
      notify("success", "Great to see you again!");
      navigate(from, { replace: true });
    } catch (err) {
      notify("error", err?.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page sign-in">
      <div className="container">
        <h1>Welcome Back</h1>
        <span>Enter your credentials correctly to log in.</span>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
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
            Not register yet? <Link to="/sign-up">Sign up</Link>
          </span>
          <button type="submit">{isLoading ? "Loading" : "Login"}</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
