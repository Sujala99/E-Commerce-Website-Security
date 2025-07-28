import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { useSnackbar } from 'notistack';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const handleSendOtp = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/forgot-password', { email });
      if (res.data.success) {
        enqueueSnackbar('OTP sent to your email!', { variant: 'success' });
        localStorage.setItem('resetEmail', email);
        history.push('/verify-otp');
      } else {
        enqueueSnackbar(res.data.error || 'Failed to send OTP', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your registered email"
        className="w-full p-2 border rounded mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSendOtp} className="bg-black text-white w-full py-2 rounded">
        Send OTP
      </button>
    </div>
  );
};

export default ForgotPassword;
