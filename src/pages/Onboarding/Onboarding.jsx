import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    UserPlus,
    Upload,
    Pencil,
} from "lucide-react";
import axios from "axios";
import { MAIN_API_URL } from "../../constants/global-variables";
import { DEPARTMENTS, DESIGNATIONS, USERTYPES } from "../../contstants/application";
import { toast, ToastContainer } from "react-toastify";

const EmployeeOnboarding = () => {
    const [managerOptions, setManagerOptions] = useState([]);
    console.log("Manager options for dropdown:", managerOptions);
    const navigate = useNavigate();
    const userData = JSON.parse(
        localStorage.getItem("userData")
    );
    const token = userData?.token;
    // ==========================
    // STATES
    // ==========================

    const [allEmployees, setAllEmployees] =
        useState([]);

    const [filteredEmployees, setFilteredEmployees] =
        useState([]);

    const [departmentFilter, setDepartmentFilter] =
        useState("");

    const [showAddModal, setShowAddModal] =
        useState(false);

    const [
        showBulkUploadModal,
        setShowBulkUploadModal,
    ] = useState(false);

    const [bulkFile, setBulkFile] =
        useState(null);

    const [currentSort, setCurrentSort] =
        useState({
            key: null,
            asc: true,
        });

    const [employeeForm, setEmployeeForm] =
        useState({
            fullname: "",
            emp_code: "",
            department: "",
            position: "",
            username: "",
            password: "",
            usertype: "",
        });
    console.log(employeeForm, "Employee form state");
    // ==========================
    // FETCH EMPLOYEES
    // ==========================

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
                    setAllEmployees(
                        response.data.data
                    );


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

    // ==========================
    // FILTER + SORT
    // ==========================

    useEffect(() => {
        let employees = [...allEmployees];

        // Filter
        if (departmentFilter) {
            employees = employees.filter(
                (emp) =>
                    emp.department ===
                    departmentFilter
            );
        }

        // Sorting
        if (currentSort.key) {
            employees.sort((a, b) => {
                const valA = (
                    a[currentSort.key] || ""
                )
                    .toString()
                    .toLowerCase();

                const valB = (
                    b[currentSort.key] || ""
                )
                    .toString()
                    .toLowerCase();

                if (valA < valB)
                    return currentSort.asc
                        ? -1
                        : 1;

                if (valA > valB)
                    return currentSort.asc
                        ? 1
                        : -1;

                return 0;
            });
        }

        setFilteredEmployees(employees);
    }, [
        allEmployees,
        departmentFilter,
        currentSort,
    ]);

    // ==========================
    // MODAL FUNCTIONS
    // ==========================

    const openAddModal = () =>
        setShowAddModal(true);

    const closeAddModal = () => {
        setShowAddModal(false);

        setEmployeeForm({
            fullname: "",
            emp_code: "",
            department: "",
            position: "",
            username: "",
            password: "",
        });
    };

    const openBulkUploadModal =
        () => {
            setShowBulkUploadModal(true);
        };

    const closeBulkUploadModal =
        () => {
            setShowBulkUploadModal(false);
            setBulkFile(null);
        };

    // ==========================
    // FORM CHANGE
    // ==========================

    const handleInputChange = (
        e
    ) => {
        const { name, value } =
            e.target;

        setEmployeeForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const [selectedValue, setSelectedValue] = useState("");

    // 3. Create the onChange handler function
    const handleDropdownChange = (event) => {
        const selectedId = event.target.value;
        setSelectedValue(selectedId);

        // Optional: Do something with the selected value
        console.log("Selected Element ID:", selectedId);
    };

    // ==========================
    // ADD EMPLOYEE
    // ==========================

    const handleAddEmployee = (e) => {
        e.preventDefault();

        // {
        //     "org_id": 1,
        //         "name": "Sanjukta",
        //             "user_type": "2",
        //                 "email": "sanjukta@yopmail.com",
        //                     "password": "123456",
        //                         "emp_code": "EMP008",
        //                             "position": "Software Engineer",
        //                                 "department": "1000002",
        //                                     "manager_id": 14
        // }
        const payload = {
            "manager_id": selectedValue, // This is the manager_id
            "org_id": userData.user.org_id,
            "name": employeeForm?.fullname,
            "user_type": employeeForm?.usertype.toString() || "20002", // Default to "Employee" if not selected
            "email": employeeForm?.username,
            "password": employeeForm?.password,
            // "emp_code": employeeForm?.emp_code,
            "position": employeeForm?.position,
            "department": employeeForm?.department,

        }
        console.log("Adding employee with payload:", payload);
        axios
            .post(
                `${MAIN_API_URL}/add-employee`,
                payload,
                {
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization: `Bearer ${token}`
                    },
                }
            )
            .then((response) => {
                console.log(
                    response.data
                );



                closeAddModal();

                fetchEmployeesFromAPI();
            })
            .catch((err) => {
                console.error(err);

                alert(
                    err?.response?.data
                        ?.error ||
                    "Failed to add employee"
                );
            });
    };

    // ==========================
    // BULK UPLOAD
    // ==========================
    const handleBulkUpload = (e) => {
        e.preventDefault();

        if (!bulkFile) {
            alert("Please select a file");
            return;
        }



        const formData = new FormData();
        formData.append("file", bulkFile);


        axios
            .post(
                `${MAIN_API_URL}/upload-employee-bulk`,
                formData,

            )
            .then((res) => {
                toast.success(res.data.message || "Bulk upload successful");
                closeBulkUploadModal();
                fetchEmployeesFromAPI();
            })
            .catch((err) => {
                console.error(err);
                const message =
                    err.response?.data?.error || err.message || "Bulk upload failed";
                alert(message);
            });
    };

    // ==========================
    // SORTING
    // ==========================

    const handleSort = (
        key
    ) => {
        setCurrentSort((prev) => ({
            key,
            asc:
                prev.key === key
                    ? !prev.asc
                    : true,
        }));
    };

    // ==========================
    // EDIT EMPLOYEE
    // ==========================

    const editEmployee = (
        employee
    ) => {


        navigate(
            `/view-employee?email=${employee.email}`
        );
    };

    return (
        <div className="bg-gray-50 text-gray-800 font-sans min-h-screen">
            {/* Header */}
            <header className="bg-slate-800 text-white flex items-center justify-between px-6 py-3 shadow">
                <h1 className="text-xl font-semibold">
                    Employee Onboarding
                </h1>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                        <UserPlus size={18} />
                        <span className="text-sm font-medium">
                            Add Employee
                        </span>
                    </button>

                    <button
                        onClick={
                            openBulkUploadModal
                        }
                        className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
                    >
                        <Upload size={18} />
                        <span className="text-sm font-medium">
                            Bulk Upload
                        </span>
                    </button>

                    <button
                        onClick={() =>
                            navigate(
                                "/hr-dashboard"
                            )
                        }
                        className="text-sm bg-gray-600 px-4 py-2 rounded hover:bg-blue-600"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </header>

            {/* Main */}
            <main className="p-6 max-w-6xl mx-auto">
                {/* Filter */}
                <div className="mb-4">
                    <label className="block mb-1 font-medium">
                        Filter by Department
                    </label>

                    <select
                        value={
                            departmentFilter
                        }
                        onChange={(e) =>
                            setDepartmentFilter(
                                e.target.value
                            )
                        }
                        className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3"
                    >
                        <option value="">
                            All Departments
                        </option>
                        <option>Tech</option>
                        <option>Product</option>
                        <option>HR</option>
                        <option>Sales</option>
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto bg-white shadow rounded-lg">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th
                                    onClick={() =>
                                        handleSort(
                                            "emp_code"
                                        )
                                    }
                                    className="px-4 py-3 cursor-pointer"
                                >
                                    Employee ID
                                </th>

                                <th
                                    onClick={() =>
                                        handleSort(
                                            "fullname"
                                        )
                                    }
                                    className="px-4 py-3 cursor-pointer"
                                >
                                    Name
                                </th>

                                <th
                                    onClick={() =>
                                        handleSort(
                                            "department"
                                        )
                                    }
                                    className="px-4 py-3 cursor-pointer"
                                >
                                    Department
                                </th>

                                <th
                                    onClick={() =>
                                        handleSort(
                                            "position"
                                        )
                                    }
                                    className="px-4 py-3 cursor-pointer"
                                >
                                    Designation
                                </th>

                                <th className="px-4 py-3">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredEmployees.map(
                                (emp) => (
                                    <tr
                                        key={
                                            emp.user_id ||
                                            emp.id
                                        }
                                    >
                                        <td className="border px-4 py-2">
                                            {emp.emp_code ||
                                                "N/A"}
                                        </td>

                                        <td className="border px-4 py-2">
                                            {emp.fullname ||
                                                "N/A"}
                                        </td>

                                        <td className="border px-4 py-2">
                                            {DEPARTMENTS.find(
                                                (dept) => dept.id == emp.department
                                            )?.value || "N/A"}
                                        </td>

                                        <td className="border px-4 py-2">
                                            {DESIGNATIONS.find(
                                                (role) => role.id == emp.position
                                            )?.value || "N/A"}
                                        </td>

                                        <td className="border px-4 py-2">
                                            <button
                                                onClick={() =>
                                                    editEmployee(
                                                        emp
                                                    )
                                                }
                                                className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                                            >
                                                <Pencil
                                                    size={14}
                                                />
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Add Employee Modal */}
            {showAddModal && (
                <div className="fixed inset-0 flex bg-black/50 justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">
                            Add New Employee
                        </h2>

                        <form
                            onSubmit={
                                handleAddEmployee
                            }
                        >



                            <select
                                id="dynamicSelect"
                                value={selectedValue}
                                onChange={handleDropdownChange}
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
                            <input
                                type="text"
                                name="fullname"
                                placeholder="Full Name"
                                value={
                                    employeeForm.fullname
                                }
                                onChange={
                                    handleInputChange
                                }
                                className="w-full mb-3 px-4 py-2 border rounded"
                                required
                            />

                            {/* <input
                                type="text"
                                name="emp_code"
                                placeholder="Employee ID"
                                value={
                                    employeeForm.emp_code
                                }
                                onChange={
                                    handleInputChange
                                }
                                className="w-full mb-3 px-4 py-2 border rounded"
                                required
                            /> */}

                            <select
                                name="department"
                                value={employeeForm.department}
                                onChange={handleInputChange}
                                className="w-full mb-3 px-4 py-2 border rounded bg-white text-gray-800"
                                required
                            >
                                <option value="" disabled>Select Department</option>
                                {DEPARTMENTS.map((dept) => (
                                    <option key={dept.id} value={dept.id} >
                                        {dept.value}
                                    </option>
                                ))}
                            </select>

                            <select
                                name="position"
                                value={employeeForm.position}
                                onChange={handleInputChange}
                                className="w-full mb-3 px-4 py-2 border rounded bg-white text-gray-800"
                                required
                            >
                                <option value="" disabled>Select Designation</option>
                                {DESIGNATIONS.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.value}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={
                                    employeeForm.username
                                }
                                onChange={
                                    handleInputChange
                                }
                                className="w-full mb-3 px-4 py-2 border rounded"
                                required
                            />

                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={
                                    employeeForm.password
                                }
                                onChange={
                                    handleInputChange
                                }
                                className="w-full mb-3 px-4 py-2 border rounded"
                                required
                            />
                            {employeeForm.department == 1000001 &&
                                <select
                                    name="usertype"
                                    value={employeeForm.usertype}
                                    onChange={handleInputChange}
                                    className="w-full mb-3 px-4 py-2 border rounded bg-white text-gray-800"
                                    required
                                >
                                    <option value="" disabled>Select User Type</option>
                                    {USERTYPES.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.value}
                                        </option>
                                    ))}
                                </select>}

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={
                                        closeAddModal
                                    }
                                    className="px-4 py-2 border rounded"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Bulk Upload Modal */}
            {showBulkUploadModal && (
                <div className="fixed inset-0 flex bg-black/50 justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">
                            Bulk Upload
                            Employees
                        </h2>

                        <form
                            onSubmit={
                                handleBulkUpload
                            }
                        >
                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={(e) =>
                                    setBulkFile(
                                        e.target
                                            .files[0]
                                    )
                                }
                                className="w-full mb-4"
                                required
                            />

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={
                                        closeBulkUploadModal
                                    }
                                    className="px-4 py-2 border rounded"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                                >
                                    Upload
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <ToastContainer/>
        </div>
    );
};

export default EmployeeOnboarding;