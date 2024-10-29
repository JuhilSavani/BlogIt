import React from "react";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="page sign-up">
      <div className="container">
        <h1>Hello, There!</h1>
        <span>Fill out this form to create your account.</span>
        <form>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="username"
            required
          />
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="email"
            required
          />
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="password"
            required
          />
          <span>
            Already have an account? <Link to="/sign-in">Sign in</Link>
          </span>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
