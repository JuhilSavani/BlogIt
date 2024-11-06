import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../utils/hooks/useAuth";
import axios from "../utils/apis/axios";
import useValidator from "../utils/hooks/useValidator";
import useNotify from "../utils/hooks/useNotify";

const Register = () => {
  const { setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});

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
    // Validate the data
    const validationError = validate(data, {
      type: "register"
    });
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return; 
    }
    try {
      const response = await axios.post("/auth/register", data, {
        withCredentials: true
      });
      setAuth(response.data);
      notify("success", "Your account has been created.");
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    if(error){
      notify("error", error);
      setError("");
    }
  }, [error, notify]);

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
