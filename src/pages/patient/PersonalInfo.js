import React, { useState, useEffect } from 'react';
import {
  getPersonalInfo,
  updatePersonalInfo,
  checkUsernameAvailability,
} from '../../services/api/patient/patientAPI';
import {  FaUserCircle} from 'react-icons/fa'
import validator from 'validator';

const PersonalInfo = () => {
  const [personalInfo, setPersonalInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState('');
  const [usernameMessageType, setUsernameMessageType] = useState('');
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [errors, setErrors] = useState({ email: '', contactNumber: '' });

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const info = await getPersonalInfo();
        setPersonalInfo(info);
      } catch (error) {
        console.error('Error fetching personal info:', error);
      }
    };

    fetchPersonalInfo();
  }, []);

  const validateEmail = (email) => {
    return validator.isEmail(email) ? '' : 'Invalid email format.';
  };
  const validateContactNumber = (contactNumber) => {
    const isNumeric = /^\d+$/.test(contactNumber);
    return isNumeric && contactNumber.length === 10
      ? ''
      : 'Phone number must be 10 digits.';
  };


  const handleUpdate = async () => {
    const emailError = validateEmail(personalInfo.email);
    const contactNumberError = validateContactNumber(personalInfo.contactNumber);

    if (emailError || contactNumberError) {
      setErrors({ email: emailError, contactNumber: contactNumberError });
      return;
    }
    try {
      await updatePersonalInfo(personalInfo);
      setAlert({ message: 'Personal info updated successfully!', type: 'success' });
      setEditMode(false);
      window.scrollTo(0, 0);
      setTimeout(() => {
        setAlert({ message: '', type: '' });
      }, 3000);
    } catch (error) {
      setAlert({ message: 'Failed to update personal info.', type: 'danger' });
      setTimeout(() => {
        setAlert({ message: '', type: '' });
      }, 3000);
      console.error('Error updating personal info:', error);
    }
  };

  const handleCheckUsername = async () => {
    console.log('Checking username availability:', personalInfo.username); 
    try {
      const response = await checkUsernameAvailability(personalInfo.username);
      console.log('Username Availability Response:', response); 

      const { isAvailable, message } = response; 
      setUsernameMessage(message);
      setUsernameMessageType(isAvailable ? 'success' : 'danger');

      setTimeout(() => {
        setUsernameMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error checking username availability:', error);
      setUsernameMessage('Error checking username availability.');
      setUsernameMessageType('danger');

      setTimeout(() => {
        setUsernameMessage('');
      }, 2000);
    }
  };

  if (!personalInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4 text-dark">
      <h2 className="mb-4"><FaUserCircle className='me-3 '/> Personal Info</h2>
      <hr class="border border-dark border-1 opacity-100"></hr>


      {alert.message && (
        <div
          className={`alert alert-${alert.type} alert-dismissible fade show`}
          role="alert"
        >
          {alert.message}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setAlert({ message: '', type: '' })}
          ></button>
        </div>
      )}

      {editMode ? (
        <form className="row g-3">

          <div className="col-md-6">
            <label className="form-label h6">Username</label>
            <input
              type="text"
              className="form-control text-dark bg-light border-dark"
              value={personalInfo.username}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, username: e.target.value })
              }
            />
            <button
              type="button"
              className="btn btn-dark mt-2 fst-italic rounded-pill"
              onClick={handleCheckUsername}
            >
              Check Availability
            </button>
            {usernameMessage && (
              <div className={`mt-2 text-${usernameMessageType}`}>
                <small>{usernameMessage}</small>
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label h6 ">Full Name</label>
            <input
              type="text"
              className="form-control text-dark bg-light border-dark"
              value={personalInfo.fullName}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, fullName: e.target.value })
              }
            />
          </div>

          <div className="col-md-6">
            <label className="form-label h6">Email</label>
            <input
              type="email"
              className="form-control text-dark bg-light border-dark"
              value={personalInfo.email}
              onChange={(e) =>{
                const email = e.target.value;
                setPersonalInfo({ ...personalInfo, email});
                setErrors({ ...errors, email: validateEmail(email) });

              }}
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label h6">Contact Number</label>
            <input
              type="text"
              className="form-control text-dark bg-light border-dark"
              value={personalInfo.contactNumber}
              onChange={(e) => {
                const contactNumber = e.target.value;
                setPersonalInfo({ ...personalInfo, contactNumber });
                setErrors({ ...errors, contactNumber: validateContactNumber(contactNumber) });
              }}
            />
            {errors.contactNumber && (
              <div className="text-danger">{errors.contactNumber}</div>
            )}
          </div>

          <div className="col-12">
            <label className="form-label h6">Address</label>
            <textarea
              className="form-control text-dark bg-light border-dark"
              value={personalInfo.address}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, address: e.target.value })
              }
            ></textarea>
          </div>

          <div className="col-md-6">
            <label className="form-label h6 ">Gender</label>
            <select
              className="form-select text-dark bg-light border-dark"
              value={personalInfo.gender}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, gender: e.target.value })
              }
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label h6 ">Date of Birth</label>
            <input
              type="date"
              className="form-control text-dark bg-light border-dark"
              value={personalInfo.dateOfBirth}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })
              }
            />
          </div>
          <hr class="border border-dark border-1 opacity-100"></hr>

          <div className="col-12 mt-3">
            <button
              type="button"
              className="btn btn-danger me-2 fst-italic rounded-pill"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-success fst-italic rounded-pill"
              onClick={handleUpdate}
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <table className="table table-striped table-borderless table-hover">
          <tbody className='table align-middle'>
            <tr>
              <th>Username</th>
              <td>{personalInfo.username}</td>
            </tr>
            <tr>
              <th>Full Name</th>
              <td>{personalInfo.fullName}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{personalInfo.email}</td>
            </tr>
            <tr>
              <th>Contact Number</th>
              <td>{personalInfo.contactNumber}</td>
            </tr>
            <tr>
              <th>Address</th>
              <td>{personalInfo.address}</td>
            </tr>
            <tr>
              <th>Gender</th>
              <td>{personalInfo.gender}</td>
            </tr>
            <tr>
              <th>Date of Birth</th>
              <td>{personalInfo.dateOfBirth?.split('T')[0]}</td>
            </tr>
          </tbody>
        </table>
      )}

      <hr class="border border-dark border-1 opacity-100"></hr>


      {!editMode && (
        <button
          className="btn btn-dark mt-3 fst-italic rounded-pill"
          onClick={() => setEditMode(true)}
        >
          Update Info
        </button>
      )}
    </div>
  );
};

export default PersonalInfo;
