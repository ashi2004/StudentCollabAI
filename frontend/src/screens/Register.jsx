import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
// import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'
import axios from '../config/axios'
import AuthLayout from '../components/AuthLayout'

const Register = () => {

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ firstName, setFirstName ] = useState('')
    const [ lastName, setLastName ] = useState('')
    const [ showPassword, setShowPassword ] = useState(false)

    const { setUser } = useContext(UserContext)

    const navigate = useNavigate()


    function submitHandler(e) {

        e.preventDefault() //stops browser default behaviour in this case stop reload after form submission 

        axios.post('/users/register', {
            email,
            password
        }).then((res) => {
            console.log(res.data)
            localStorage.setItem('token', res.data.token)
            setUser(res.data.user)
            navigate('/')
        }).catch((err) => {
            console.log(err.response.data)
        })
    }


    return (
        // <div className="min-h-screen flex items-center justify-center bg-gray-900">
        //     <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        //         <h2 className="text-2xl font-bold text-white mb-6">Register</h2>
        //         <form
        //             onSubmit={submitHandler}
        //         >
        //             <div className="mb-4">
        //                 <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
        //                 <input
        //                     onChange={(e) => setEmail(e.target.value)}
        //                     type="email"
        //                     id="email"
        //                     className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        //                     placeholder="Enter your email"
        //                 />
        //             </div>
        //             <div className="mb-6">
        //                 <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
        //                 <input
        //                     onChange={(e) => setPassword(e.target.value)} 
        //                     type="password"
        //                     id="password"
        //                     className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        //                     placeholder="Enter your password"
        //                 />
        //             </div>
        //             <button
        //                 type="submit"
        //                 className="w-full p-3 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                <AuthLayout 
            title="Create an account" 
            subtitle="Already have an account?" 
            linkText="Log in" 
            linkTo="/login"
            onSubmit={submitHandler}
            type="register"
        >
            <div className="flex gap-4">
                <div className="w-1/2 space-y-1">
                    <label htmlFor="firstName" className="text-sm font-medium text-gray-400 ml-1">First name</label>
                    <input
                        onChange={(e) => setFirstName(e.target.value)}
                        type="text"
                        id="firstName"
                        className="w-full px-4 py-3.5 rounded-xl bg-[#1a1a23] text-white placeholder-gray-600 border border-gray-800 focus:border-purple-500/50 focus:bg-[#1e1e28] focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-[15px]"
                        placeholder="John"
                    />
                </div>
                <div className="w-1/2 space-y-1">
                    <label htmlFor="lastName" className="text-sm font-medium text-gray-400 ml-1">Last name</label>
                    <input
                        onChange={(e) => setLastName(e.target.value)}
                        type="text"
                        id="lastName"
                        className="w-full px-4 py-3.5 rounded-xl bg-[#1a1a23] text-white placeholder-gray-600 border border-gray-800 focus:border-purple-500/50 focus:bg-[#1e1e28] focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-[15px]"
                        placeholder="Doe"
                    />
                </div>
            </div>
            <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium text-gray-400 ml-1">Email</label>
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    id="email"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#1a1a23] text-white placeholder-gray-600 border border-gray-800 focus:border-purple-500/50 focus:bg-[#1e1e28] focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-[15px]"
                    placeholder="john@example.com"
                />
            </div>
            <div className="space-y-1">
                <label htmlFor="password" className="text-sm font-medium text-gray-400 ml-1">Password</label>
                <div className="relative">
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="w-full px-4 py-3.5 pr-12 rounded-xl bg-[#1a1a23] text-white placeholder-gray-600 border border-gray-800 focus:border-purple-500/50 focus:bg-[#1e1e28] focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-[15px]"
                        placeholder="Create a strong password"
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-400 transition-colors duration-200"
                    >
                        <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-lg`}></i>       
                    </button>
                </div>

            </div>
                <div className="flex items-center gap-2.5 pt-1">
                <input 
                    type="checkbox" 
                    id="terms" 
                    className="w-4 h-4 rounded border-gray-700 bg-[#1a1a23] text-purple-600 focus:ring-purple-500/30 focus:ring-2 focus:ring-offset-0 cursor-pointer" 
                />
                <label htmlFor="terms" className="text-sm text-gray-400 cursor-pointer hover:text-gray-300 transition-colors select-none">
                    I agree to the <a href="#" className="text-purple-400 hover:text-purple-300 font-medium">Terms & Conditions</a>
                </label>
            </div>

            <button
                type="submit"
                className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-500 hover:to-purple-600 transition-all duration-300 shadow-lg shadow-purple-600/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] text-[15px]"
            >
                Create account
            </button>
        </AuthLayout>        
    )
}

export default Register