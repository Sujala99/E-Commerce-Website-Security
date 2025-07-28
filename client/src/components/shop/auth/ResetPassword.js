import React, { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useHistory } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const email = localStorage.getItem('resetEmail');

  const handleResetPassword = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/reset-password', {
        email,
        otp,
        newPassword
      });
      if (res.data.success) {
        enqueueSnackbar('Password reset successfully!', { variant: 'success' });
        localStorage.removeItem('resetEmail');
        history.push('/login');
      } else {
        enqueueSnackbar(res.data.error || 'Failed to reset password', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
      <input
        type="text"
        placeholder="Enter OTP again"
        className="w-full p-2 border rounded mb-4"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter new password"
        className="w-full p-2 border rounded mb-4"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleResetPassword} className="bg-black text-white w-full py-2 rounded">
        Reset Password
      </button>
    </div>
  );
};

export default ResetPassword;
