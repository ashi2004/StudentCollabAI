import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
// import { Link, useNavigate } from 'react-router-dom'
import axios from '../config/axios'
import { UserContext } from '../context/user.context'
import AuthLayout from '../components/AuthLayout'

const Login = () => {


    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    // const { setUser } = useContext(UserContext) //the setuser function from user context to set the user globally after login
    const [ showPassword, setShowPassword ] = useState(false)
    const { setUser } = useContext(UserContext)
    const navigate = useNavigate()

    function submitHandler(e) {

        // e.preventDefault() //stops browser default behaviour in this case stop reload after form submission 

        axios.post('/users/login', {
            email,
            password
        }).then((res) => {
            console.log(res.data)

            localStorage.setItem('token', res.data.token) //store token in local storage
            setUser(res.data.user) //set the user globally after login

            navigate('/') //after submitting login form u'll redirect to home page
        }).catch((err) => {
            // console.log(err.response.data)
            console.log(err.response?.data || err.message)
        })
    }

    return (
        // <div className="min-h-screen flex items-center justify-center bg-gray-900">
        //     <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        //         <h2 className="text-2xl font-bold text-white mb-6">Login</h2>
        //         <form
        //             onSubmit={submitHandler}
        //         >
        //             <div className="mb-4">
        //                 <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
        //                 <input

        //                     onChange={(e) => setEmail(e.target.value)} //sets email state on input change
        //                     type="email"
        //                     id="email"
        //                     className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        //                     placeholder="Enter your email"
        //                 />
        //             </div>
        //             <div className="mb-6">
        //                 <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
        //                 <input
        //                     onChange={(e) => setPassword(e.target.value)}//sets password state on input change
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
            title="Login" 
            subtitle="Don't have an account?" 
            linkText="Create one" 
            linkTo="/register"
            onSubmit={submitHandler}
            type="login"
        >
            <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium text-gray-400 ml-1">Email</label>
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    id="email"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#1a1a23] text-white placeholder-gray-600 border border-gray-800 focus:border-purple-500/50 focus:bg-[#1e1e28] focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-[15px]"
                    placeholder="Enter your email"
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
                        placeholder="Enter your password"
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-400 transition-colors duration-200"
                    >
                        {/* Login */}
                     <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-lg`}></i> 
                    </button>
                   </div>
            </div>
            
            <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2.5">
                    <input 
                        type="checkbox" 
                        id="remember" 
                        className="w-4 h-4 rounded border-gray-700 bg-[#1a1a23] text-purple-600 focus:ring-purple-500/30 focus:ring-2 focus:ring-offset-0 cursor-pointer" 
                    />
                    <label htmlFor="remember" className="text-sm text-gray-400 cursor-pointer hover:text-gray-300 transition-colors select-none">Remember me</label>
                </div>
                <a href="#" className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors">Forgot password?</a>
            </div>
           <button
                type="submit"
                className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-500 hover:to-purple-600 transition-all duration-300 shadow-lg shadow-purple-600/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] text-[15px]"
            >
                Login
            </button>
        </AuthLayout>
    )
}

export default Login