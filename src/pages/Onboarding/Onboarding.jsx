import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    UserPlus,
    Upload,
    Pencil,
} from "lucide-react";
import axios from "axios";
import { MAIN_API_URL } from "../../constants/global-variables";

const EmployeeOnboarding = () => {
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
        });

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

    // ==========================
    // ADD EMPLOYEE
    // ==========================

    const handleAddEmployee = (e) => {
        e.preventDefault();


        const payload = {
            "org_id": userData.user.org_id,
            "name": employeeForm.fullname,
            "user_type": userData.user.user_type.toString(),
            "email": employeeForm.username,
            "password": employeeForm.password,
            "emp_code": employeeForm.emp_code,
            "position": employeeForm.position,
            "department": employeeForm.department,
            
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

    const handleBulkUpload =
        async (e) => {
            e.preventDefault();

            if (!bulkFile) {
                alert(
                    "Please select a file"
                );
                return;
            }

            try {
                const userData =
                    JSON.parse(
                        localStorage.getItem(
                            "ZeroUserData"
                        )
                    );

                const org_id =
                    userData?.user?.org_id;

                const formData =
                    new FormData();

                formData.append(
                    "file",
                    bulkFile
                );

                formData.append(
                    "org_id",
                    org_id
                );

                const res =
                    await fetch(
                        "http://localhost:3000/api/employees/bulk_upload",
                        {
                            method: "POST",
                            body: formData,
                        }
                    );

                const data =
                    await res.json();

                if (!res.ok) {
                    alert(
                        data.error ||
                        "Bulk upload failed"
                    );
                    return;
                }

                alert(
                    data.message ||
                    "Bulk upload successful"
                );

                closeBulkUploadModal();

                fetchEmployeesFromAPI();
            } catch (err) {
                console.error(err);
                alert(
                    "Bulk upload failed"
                );
            }
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
        localStorage.setItem(
            "SelectedEmployee",
            JSON.stringify(employee)
        );

        const idToUse =
            employee.user_id ||
            employee.id;

        navigate(
            `/view_employee?id=${idToUse}`
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
                                "/dashboard"
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
                                            {emp.department ||
                                                "N/A"}
                                        </td>

                                        <td className="border px-4 py-2">
                                            {emp.position ||
                                                "N/A"}
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

                            <input
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
                            />

                            <input
                                type="text"
                                name="department"
                                placeholder="Department"
                                value={
                                    employeeForm.department
                                }
                                onChange={
                                    handleInputChange
                                }
                                className="w-full mb-3 px-4 py-2 border rounded"
                                required
                            />

                            <input
                                type="text"
                                name="position"
                                placeholder="Designation"
                                value={
                                    employeeForm.position
                                }
                                onChange={
                                    handleInputChange
                                }
                                className="w-full mb-3 px-4 py-2 border rounded"
                                required
                            />

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
        </div>
    );
};

export default EmployeeOnboarding;