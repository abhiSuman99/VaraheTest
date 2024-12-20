import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { mockEmployees } from "../MockData/PrevEmployeeMockData";

const validationSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  phone: yup
    .string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  aadhaar: yup
    .string()
    .matches(/^\d{12}$/, "Aadhaar must be 12 digits")
    .required("Aadhaar is required"),
  pan: yup
    .string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN format")
    .required("PAN is required"),
  bankAccount: yup
    .string()
    .matches(/^\d{9,18}$/, "Bank account must be 9-18 digits")
    .required("Bank Account is required"),
  bankName: yup.string().required("Bank Name is required"),
  ifsc: yup
    .string()
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code")
    .required("IFSC Code is required"),
});

const OnboardingForm = () => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [existingEmployee, setExistingEmployee] = useState(null);
  const [updateFields, setUpdateFields] = useState([]);
  const [notification, setNotification] = useState("");
  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [aadhaarBack, setAadhaarBack] = useState(null);
  const [panPhoto, setPanPhoto] = useState(null);
  const [passBookPhoto, setPassBookPhoto] = useState(null);

  const generateEmployeeId = () => `EMP${Date.now()}`;

  const onSubmit = (data) => {
    const matchedEmployee = mockEmployees.find(
      (emp) => emp.aadhaar === data.aadhaar
    );

    if (matchedEmployee) {
      // Check for mismatched fields
      const mismatchedFields = [];
      for (const key in matchedEmployee) {
        if (
          key !== "employeeId" &&
          key !== "aadhaarFront" &&
          key !== "aadhaarBack" &&
          key !== "panPhoto" &&
          key !== "passBookPhoto" &&
          matchedEmployee[key] !== data[key]
        ) {
          mismatchedFields.push(key);
        }
      }

      if (mismatchedFields.length > 0) {
        setExistingEmployee(matchedEmployee);
        setUpdateFields(mismatchedFields);
        alert(
          `You already exist in our database, The following fields do not match our records: ${mismatchedFields.join(
            ", "
          )}. Please review and submit again.`
        );
      } else {
        alert(
          `WELCOME! Your Employee ID is: ${matchedEmployee.employeeId}.`
        );
        // Reset state after successful submission
        setExistingEmployee(null);
        setUpdateFields([]);
        reset(); // Reset form
        setAadhaarFront(null);
        setAadhaarBack(null);
        setPanPhoto(null);
        setPassBookPhoto(null);
        setNotification("Employee details updated successfully.");
      }
    } else {
      const newEmployeeId = generateEmployeeId();
      const newEmployee = {
        ...data,
        employeeId: newEmployeeId,
        aadhaarFront: aadhaarFront || "https://via.placeholder.com/150?text=Aadhaar+Front+10",
        aadhaarBack: aadhaarBack || "https://via.placeholder.com/150?text=Aadhaar+Back+10",
        panPhoto: panPhoto || "https://via.placeholder.com/150?text=PAN+10",
        passBookPhoto: passBookPhoto || "https://via.placeholder.com/150?text=Passbook+10",
      };
      mockEmployees.push(newEmployee);

      setNotification(`New employee onboarded with ID: ${newEmployeeId}`);
      // Reset state after successful submission
      setExistingEmployee(null);
      setUpdateFields([]);
      reset(); // Reset form
      setAadhaarFront(null);
      setAadhaarBack(null);
      setPanPhoto(null);
      setPassBookPhoto(null);
      alert(`New employee onboarded with ID: ${newEmployeeId}`);
    }
  };

  // Handle file uploads for images
  const handleImageUpload = (event, setImage) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Show preview of the uploaded file
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Employee Onboarding Form</h2>

      {notification && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4">
          {notification}
        </div>
      )}

      {existingEmployee && (
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded mb-4">
          <p>
            Existing Employee Found! Employee ID:{" "}
            <span className="font-bold">{existingEmployee.employeeId}</span>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block font-medium">First Name:</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2"
            {...register("firstName")}
          />
          <p className="text-red-500 text-sm">{errors.firstName?.message}</p>
        </div>

        <div className="mb-4">
          <label className="block font-medium">Last Name:</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2"
            {...register("lastName")}
          />
          <p className="text-red-500 text-sm">{errors.lastName?.message}</p>
        </div>

        <div className="mb-4">
          <label className="block font-medium">Phone:</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2"
            {...register("phone")}
          />
          <p className="text-red-500 text-sm">{errors.phone?.message}</p>
        </div>

        <div className="mb-4">
          <label className="block font-medium">Email:</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2"
            {...register("email")}
          />
          <p className="text-red-500 text-sm">{errors.email?.message}</p>
        </div>

        <div className="mb-4">
          <label className="block font-medium">Aadhaar:</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2"
            {...register("aadhaar")}
          />
          <p className="text-red-500 text-sm">{errors.aadhaar?.message}</p>
        </div>

        <div className="mb-4">
          <label className="block font-medium">PAN:</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2"
            {...register("pan")}
          />
          <p className="text-red-500 text-sm">{errors.pan?.message}</p>
        </div>

        <div className="mb-4">
          <label className="block font-medium">Bank Account:</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2"
            {...register("bankAccount")}
          />
          <p className="text-red-500 text-sm">{errors.bankAccount?.message}</p>
        </div>

        <div className="mb-4">
          <label className="block font-medium">Bank Name:</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2"
            {...register("bankName")}
          />
          <p className="text-red-500 text-sm">{errors.bankName?.message}</p>
        </div>

        <div className="mb-4">
          <label className="block font-medium">IFSC Code:</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2"
            {...register("ifsc")}
          />
          <p className="text-red-500 text-sm">{errors.ifsc?.message}</p>
        </div>

        {/* Image Upload Fields */}
        <div className="mb-4">
          <label className="block font-medium">Aadhaar Front:</label>
          <input
            type="file"
            className="w-full border border-gray-300 rounded px-3 py-2"
            onChange={(e) => handleImageUpload(e, setAadhaarFront)}
          />
          {aadhaarFront && (
            <img src={aadhaarFront} alt="Aadhaar Front" className="mt-2" width={150} />
          )}
        </div>

        <div className="mb-4">
          <label className="block font-medium">Aadhaar Back:</label>
          <input
            type="file"
            className="w-full border border-gray-300 rounded px-3 py-2"
            onChange={(e) => handleImageUpload(e, setAadhaarBack)}
          />
          {aadhaarBack && (
            <img src={aadhaarBack} alt="Aadhaar Back" className="mt-2" width={150} />
          )}
        </div>

        <div className="mb-4">
          <label className="block font-medium">PAN:</label>
          <input
            type="file"
            className="w-full border border-gray-300 rounded px-3 py-2"
            onChange={(e) => handleImageUpload(e, setPanPhoto)}
          />
          {panPhoto && <img src={panPhoto} alt="PAN Photo" className="mt-2" width={150} />}
        </div>

        <div className="mb-4">
          <label className="block font-medium">Passbook:</label>
          <input
            type="file"
            className="w-full border border-gray-300 rounded px-3 py-2"
            onChange={(e) => handleImageUpload(e, setPassBookPhoto)}
          />
          {passBookPhoto && (
            <img src={passBookPhoto} alt="Passbook Photo" className="mt-2" width={150} />
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default OnboardingForm;
