import React, { useContext, useEffect, useState } from 'react'
import { UNSAFE_RSCDefaultRootErrorBoundary, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'
import axios from '../config/axios'
const UserAuth = ({ children }) => {

    // const { user } = useContext(UserContext)
    // const [ loading, setLoading ] = useState(true)
    // const token = localStorage.getItem('token')
    
    
    
    const { user, setUser } = useContext(UserContext)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()




    useEffect(() => {
        // if (user) {
        //     setLoading(false)
        // }

        // if (!token) {
        const token = localStorage.getItem('token')
        
        // If no token or invalid token string, redirect to login
        if (!token || token === 'null' || token === 'undefined') {
            localStorage.removeItem('token')
            navigate('/login')
            return
        }

        // if (!user) {
        //     navigate('/login')
        if (user) {
            setLoading(false)
            return
        }

    // }, [])

    // Try to fetch user profile with the token
        axios.get('/users/profile')
            .then((res) => {
                setUser(res.data.user)
                setLoading(false)
            })
            .catch((err) => {
                console.log('Auth error:', err)
                // Token is invalid/expired, clear it and redirect
                localStorage.removeItem('token')
                navigate('/login')
            })

    }, [user, navigate, setUser])

    if (loading) {
    //     return <div>Loading...</div>
    
            return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        )
    }

    // return (
    //     <>
    //         {children}</>
    // )
    return <>{children}</>
}

export default UserAuth