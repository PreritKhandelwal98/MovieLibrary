import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    });

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8000/api/login`, data);
            toast.success(response.data.message);
            if (response.data.success) {
                localStorage.setItem('token', response.data.data);
                navigate('/');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        }
    };
    return (
        <div className="flex flex-col justify-center items-center w-full h-[100vh] bg-[#282D2D] px-5">
            <div
                className={`xl:max-w-3xl bg-white
                    }  w-full p-5 sm:p-10 rounded-md`}
            >
                <h1
                    className={`text-center text-xl sm:text-3xl font-semibold text-black
                        `}
                >
                    Login
                </h1>
                <form onSubmit={handleSubmit} className="w-full mt-8">
                    <div className="mx-auto max-w-xs sm:max-w-md md:max-w-lg flex flex-col gap-4">
                        <input
                            className={`w-full px-5 py-3 rounded-lg  font-medium border-2 border-transparent placeholder-gray-500 text-sm focus:outline-none focus:border-2  focus:outline 
                                bg-gray-100 text-black focus:border-black
                                `}
                            type="email"
                            name='email'
                            value={data.email}
                            onChange={handleOnChange}
                            placeholder="Enter your email"
                        />
                        <input
                            className={`w-full px-5 py-3 rounded-lg  font-medium border-2 border-transparent placeholder-gray-500 text-sm focus:outline-none focus:border-2  focus:outline 
                                 bg-gray-100 text-black focus:border-black
                                `}
                            type="password"
                            value={data.password}
                            onChange={handleOnChange}
                            name='password'
                            placeholder="Password"
                        />
                        <button className="mt-5 tracking-wide font-semibold bg-orange-500 text-gray-100 w-full py-4 rounded-lg hover:bg-[#E9522C]/90 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                            type="submit"
                        >
                            <svg
                                className="w-6 h-6 -ml-2"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                <circle cx="8.5" cy="7" r="4" />
                                <path d="M20 8v6M23 11h-6" />
                            </svg>
                            <span className="ml-3">Login</span>
                        </button>
                        <p className="mt-6 text-xs text-gray-600 text-center">
                            Don't have account?{" "}<Link to="/register"><span className="text-[#E9522C] font-semibold">Register</span></Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default Login;
