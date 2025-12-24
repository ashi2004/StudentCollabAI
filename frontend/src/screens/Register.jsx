import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'
import axios from '../config/axios'
import AuthLayout from '../components/AuthLayout'
import toast from 'react-hot-toast' // Toast notifications

const Register = () => {
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ firstName, setFirstName ] = useState('')
    const [ lastName, setLastName ] = useState('')
    const [ showPassword, setShowPassword ] = useState(false)
    
    const { setUser } = useContext(UserContext)
    const navigate = useNavigate()

    function submitHandler(e) {
        e.preventDefault()
        
        // Validate input fields
        if (!email || !password) {
            toast.error('Please fill all fields')
            return
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }

        axios.post('/users/register', {
            email,
            password
        }).then((res) => {
            localStorage.setItem('token', res.data.token)
            setUser(res.data.user)
            toast.success('Account created successfully!')
            navigate('/')
        }).catch((err) => {
            // Handle specific error messages
            const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message
            if (errorMsg?.toLowerCase().includes('already') || errorMsg?.toLowerCase().includes('exists')) {
                toast.error('Email already registered. Please login.')
            } else {
                toast.error(errorMsg || 'Registration failed')
            }
        })
    }

    return (
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
                        className="w-full px-4 py-3.5 rounded-xl bg-[#1a1a23] text-white placeholder-gray-500 border border-gray-800 focus:border-[#FC9986]/50 focus:bg-[#1e1e28] focus:outline-none focus:ring-2 focus:ring-[#FC9986]/20 transition-all duration-200 text-[15px]"
                        placeholder="John"
                    />
                </div>
                <div className="w-1/2 space-y-1">
                    <label htmlFor="lastName" className="text-sm font-medium text-gray-400 ml-1">Last name</label>
                    <input
                        onChange={(e) => setLastName(e.target.value)}
                        type="text"
                        id="lastName"
                        className="w-full px-4 py-3.5 rounded-xl bg-[#1a1a23] text-white placeholder-gray-500 border border-gray-800 focus:border-[#FC9986]/50 focus:bg-[#1e1e28] focus:outline-none focus:ring-2 focus:ring-[#FC9986]/20 transition-all duration-200 text-[15px]"
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
                    className="w-full px-4 py-3.5 rounded-xl bg-[#1a1a23] text-white placeholder-gray-500 border border-gray-800 focus:border-[#FC9986]/50 focus:bg-[#1e1e28] focus:outline-none focus:ring-2 focus:ring-[#FC9986]/20 transition-all duration-200 text-[15px]"
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
                        className="w-full px-4 py-3.5 pr-12 rounded-xl bg-[#1a1a23] text-white placeholder-gray-500 border border-gray-800 focus:border-[#FC9986]/50 focus:bg-[#1e1e28] focus:outline-none focus:ring-2 focus:ring-[#FC9986]/20 transition-all duration-200 text-[15px]"
                        placeholder="Create a strong password"
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FC9986] transition-colors duration-200"
                    >
                        <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-lg`}></i>
                    </button>
                </div>
            </div>
            
            <button
                type="submit"
                className="w-full py-3.5 mt-2 rounded-xl bg-[#FC9986] text-[#1a1a24] font-semibold hover:bg-[#e88a78] transition-all duration-300 shadow-lg shadow-[#FC9986]/25 hover:shadow-[#FC9986]/40 hover:scale-[1.02] active:scale-[0.98] text-[15px]"
            >
                Create account
            </button>
        </AuthLayout>
    )
}

export default Register