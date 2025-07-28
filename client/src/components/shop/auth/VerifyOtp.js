import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { useSnackbar } from 'notistack';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const email = localStorage.getItem('resetEmail');

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/verify-otp', { email, otp });
      if (res.data.success) {
        enqueueSnackbar('OTP verified!', { variant: 'success' });
        history.push('/reset-password');
      } else {
        enqueueSnackbar(res.data.error || 'Invalid OTP', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Verify OTP</h2>
      <input
        type="text"
        placeholder="Enter 5-digit OTP"
        className="w-full p-2 border rounded mb-4"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        maxLength={5}
      />
      <button onClick={handleVerifyOtp} className="bg-black text-white w-full py-2 rounded">
        Verify OTP
      </button>
    </div>
  );
};

export default VerifyOtp;
