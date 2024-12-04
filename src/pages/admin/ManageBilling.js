import React, { useEffect, useState } from 'react';
import { getBillingDetails, markBillAsPaid } from '../../services/api/admin/adminAPI';
import { Alert, Button, Form, Table } from 'react-bootstrap';
import { HiClipboardDocumentList } from "react-icons/hi2";

const ManageBilling = () => {
  const [billingData, setBillingData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [alertMessage, setAlertMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrderAsc, setSortOrderAsc] = useState(true);
  const pageSize = 5; 

  useEffect(() => {
    fetchBillingDetails();
  }, []);

  useEffect(() => {
    console.log('Filtered data:', filteredData);
  }, [filteredData]);

  useEffect(() => {
    handleSearch();
  }, [searchName, filterStatus, startDate, endDate]);

  const fetchBillingDetails = async () => {
    try {
      const response = await getBillingDetails();
      setBillingData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error('Error fetching billing details:', error);
    }
  };

  const handleSearch = () => {
    let filtered = billingData;

    if (searchName) {
      filtered = filtered.filter(
        (bill) =>
          (bill.patientName &&
            bill.patientName.toLowerCase().includes(searchName.toLowerCase())) ||
          (bill.doctorName &&
            bill.doctorName.toLowerCase().includes(searchName.toLowerCase()))
      );
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setAlertMessage('End date must be after start date.');
      return;
    }
    
     if (startDate && endDate) {
      filtered = filtered.filter((bill) => {
        const billDate = new Date(bill.billingDate);
        return billDate >= new Date(startDate) && billDate <= new Date(endDate);
      });
    }

    if (filterStatus !== 'All') {
      filtered = filtered.filter((bill) => bill.status === filterStatus);
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleSortToggle = () => {
    setSortOrderAsc(!sortOrderAsc);
    setFilteredData((prevData) =>
      [...prevData].sort((a, b) => {
        const dateA = new Date(a.billingDate);
        const dateB = new Date(b.billingDate);
        return sortOrderAsc ? dateA - dateB : dateB - dateA;
      })
    );
  };

  const handleMarkAsPaid = async (billingId) => {
    try {
      await markBillAsPaid(billingId);
      setAlertMessage('Bill marked as paid successfully!');
      fetchBillingDetails();
      window.scrollTo(0, 0);
    } catch (error) {
      setAlertMessage('Failed to mark bill as paid.');
      console.error('Error marking bill as paid:', error);
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

  useEffect(() => {
    const timer = setTimeout(() => setAlertMessage(''), 3000);
    return () => clearTimeout(timer);
  }, [alertMessage]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="manage-billing min-vh-100 text-dark container-fluid ">
      <h2 className='mb-2'><HiClipboardDocumentList className='me-3'/>Manage Billing</h2>
      {alertMessage && <Alert variant="info">{alertMessage}</Alert>}
      <hr class="border border-dark border-1 opacity-100"></hr>

      <div className="search-filters d-flex flex-column  mb-3">
        <div className="search-fields d-flex flex-column mb-2">
          <Form.Control
            type="text"
            placeholder="Search by Patient or Doctor Name"
            className="rounded-pill bg-light text-dark border-dark w-100 me-2"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <div className="d-flex mt-2">
            <Form.Control
              type="date"
              className="rounded-pill bg-light text-dark border-dark me-2"
              value={startDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Form.Control
              type="date"
              className="rounded-pill bg-light text-dark border-dark"
              value={endDate}
              min={startDate} 
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="filter-sort-buttons d-flex align-items-center justify-content-between mb-2">
        <div className="filter-sort-buttons d-flex flex-wrap mb-2">
          <Button
            variant={filterStatus === 'All' ? 'dark' : 'outline-dark'}
            onClick={() => setFilterStatus('All')}
            className="me-1 rounded-pill fst-italic"
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'Paid' ? 'dark' : 'outline-dark'}
            onClick={() => setFilterStatus('Paid')}
            className="me-1 fst-italic rounded-pill"
          >
            Paid
          </Button>
          <Button
            variant={filterStatus === 'Pending' ? 'dark' : 'outline-dark'}
            onClick={() => setFilterStatus('Pending')}
            className=' fst-italic rounded-pill'
          >
            Pending
          </Button>
          </div>
          <button
            onClick={handleSortToggle}
            className="btn btn-outline-dark fst-italic rounded-pill"
            title={`Sort by Date (${sortOrderAsc ? 'Ascending' : 'Descending'})`}
          >
            Sort by Date {sortOrderAsc ? '↑' : '↓'}
          </button>
        </div>
      </div>

      <Table striped bordereless hover responsive>
        <thead className='table-group-divider'>
          <tr>
            <th>Bill ID</th>
            <th>Patient ID</th>
            <th>Patient Name</th>
            <th>Dr ID</th>
            <th>Dr Name</th>
            <th>Consultation Fee</th>
            <th>Tests Price</th>
            <th>Meds Price</th>
            <th>Total</th>
            <th>Date</th>
            <th>Status</th>
            {filterStatus === 'Pending' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((bill) => (
            <tr key={bill.billingID}>
              <td>{bill.billingID}</td>
              <td>{bill.patientID}</td>
              <td>{bill.patientName}</td>
              <td>{bill.doctorID}</td>
              <td>{bill.doctorName}</td>
              <td>{bill.consultationFee}</td>
              <td>{bill.totalTestsPrice}</td>
              <td>{bill.totalMedicationsPrice}</td>
              <td>{bill.grandTotal}</td>
              <td>{formatDateTimeForDisplay(bill.billingDate)}</td>
              <td>{bill.status}</td>
              {filterStatus === 'Pending' && (
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    className='rounded-pill text-light fst-italic'
                    onClick={() => handleMarkAsPaid(bill.billingID)}
                  >
                    Mark as Paid
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
      <hr class="border border-dark border-1 opacity-100"></hr>

      {filteredData.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className='text-dark fst-italic'> 
            Page {currentPage} of {totalPages}
          </span>
          <div>
            <button
              className="btn btn-outline-dark me-2 rounded-pill fst-italic"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="btn btn-outline-dark rounded-pill fst-italic"
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

export default ManageBilling;
