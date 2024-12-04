import React, { useState, useEffect } from 'react';
import { getPatientBills } from '../../services/api/patient/patientAPI';
import 'bootstrap/dist/css/bootstrap.min.css';
import {FaClipboardList} from 'react-icons/fa'

const PatientBilling = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); 
  const [sortOrderAsc, setSortOrderAsc] = useState(true);

  const fetchBills = async () => {
    try {
      const fetchedBills = await getPatientBills();
      setBills(fetchedBills);
      setFilteredBills(fetchedBills);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  const formatDateTimeForDisplay = (date) => {
    return new Date(date).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const handleSortToggle = () => {
    setSortOrderAsc(!sortOrderAsc);
    setFilteredBills((prevBills) =>
      [...prevBills].sort((a, b) => {
        const dateA = new Date(a.billingDate);
        const dateB = new Date(b.billingDate);
        return sortOrderAsc ? dateB - dateA : dateA - dateB;
      })
    );
  };

  useEffect(() => {
    const filtered = statusFilter
      ? bills.filter((bill) => bill.status === statusFilter)
      : bills;
    setFilteredBills(filtered);
    setCurrentPage(1);
  }, [statusFilter, bills]);

  useEffect(() => {
    fetchBills();
  }, []);

  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBills = filteredBills.slice(startIndex, startIndex + itemsPerPage);


  return (
    <div className="container text-dark ">
      <h2 className="my-4"><FaClipboardList className='me-3'/>My Bills</h2>
      <hr class="border border-dark border-1 opacity-100"></hr>

      <div className="row mb-3">
        <div className="col-md-12 text-start">
          <div className="btn-group ">
            <button
              className={`btn me-2 btn-outline-dark rounded-pill fst-italic  ${!statusFilter ? 'active' : ''}`}
              onClick={() => setStatusFilter('')}
            >
              All
            </button>
            <button
              className={`btn me-2 btn-outline-dark rounded-pill fst-italic ${statusFilter === 'Pending' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Pending')}
            >
              Pending
            </button>
            <button
              className={`btn me-2 btn-outline-dark rounded-pill fst-italic ${statusFilter === 'Paid' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Paid')}
            >
              Paid
            </button>
          </div>
          <button
            className="btn btn-outline-dark rounded-pill float-end fst-italic"
            onClick={handleSortToggle}
            title={`Sort by Date (${sortOrderAsc ? 'Descending' : 'Ascending'})`}
          >
            Sort by Date {sortOrderAsc ? '↓' : '↑'}
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-borderless table-hover ">
          <thead className='table-group-divider'>
            <tr>
              <th>Billing ID</th>
              <th>Doctor ID</th>
              <th>Doctor Name</th>
              <th>Consultation Fee</th>
              <th>Tests Price</th>
              <th>Meds Price</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBills.length > 0 ? (
              paginatedBills.map((bill) => (
                <tr key={bill.billingID}>
                  <td>{bill.billingID}</td>
                  <td>{bill.doctorID}</td>
                  <td>{bill.doctorName}</td>
                  <td>{bill.consultationFee.toFixed(2)}</td>
                  <td>{bill.totalTestsPrice.toFixed(2)}</td>
                  <td>{bill.totalMedicationsPrice.toFixed(2)}</td>
                  <td>{bill.grandTotal.toFixed(2)}</td>
                  <td>{formatDateTimeForDisplay(bill.billingDate)}</td>
                  <td>{bill.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No bills found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <hr class="border border-dark border-1 opacity-100"></hr>

      {filteredBills.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className='fst-italic'>
            Page {currentPage} of {totalPages}
          </span>
          <div>
            <button
              className="btn btn-outline-dark me-2 fst-italic rounded-pill"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="btn btn-outline-dark fst-italic rounded-pill"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientBilling;
