import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../config/axios'
import { UserContext } from '../context/user.context'
import AuthLayout from '../components/AuthLayout'
import toast from 'react-hot-toast' // Toast notifications

const Login = () => {
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
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

        axios.post('/users/login', {
            email,
            password
        }).then((res) => {
            localStorage.setItem('token', res.data.token)
            setUser(res.data.user)
            toast.success('Login successful!')
            navigate('/')
        }).catch((err) => {
            // Handle specific error messages
            const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message
            if (errorMsg?.toLowerCase().includes('not found') || errorMsg?.toLowerCase().includes('not registered')) {
                toast.error('User not registered. Please create an account.')
            } else if (errorMsg?.toLowerCase().includes('invalid') || errorMsg?.toLowerCase().includes('password')) {
                toast.error('Invalid email or password')
            } else {
                toast.error(errorMsg || 'Login failed')
            }
        })
    }

    return (
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
                    className="w-full px-4 py-3.5 rounded-xl bg-[#1a1a23] text-white placeholder-gray-600 border border-gray-800 focus:border-[#FC9986]/50 focus:bg-[#1e1e28] focus:outline-none focus:ring-2 focus:ring-[#FC9986]/20 transition-all duration-200 text-[15px]"
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
                        className="w-full px-4 py-3.5 pr-12 rounded-xl bg-[#1a1a23] text-white placeholder-gray-600 border border-gray-800 focus:border-[#FC9986]/50 focus:bg-[#1e1e28] focus:outline-none focus:ring-2 focus:ring-[#FC9986]/20 transition-all duration-200 text-[15px]"
                        placeholder="Enter your password"
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
            
            <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2.5">
                    <input 
                        type="checkbox" 
                        id="remember" 
                        className="w-4 h-4 rounded border-gray-700 bg-[#1a1a23] text-[#FC9986] focus:ring-[#FC9986]/30 focus:ring-2 focus:ring-offset-0 cursor-pointer" 
                    />
                    <label htmlFor="remember" className="text-sm text-gray-400 cursor-pointer hover:text-gray-300 transition-colors select-none">Remember me</label>
                </div>
                <a href="#" className="text-sm text-[#FC9986] hover:text-[#FFB4A2] font-medium transition-colors">Forgot password?</a>
            </div>

            <button
                type="submit"
                className="w-full py-3.5 mt-2 rounded-xl bg-[#FC9986] text-[#1a1a24] font-semibold hover:bg-[#e88a78] transition-all duration-300 shadow-lg shadow-[#FC9986]/25 hover:shadow-[#FC9986]/40 hover:scale-[1.02] active:scale-[0.98] text-[15px]"
            >
                Log in
            </button>
        </AuthLayout>
    )
}

export default Login