import React from "react";
import { Link } from "react-router-dom";
const Login = () => {
  return (
    <div className="page sign-in">
      <div className="container">
        <h1>Welcome Back</h1>
        <span>Enter your credentials correctly to log in.</span>
        <form>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="username"
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
            Not register yet? <Link to="/sign-up">Sign up</Link>
          </span>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
