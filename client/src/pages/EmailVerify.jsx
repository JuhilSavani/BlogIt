import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../utils/hooks/useAuth";
import axios from "../utils/apis/axios";
import useNotify from "../utils/hooks/useNotify";

const EmailVerify = () => {
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { email } = useParams();

  const notify = useNotify();
  const { auth, setAuth } = useAuth();

  const registerUser = async (data) => {
    return await axios.post("/authorize/register", data, {
      withCredentials: true,
    });
  };

  // console.log(auth);
  
  const handleVerify = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    try {
      if(!data.verificationCode){
        notify("error", "Verification code is required.");
        setIsLoading(false);
        return;
      }

      if(parseInt(data.verificationCode) !== parseInt(auth.verificationCode)){
        notify("error", "Invalid verification code.");
        setIsLoading(false);
        return;
      }
      const response = await registerUser(auth.userData);
      const from = auth.from;
      setAuth(response.data);
      notify("success", "Registration successful!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResend = async (event) => {
    event.preventDefault();
    setIsSending(true);
    try {
      const { data } =  await axios.post(`/verify/${email}`);
      setAuth((prevAuth) => ({ ...prevAuth, verificationCode: data.verificationCode }));
      notify("success", "Verification code sent to your email.");
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="page verify">
      <div className="container">
        <span><i className='bx bxs-envelope'></i></span>
        <h1>Verify your email address</h1>
        <p>Please check your inbox for a verification email.</p>
        <p>If you haven&apos;t received it, you can request a new one.</p>
        <form className="verify-form" onSubmit={handleVerify}>
          <label htmlFor="verificationCode">Enter Verification Code:</label>
          <input type="text" id="verificationCode" name="verificationCode" placeholder="..." />
          <button type="submit" className="verify-btn">{ isLoading ? "Verifying" : "Verify" }</button>
        </form>

        <div className="resend">
          <p>If you did not receive the email, click the button below to resend the verification email.</p>
          <button className="resend-btn" onClick={handleResend}>{ isSending ? "Sending" : "Resend" }</button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
