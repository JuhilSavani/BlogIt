import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLogout from "../utils/hooks/useLogout";
import useNotify from "../utils/hooks/useNotify";
import useAuth from "../utils/hooks/useAuth";

const Slider = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const { auth } = useAuth();
  const logout = useLogout();
  const notify = useNotify();

  const toggleSlider = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      notify("success", "Logged out! See you next time!");
      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    if (error) {
      notify("error", error);
      setError("");
    }
  }, [error, notify]);


  if (!auth?.accessToken) return null;

  return (
    <div className={`slider ${isOpen ? "open" : ""}`} onClick={toggleSlider}>
      <button className="slider-btn">
        <i className="bx bxs-left-arrow"></i>
      </button>
      <ul>
        <li>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Slider;
