import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import api from '../../../utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

const UserProfile = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    const { userId } = useParams();
    const [user, setUser] = useState({});
    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        fullName: '',
        password: '',
        confirmPassword: '',
        contactNo: '',
        userRole: '',
        profileImage: ''
    });
    const [roles, setRoles] = useState([]);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await api.get(`/GetUserData/${userId}`);
                const userRoleResponse = await api.get(`/GetUserRole/${userId}`);

                const userData = {
                    firstName: userResponse.data.userData.FirstName,
                    lastName: userResponse.data.userData.LastName,
                    email: userResponse.data.userData.Email,
                    fullName: userResponse.data.userData.FullName,
                    password: '',
                    confirmPassword: '',
                    contactNo: userResponse.data.userData.ContactNo,
                    userRole: userRoleResponse.data.userRole.UserRole,
                    profileImage: userResponse.data.userData.ProfileImage
                };

                setUser(userResponse.data.userData);
                setValues(userData);
                console.log("Values after fetch: ", userData);

            } catch (error) {
                console.error('Error fetching user data: ', error);
            }
        };

        const fetchRoles = async () => {
            try {
                const response = await api.get('/Roles');
                setRoles(response.data);
            } catch (error) {
                console.error("Error fetching roles: " + error);
            }
        };

        fetchUserData();
        fetchRoles();
    }, [userId]);

    const handleEdit = () => {
        setEditing(true);
    };

    const navigate = useNavigate();

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('firstName', values.firstName);
        formData.append('lastName', values.lastName);
        formData.append('email', values.email);
        formData.append('contactNo', values.contactNo);
        formData.append('userRole', values.userRole);
        formData.append('password', values.password);
        formData.append('confirmPassword', values.confirmPassword);
        if (values.profileImage) {
            formData.append('profileImage', values.profileImage);
        }

        try {
            const response = await api.put(`/UpdateUserData/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            window.alert("User Updated Successfully!")
            window.location.reload();
            // navigate(`../UserManagement/UserProfile/${userId}`);
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };
    const handleImageChange = (e) => {
        setValues({ ...values, profileImage: e.target.files[0] });
    };

    const profileImage = `/images/users/${values.profileImage}`;

    return (
        <div className="absolute top-0 left-0 w-full h-full">
            {/* Sidebar */}
            <div className={`fixed z-50 inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out xl:translate-x-0`}>
                <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
            </div>

            {/* Main */}
            <main className="ease-soft-in-out xl:ml-68.5 relative h-full max-h-screen rounded-xl transition-all duration-200 bg-light flex flex-col">
                {/* Topbar */}
                <Topbar toggleSidebar={toggleSidebar} />

                {/* Profile Form */}
                <div className="flex flex-1 justify-center mt-3 pt-5 px-0">
                    <div className="w-full max-w-6xl">
                        <div className="border-b-2 flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
                            <div className="w-full md:w-2/5 p-6 bg-white shadow-md">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="w-full flex justify-center text-2xl font-semibold">{values.fullName}</span>
                                </div>
                                <span className="w-full flex justify-center text-gray-600">This information is secret so be careful</span>
                                <div className="w-full flex justify-center py-6">
                                    <img src={profileImage} alt="Profile" className="h-32 w-32 rounded-full" />
                                </div>
                                <div className="w-full flex justify-center mt-4">
                                    {editing ? (
                                        <div className="flex space-x-4">
                                            <button onClick={handleSave} className="text-sm font-bold text-white bg-blue-500 rounded-full px-5 py-2 transition duration-300 hover:bg-blue-600">Save Changes</button>
                                            <button onClick={() => setEditing(false)} className="text-sm font-bold text-white bg-gray-700 rounded-full px-5 py-2 transition duration-300 hover:bg-gray-800">Cancel</button>
                                        </div>
                                    ) : (
                                        <button onClick={handleEdit} className="text-sm font-bold text-white bg-gray-700 rounded-full px-5 py-2 transition duration-300 hover:bg-gray-800">Edit</button>
                                    )}
                                </div>
                            </div>

                            <form className="w-full md:w-3/5 p-5 space-y-4" onSubmit={handleSave} encType="multipart/form-data" >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="firstName" className="mb-2 text-sm font-medium text-gray-700">First Name:</label>
                                        <input type="text" id="firstName" name="firstName" value={values.firstName} onChange={handleInputChange} className="text-sm text-gray-500 pl-3 pr-5 rounded-full border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white" disabled={!editing} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="lastName" className="mb-2 text-sm font-medium text-gray-700">Last Name:</label>
                                        <input type="text" id="lastName" name="lastName" value={values.lastName} onChange={handleInputChange} className="text-sm text-gray-500 pl-3 pr-5 rounded-full border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white" disabled={!editing} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="email" className="mb-2 text-sm font-medium text-gray-700">Email:</label>
                                        <input type="email" id="email" name="email" value={values.email} onChange={handleInputChange} className="text-sm text-gray-500 pl-3 pr-5 rounded-full border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white" disabled={!editing} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="contactNo" className="mb-2 text-sm font-medium text-gray-700">Contact Number:</label>
                                        <input type="text" id="contactNo" name="contactNo" value={values.contactNo} onChange={handleInputChange} className="text-sm text-gray-500 pl-3 pr-5 rounded-full border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white" disabled={!editing} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="password" className="mb-2 text-sm font-medium text-gray-700">Password:</label>
                                        <input type="password" id="password" name="password" value={values.password} onChange={handleInputChange} className="text-sm text-gray-500 pl-3 pr-5 rounded-full border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white" disabled={!editing} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="confirmPassword" className="mb-2 text-sm font-medium text-gray-700">Confirm Password:</label>
                                        <input type="password" id="confirmPassword" name="confirmPassword" value={values.confirmPassword} onChange={handleInputChange} className="text-sm text-gray-500 pl-3 pr-5 rounded-full border border-gray py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white" disabled={!editing} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="userRole" className="mb-2 text-sm font-medium text-gray-700">User Role:</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                <FontAwesomeIcon icon={faCaretDown} className="text-gray-400" />
                                            </div>
                                            <select id="userRole" name="userRole" value={values.userRole} onChange={handleInputChange} className="text-sm text-gray-500 pl-9 pr-5 rounded-full border border-gray-300 w-full py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white" style={{ appearance: 'none', backgroundImage: 'none' }} disabled={!editing} >
                                                <option value={values.userRole}>{values.userRole}</option>
                                                {roles.map((role) => (
                                                    <option key={role.RoleId} value={role.RoleName}>{role.RoleName}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="profileImage" className="mb-2 text-sm font-medium text-gray-700">Profile Image:</label>
                                        <input type="file" id="profileImage" name="profileImage" onChange={handleImageChange} className="text-sm text-gray-500 pl-3 pr-5 rounded-full border border-gray py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white" disabled={!editing} />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserProfile;
