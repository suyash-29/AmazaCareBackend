import React from 'react';
import ManageBilling from "./ManageBilling"
import { LiaPrayingHandsSolid } from "react-icons/lia";


const AdminDashboard = () => {
  return (
    <div className="container mt-5">
      <h2 className=' text-center'><LiaPrayingHandsSolid className='me-2'/>Welcome to Admin Dashboard</h2>
      <ManageBilling />
    </div>
  );
};

export default AdminDashboard;
