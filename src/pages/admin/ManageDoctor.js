import React, { useState, useEffect } from "react";
import { Form, Button, Table, Badge, Alert, Spinner } from "react-bootstrap";
import { getDoctorDetails, updateDoctor, deleteDoctor, getAllSpecializations } from "../../services/api/admin/adminAPI";
import { FaUsers } from "react-icons/fa";
import validator from "validator";

const ManageDoctor = () => {
  const [doctorId, setDoctorId] = useState("");
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatedDoctor, setUpdatedDoctor] = useState({});
  const [specializations, setSpecializations] = useState([]);
  const [availableSpecializations, setAvailableSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [errors, setErrors] = useState({ email: "" });

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await getAllSpecializations();
        setAvailableSpecializations(response);
        console.log("Available Specializations:", response); 
      } catch (error) {
        console.error("Error fetching specializations:", error);
        setAlertMessage("Failed to load specializations.");
        setAlertType("danger");
      }finally{
        setTimeout(() => {setAlertMessage("");}, 3000);
      }
    };

    fetchSpecializations();
  }, []);

  const fetchDoctorDetails = async () => {
    setLoading(true);
    try {
      const response = await getDoctorDetails(doctorId);
      setDoctorDetails(response);
      setUpdatedDoctor({
        fullName: response.fullName,
        email: response.email,
        experienceYears: response.experienceYears,
        qualification: response.qualification,
        designation: response.designation,
      });
      setSpecializations(response.doctorSpecializations.map((ds) => ({
        id: ds.specialization.specializationID,
        name: ds.specialization.specializationName,
      })));
      setIsEditing(false);
      console.log("Doctor Details:", response);
    } catch (error) {
      console.error(error);
      setAlertMessage("Failed to fetch doctor details.");
      setAlertType("danger");
    } finally {
      setLoading(false);
      setTimeout(() => {setAlertMessage("");}, 3000);

    }
  };
  const validateEmail = (email) => {
    if (!validator.isEmail(email)) {
      return "Invalid email format.";
    }
    return "";
  };
  const handleUpdateDoctor = async () => {
    const emailError = validateEmail(updatedDoctor.email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...updatedDoctor,
        specializationIds: specializations.map((s) => s.id),
      };
      console.log("Outgoing Packet (Update):", payload); 
      const response = await updateDoctor(doctorDetails.doctorID, payload);
      setAlertMessage("Doctor updated successfully.");
      setAlertType("success");
      setTimeout(() => {
        setAlertMessage("");
        setIsEditing(false);
      }, 3000);
      console.log("Response:", response);
      window.scrollTo(0, 0); 
    } catch (error) {
      console.error(error);
      setAlertMessage("Failed to update doctor.");
      setAlertType("danger");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async () => {
    setLoading(true);
    try {
      console.log("Outgoing Packet (Delete):", { userId: doctorDetails.userID, doctorId: doctorDetails.doctorID });
      const response = await deleteDoctor(doctorDetails.userID, doctorDetails.doctorID);
      setAlertMessage("Doctor deleted successfully.");
      setAlertType("success");
      setTimeout(() => {setAlertMessage("");}, 3000);
      console.log("Response:", response);
      setDoctorDetails(null);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error(error);
      setAlertMessage("Failed to delete doctor.");
      setAlertType("danger");
    } finally {
      setLoading(false);
    }
  };

  const addSpecialization = () => {
    if (
      selectedSpecialization &&
      !specializations.some((s) => s.id === selectedSpecialization.id)
    ) {
      setSpecializations([...specializations, selectedSpecialization]);
    }
  };

  const removeSpecialization = (id) => {
    setSpecializations(specializations.filter((s) => s.id !== id));
  };

  return (
    <div className="container-fluid  text-dark  min-vh-100 py-5">
      <h2 className="text-dark"><FaUsers className="me-3"/>Manage Doctors</h2>
      <hr class="border border-dark border-1 opacity-100"></hr>


      {alertMessage && (
        <Alert variant={alertType} className="mt-3">
          {alertMessage}
        </Alert>
      )}

      <Form.Group className="mb-3">
        <Form.Label className="h5">Enter Doctor ID</Form.Label>
        <div className="d-flex">
          <Form.Control
            type="text"
            className="w-75 bg-light text-dark border-dark-subtle rounded-5"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
          />
          <Button variant="dark" className="ms-2 rounded-pill fst-italic align-end" onClick={fetchDoctorDetails} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Get Details"}
          </Button>
        </div>
      </Form.Group>
      <hr class="border border-dark border-1 opacity-100"></hr>


      {doctorDetails && (
        <>
          <Table striped borderless hover className="mt-4">
            <tbody>
              <tr>
                <th className="text-dark">Full Name</th>
                <td>{isEditing ? (
                  <Form.Control
                    type="text"
                    value={updatedDoctor.fullName}
                    className="text-dark bg-light border-dark-subtle"
                    onChange={(e) =>
                      setUpdatedDoctor({ ...updatedDoctor, fullName: e.target.value })
                    }
                  />
                ) : (
                  doctorDetails.fullName
                )}</td>
              </tr>
              <tr>
                <th className="text-dark">Email</th>
                <td>{isEditing ? (
                  <>
                  <Form.Control
                    type="email"
                    className={`text-dark bg-light border-dark-subtle ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    value={updatedDoctor.email}
                    onChange={(e) => {
                      const email = e.target.value;
                      setUpdatedDoctor({ ...updatedDoctor, email });
                      setErrors({ ...errors, email: validateEmail(email) });
                    }}
                  />
                   {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                  </>
                ) : (
                  doctorDetails.email
                )}</td>
              </tr>
              <tr>
                <th className="text-dark">Experience Years</th>
                <td>{isEditing ? (
                  <Form.Control
                    type="number"
                    className="text-dark bg-light border-dark-subtle"
                    value={updatedDoctor.experienceYears}
                    onChange={(e) =>
                      setUpdatedDoctor({ ...updatedDoctor, experienceYears: e.target.value })
                    }
                  />
                ) : (
                  doctorDetails.experienceYears
                )}</td>
              </tr>
              <tr>
                <th className="text-dark">Qualification</th>
                <td>{isEditing ? (
                  <Form.Control
                    type="text"
                    className="text-dark bg-light border-dark-subtle"
                    value={updatedDoctor.qualification}
                    onChange={(e) =>
                      setUpdatedDoctor({ ...updatedDoctor, qualification: e.target.value })
                    }
                  />
                ) : (
                  doctorDetails.qualification
                )}</td>
              </tr>
              <tr>
                <th className="text-dark">Designation</th>
                <td>{isEditing ? (
                  <Form.Control
                    type="text"
                    className="text-dark bg-light border-dark-subtle"
                    value={updatedDoctor.designation}
                    onChange={(e) =>
                      setUpdatedDoctor({ ...updatedDoctor, designation: e.target.value })
                    }
                  />
                ) : (
                  doctorDetails.designation
                )}</td>
              </tr>
              <tr>
                <th className="text-dark">Specializations</th>
                <td>
                  {specializations.map((spec, index) => (
                    <Badge key={index} pill bg="dark" className="me-2 text-light">
                      {spec.name}{" "}
                      {isEditing && (
                        <Button
                          variant="link"
                          className="text-white p-0"
                          onClick={() => removeSpecialization(spec.id)}
                        >
                          &times;
                        </Button>
                      )}
                    </Badge>
                  ))}
                  {isEditing && (
                    <div className="d-flex mt-2">
                      <Form.Select onChange={(e) => setSelectedSpecialization({
                        id: e.target.value,
                        name: e.target.options[e.target.selectedIndex].text
                      })}>
                        <option value="">Select Specialization</option>
                        {availableSpecializations.map((spec) => (
                          <option key={spec.specializationID} value={spec.specializationID}>
                            {spec.specializationName}
                          </option>
                        ))}
                      </Form.Select>
                      <Button variant="dark" className="ms-2" onClick={addSpecialization}>
                        Add
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </Table>
          <hr class="border border-dark border-1 opacity-100"></hr>

          <div className="d-flex justify-content-between mt-4">
            {isEditing ? (
              <>
                <Button variant="success" className="fst-italic rounded-pill" onClick={handleUpdateDoctor} disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : "Save Changes"}
                </Button>
                <Button variant="secondary" className="fst-italic rounded-pill" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button variant="warning" className="fst-italic rounded-pill" onClick={() => setIsEditing(true)}>
                  Edit Details
                </Button>
                <Button variant="danger" className="fst-italic rounded-pill"  onClick={handleDeleteDoctor} disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : "Delete Doctor"}
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageDoctor;
