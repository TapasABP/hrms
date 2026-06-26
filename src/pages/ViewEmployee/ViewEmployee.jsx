import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { MAIN_API_URL } from "../../constants/global-variables";
import axios from "axios";
import { DEPARTMENTS } from "../../contstants/application";
import { toast, ToastContainer } from "react-toastify";

const ViewEmployee = () => {
  const [searchParams] = useSearchParams();
  const empCode = searchParams.get("empcode");

  const userData = JSON.parse(localStorage.getItem("userData"));
  const token = userData?.token;
  const loggedIn = JSON.parse(localStorage.getItem("ZeroUserData") || "{}");

  const canEditPersonal = Number(loggedIn?.user?.user_type) !== 2001
  // Number(loggedIn?.user?.user_type) === 2001
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [employeeData, setEmployeeData] = useState({
    fullname: "",
    department: "",
    emp_code: "",
    joining_date: "",
    position: "",
    grade: "",
    work_level: "",
    confirmation_date: "",
    reporting_manager: "",
    manager_emp_code: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
    address: "",
    exit_date: "",
    id: "",
    pending_casual_leaves: 0,
    pending_sick_leaves: 0,
    pending_earned_leaves: 0,
    fy_casual_leaves: 0,
    fy_sick_leaves: 0,
    fy_earned_leaves: 0,
  });
  const [managerOptions, setManagerOptions] = useState([])
  const [exitDate, setExitDate] = useState("")
  console.log(employeeData, 'employeeData')
  const fetchEmployeesFromAPI = () => {

    let org_id = userData?.user?.org_id;
    axios
      .get(
        `${MAIN_API_URL}/fetch-employees-org-id/${org_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then((response) => {
        console.log(
          "Employees fetched:",
          response.data.data
        );
        // const data =
        //     response?.data;

        if (response.data.data) {
          let options = [];

          response.data.data.forEach((emp) => {
            options.push({
              id: emp.id,
              value: emp.fullname
            });
          });
          setManagerOptions(options);



        }
      })
      .catch((err) => {
        console.error(
          "Failed to fetch employees:",
          err
        );
      });
  };

  useEffect(() => {
    fetchEmployeesFromAPI();
  }, []);






  const handleDeleteEmployee = () => {
    axios
      .post(
        `${MAIN_API_URL}/employee/delete`,
        {
          "employee_id": employeeData?.id,
          "exit_date": employeeData?.exit_date
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then((response) => {
        console.log(
          "Employee deleted:",
          response.data
        );
        if (response.data.status) {
          toast.success(response.data.message || "Employee exited succesfully!")
          setTimeout(() => {
            navigate('/onboarding')
          }, 1600)
        } else {
          toast.warning(response.data.message)
        }

      })
      .catch((err) => {
        console.error(
          "Failed to fetch employees:",
          err
        );
        toast.error(err.response.data.message || "Something went wrong!")
      });
  }



  useEffect(() => {
    const fetchEmployee = () => {
      //actual fetch details api
      axios
        .post(
          `${MAIN_API_URL}/employee/details`,
          { empcode: empCode },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log("Employee details response:", response);

          if (response.data) {
            const data = response.data.employee;
            const leaveHistory = response.data.leave_master;

            //Checking whether the reporting_manager is "0", if so then get the details by manager_emp_code from /emp-details-code api,
            // otherwise just set the data
             if(data.reporting_manager == "0"){
               axios
              .post(
                `${MAIN_API_URL}/employee/emp-details-code`,
                {
                  "empcode": data.manager_emp_code
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              ).then((res) => {


                console.log(res.data.empdetails, 'manager details')
                //After getting the details of the manager take its id and call the update info api to make reporting_manager = this id, and after that set the values
                if (res.data.empdetails) {
                  // update this new details 
                  const payload = {
                    actor_email: userData?.user.email, 
                    actor_user_type: Number(userData?.user?.user_type),
                    employee_id: Number(data.id),
                    fullname: data.fullname,
                    department: Number(data.department), 
                    joining_date: data.joining_date || null,
                    position: data.position,
                    grade: data.grade,
                    work_level: data.work_level,
                    confirmation_date: data.confirmation_date || null,
                    reporting_manager: res.data.empdetails.id, //passing that id
                    manager_emp_code: data.manager_emp_code,
                    email: data.email,
                    mobile: data.mobile,
                    gender: data.gender,
                    dob: data.dob || null,
                    address: data.address,
                    exit_date: data.exit_date || null
                  };

                  // 2. Axios PUT submission
                  axios.post(`${MAIN_API_URL}/employees/update-personal-info`, payload, {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`
                    }
                  })
                    .then((response) => {
                      // alert("Employee details updated successfully!");
                      
                      console.log("Update Success Response:", response.data);
                      if(response.data){
                        //  const id = res.data.empdetails.id
                  
                  console.log(data, "Department value from API");
                  setEmployeeData({
                    id: data.id,
                    fullname: data.fullname || "",
                    department: data.department || "",
                    emp_code: data.emp_code || "",
                    joining_date: data.joining_date
                      ? String(data.joining_date).split("T")[0]
                      : "",
                    position: data.position || "",
                    grade: data.grade || "",
                    work_level: data.work_level || "",
                    confirmation_date: data.confirmation_date
                      ? String(data.confirmation_date).split("T")[0]
                      : "",
                    
                    reporting_manager : res.data.empdetails.id,
                    manager_emp_code: data.manager_emp_code || "",
                    email: data.email || "",
                    mobile: data.mobile || "",
                    gender: data.gender || "",
                    dob: data.dob ? String(data.dob).split("T")[0] : "",
                    address: data.address || "",
                    exit_date: data.exit_date
                      ? String(data.exit_date).split("T")[0]
                      : "",

                    pending_casual_leaves: leaveHistory.pending_casual_leaves || 0,
                    pending_sick_leaves: leaveHistory.pending_sick_leaves || 0,
                    pending_earned_leaves: leaveHistory.pending_earned_leaves || 0,
                    fy_casual_leaves: leaveHistory.fy_casual_leaves || 0,
                    fy_sick_leaves: leaveHistory.fy_sick_leaves || 0,
                    fy_earned_leaves: leaveHistory.fy_earned_leaves || 0,
                  });


                  setExitDate(data.exit_date
                    ? String(data.exit_date).split("T")[0]
                    : "")
                      }
                    })
                    .catch((err) => {
                      console.error("Error saving employee details:", err.response.data);
                      alert(err.response?.data?.error || "Failed to update employee information.");
                    });




                 
                }
              }).catch((err) => {
                console.log(err, 'error')
              })

             }else{
               setEmployeeData({
                    id: data.id,
                    fullname: data.fullname || "",
                    department: data.department || "",
                    emp_code: data.emp_code || "",
                    joining_date: data.joining_date
                      ? String(data.joining_date).split("T")[0]
                      : "",
                    position: data.position || "",
                    grade: data.grade || "",
                    work_level: data.work_level || "",
                    confirmation_date: data.confirmation_date
                      ? String(data.confirmation_date).split("T")[0]
                      : "",
                    // reporting_manager: data.reporting_manager == "0" ? id : data.reporting_manager,
                    reporting_manager : data.reporting_manager,
                    manager_emp_code: data.manager_emp_code || "",
                    email: data.email || "",
                    mobile: data.mobile || "",
                    gender: data.gender || "",
                    dob: data.dob ? String(data.dob).split("T")[0] : "",
                    address: data.address || "",
                    exit_date: data.exit_date
                      ? String(data.exit_date).split("T")[0]
                      : "",

                    pending_casual_leaves: leaveHistory.pending_casual_leaves || 0,
                    pending_sick_leaves: leaveHistory.pending_sick_leaves || 0,
                    pending_earned_leaves: leaveHistory.pending_earned_leaves || 0,
                    fy_casual_leaves: leaveHistory.fy_casual_leaves || 0,
                    fy_sick_leaves: leaveHistory.fy_sick_leaves || 0,
                    fy_earned_leaves: leaveHistory.fy_earned_leaves || 0,
                  });


                  setExitDate(data.exit_date
                    ? String(data.exit_date).split("T")[0]
                    : "")
             }










          }
        })
        .catch((err) => {
          console.error("Error fetching employee data:", err);
          const status = err.response?.status;
          let errorMsg =
            "Failed to load employee data: " +
            (err.response?.data?.error || err.message);

          if (status === 404 || err.message.includes("404")) {
            errorMsg +=
              "\n\nCheck browser console and server logs to verify if this employee email exists.";
          }
        })
        .then(() => {
          setLoading(false);
        });
    };

    if (empCode) {
      fetchEmployee();
    } else {
      setLoading(false);
    }
  }, [empCode, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value, 'name=value')
    setEmployeeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- COPY PASTE EDIT FUNCTION START ---
  const handleSave = () => {
    // 1. Build Payload mapping string values cleanly to numbers where required
    const payload = {
      actor_email: userData?.user.email, // Fallback text value for validation checks
      actor_user_type: Number(userData?.user?.user_type),
      employee_id: Number(employeeData.id),
      fullname: employeeData.fullname,
      department: Number(employeeData.department), // Converted to number to match backend schema requirement
      joining_date: employeeData.joining_date || null,
      position: employeeData.position,
      grade: employeeData.grade,
      work_level: employeeData.work_level,
      confirmation_date: employeeData.confirmation_date || null,
      reporting_manager: employeeData.reporting_manager,
      manager_emp_code: employeeData.manager_emp_code,
      email: employeeData.email,
      mobile: employeeData.mobile,
      gender: employeeData.gender,
      dob: employeeData.dob || null,
      address: employeeData.address,
      exit_date: employeeData.exit_date || null
    };

    // 2. Axios PUT submission
    axios.post(`${MAIN_API_URL}/employees/update-personal-info`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        // alert("Employee details updated successfully!");
        navigate("/onboarding")
        console.log("Update Success Response:", response.data);
      })
      .catch((err) => {
        console.error("Error saving employee details:", err.response.data);
        alert(err.response?.data?.error || "Failed to update employee information.");
      });
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-medium">
        Loading employee profile...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-slate-800 text-white flex items-center justify-between px-6 py-3 shadow">
        <h1 className="text-xl font-semibold">Employee Profile</h1>

        <Link
          to="/onboarding"
          className="flex items-center gap-2 text-sm bg-gray-600 px-3 py-1 rounded hover:bg-blue-600 transition"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </header>

      <main className="p-6 max-w-5xl mx-auto">
        {/* Personal Information */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="fullname"
                value={employeeData.fullname}
                onChange={handleChange}
                disabled={!canEditPersonal}
                className="border rounded px-4 py-2 bg-gray-50 block w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <select
                name="department"
                value={employeeData.department}
                onChange={handleChange}
                disabled={!canEditPersonal}
                className="border rounded px-4 py-2 bg-gray-50 block w-full disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800"
                required
              >
                <option value="" disabled>Select Department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept.id} value={dept.id} >
                    {dept.value}
                  </option>
                ))}
              </select>
            </div>

            {/* Staff No. */}
            <div>
              <label className="block text-sm font-medium mb-1">Staff No.</label>
              <input
                type="text"
                name="emp_code"
                value={employeeData.emp_code}
                onChange={handleChange}
                disabled={!canEditPersonal}
                className="border rounded px-4 py-2 bg-gray-50 block w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Date of Joining */}
            <div>
              <label className="block text-sm font-medium mb-1">Date of Joining</label>
              <input
                type="date"
                name="joining_date"
                value={employeeData.joining_date}
                onChange={handleChange}
                disabled={!canEditPersonal}
                className="border rounded px-4 py-2 bg-gray-50 block w-full disabled:bg-gray-110 disabled:cursor-not-allowed"
              />
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-medium mb-1">Designation</label>
              {/* <select
                name="position"
                value={employeeData.position}
                onChange={handleChange}
                disabled={!canEditPersonal}
                className="border rounded px-4 py-2 bg-gray-50 block w-full disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800"
                required
              >
                <option value="" disabled>Select Designation</option>
                {[
                  { id: 3000001, value: "Junior Associate" },
                  { id: 3000002, value: "Senior Associate" },
                  { id: 3000003, value: "Team Lead" },
                  { id: 3000004, value: "Manager" },
                  { id: 3000005, value: "Director" }
                ].map((role) => (
                  <option key={role.id} value={role.value}>
                    {role.value}
                  </option>
                ))}
              </select> */}
              <input
                type="text"
                name="position"
                placeholder="Designation"
                value={
                  employeeData.position
                }
                onChange={
                  handleChange
                }
                className="border rounded px-4 py-2 bg-gray-50 block w-full disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800"
                required
              />
            </div>

            {/* Grade */}
            <div>
              <label className="block text-sm font-medium mb-1">Grade</label>
              <input
                type="text"
                name="grade"
                value={employeeData.grade}
                onChange={handleChange}
                disabled={!canEditPersonal}
                className="border rounded px-4 py-2 bg-gray-50 block w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Work Level */}
            <div>
              <label className="block text-sm font-medium mb-1">Work Level</label>
              <input
                type="text"
                name="work_level"
                value={employeeData.work_level}
                onChange={handleChange}
                disabled={!canEditPersonal}
                className="border rounded px-4 py-2 bg-gray-50 block w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Date of Confirmation */}
            <div>
              <label className="block text-sm font-medium mb-1">Date of Confirmation</label>
              <input
                type="date"
                name="confirmation_date"
                value={employeeData.confirmation_date}
                onChange={handleChange}
                disabled={!canEditPersonal}
                className="border rounded px-4 py-2 bg-gray-50 block w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Manager Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Manager Name</label>
              {/* <input
                type="text"
                name="reporting_manager"
                value={employeeData.reporting_manager}
                onChange={handleChange}
                disabled={!canEditPersonal}
                className="border rounded px-4 py-2 bg-gray-50 block w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
              /> */}

              <select
                id="dynamicSelect"
                name="reporting_manager"
                value={employeeData.reporting_manager}
                onChange={handleChange}
                className="w-full mb-3 px-4 py-2 border rounded"
              >
                {/* Default placeholder option */}
                <option value="">Choose a manager</option>

                {/* 4. Map over the array to generate dynamic <option> elements */}
                {managerOptions?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.value}
                  </option>
                ))}
              </select>
            </div>

            {/* Manager Staff No. */}
            <div>
              <label className="block text-sm font-medium mb-1">Manager Staff No.</label>
              <input
                type="text"
                name="manager_emp_code"
                value={employeeData.manager_emp_code}
                onChange={handleChange}
                disabled={!canEditPersonal}
                className="border rounded px-4 py-2 bg-gray-50 block w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Employee Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Employee Email</label>
              <input
                type="email"
                name="email"
                value={employeeData.email}
                onChange={handleChange}
                disabled={!canEditPersonal}
                className="border rounded px-4 py-2 bg-gray-50 block w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Employee Mobile */}
            <div>
              <label className="block text-sm font-medium mb-1">Employee Mobile</label>
              <input
                type="text"
                name="mobile"
                value={employeeData.mobile}
                onChange={handleChange}
                disabled={!canEditPersonal}
                className="border rounded px-4 py-2 bg-gray-50 block w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                name="gender"
                value={employeeData.gender}
                onChange={handleChange}
                disabled={!canEditPersonal}
                className="border rounded px-4 py-2 bg-gray-50 block w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* DOB */}
            <div>
              <label className="block text-sm font-medium mb-1">DOB</label>
              <input
                type="date"
                name="dob"
                value={employeeData.dob}
                onChange={handleChange}
                disabled={!canEditPersonal}
                className="border rounded px-4 py-2 bg-gray-50 block w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea
                name="address"
                value={employeeData.address}
                onChange={handleChange}
                disabled={!canEditPersonal}
                rows={4}
                className="border rounded px-4 py-2 bg-gray-50 block w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Date of Exit */}
            <div>
              <label className="block text-sm font-medium mb-1">Date of Exit</label>
              <input
                type="date"
                name="exit_date"
                value={employeeData.exit_date}
                onChange={handleChange}
                disabled={!canEditPersonal}
                className="border rounded px-4 py-2 bg-gray-50 block w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {canEditPersonal && (
            <div className="mt-4 flex gap-3">
              <button style={{ cursor: "pointer" }}
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Save Personal Info
              </button>

              <button style={{ cursor: exitDate ? "pointer" : "not-allowed" }}
                disabled={exitDate ? false : true}
                onClick={handleDeleteEmployee}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Leave
              </button>
            </div>
          )}
        </div>

        {/* Leave Balances */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Leave Balances</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LeaveCard
              label="Pending Casual Leaves"
              value={employeeData.pending_casual_leaves}
            />
            <LeaveCard
              label="Pending Sick Leaves"
              value={employeeData.pending_sick_leaves}
            />
            <LeaveCard
              label="Pending Earned Leaves"
              value={employeeData.pending_earned_leaves}
            />
            <LeaveCard
              label="FY Casual Leaves"
              value={employeeData.fy_casual_leaves}
            />
            <LeaveCard
              label="FY Sick Leaves"
              value={employeeData.fy_sick_leaves}
            />
            <LeaveCard
              label="FY Earned Leaves"
              value={employeeData.fy_earned_leaves}
            />
          </div>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};

const LeaveCard = ({ label, value }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="border rounded px-4 py-2 bg-gray-50">{value}</div>
    </div>
  );
};

export default ViewEmployee;