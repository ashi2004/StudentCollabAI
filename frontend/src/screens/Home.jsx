import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/user.context'
import axios from "../config/axios"
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Home = () => {

    const { user, setUser } = useContext(UserContext)
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ projectName, setProjectName ] = useState('')
    const [ project, setProject ] = useState([])
    const [ showUserMenu, setShowUserMenu ] = useState(false)
    const [ searchQuery, setSearchQuery ] = useState('')

    const navigate = useNavigate()

    function createProject(e) {
        e.preventDefault()
        
        if (!projectName.trim()) {
            toast.error('Please enter project name')
            return
        }

        axios.post('/projects/create', {
            name: projectName,
        })
            .then((res) => {
                toast.success('Project created!')
                setIsModalOpen(false)
                setProjectName('')
                setProject(prev => [...prev, res.data.project])
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || 'Failed to create')
            })
    }

    function handleLogout() {
        localStorage.removeItem('token')
        setUser(null)
        navigate('/login')
        toast.success('Logged out successfully')
    }

    // Filter projects based on search query
    const filteredProjects = project.filter(proj => 
        proj.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    useEffect(() => {
        axios.get('/projects/all').then((res) => {
            setProject(res.data.projects)

        }).catch(err => {
            console.log(err)
        })

    }, [])

    return (
        <main className="min-h-screen w-full bg-gradient-to-br from-[#121218] via-[#1a1a24] to-[#121218] p-6 md:p-10">
            {/* Header section */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FC9986] to-[#FFB4A2] rounded-xl flex items-center justify-center shadow-lg shadow-[#FC9986]/30">
                        <i className="ri-shining-fill text-[#1a1a24] text-xl"></i>
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Collabify</h1>
                        <p className="text-gray-400 text-sm">Build together, grow together</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {/* Search Input */}
                    <div className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-[#1e1e28] border border-[#2a2a38] rounded-xl">
                        <i className="ri-search-line text-gray-500"></i>
                        <input 
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent text-white placeholder-gray-500 outline-none text-sm w-40"
                        />
                    </div>
                    
                    {/* User Avatar with Dropdown */}
                    <div className="relative">
                        <div 
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="w-10 h-10 bg-gradient-to-br from-[#FC9986] to-[#FFB4A2] rounded-xl flex items-center justify-center shadow-lg shadow-[#FC9986]/25 cursor-pointer hover:scale-105 transition-transform"
                        >
                            <span className="text-[#1a1a24] font-semibold">{user?.email?.[0]?.toUpperCase() || 'U'}</span>
                        </div>
                        
                        {/* User Dropdown Menu */}
                        {showUserMenu && (
                            <div className="absolute right-0 top-12 w-56 bg-[#1e1e28] border border-[#2a2a38] rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50">
                                <div className="p-4 border-b border-[#2a2a38]">
                                    <p className="text-white font-medium truncate">{user?.email}</p>
                                    <p className="text-gray-500 text-xs mt-1">Logged in</p>
                                </div>
                                <div className="p-2">
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-[#FC9986] hover:bg-[#FC9986]/10 rounded-lg transition-all text-sm"
                                    >
                                        <i className="ri-logout-box-r-line"></i>
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Section Title */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-1">Your Projects</h2>
                <p className="text-gray-500 text-sm">
                    {searchQuery ? `Showing results for "${searchQuery}"` : 'Manage and collaborate on your projects'}
                </p>
            </div>
                
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">    
                {/* New Project Button */}        
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="group flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-br from-[#FC9986]/10 to-[#FFB4A2]/10 border-2 border-dashed border-[#FC9986]/40 rounded-2xl hover:border-[#FFB4A2]/70 hover:from-[#FC9986]/15 hover:to-[#FFB4A2]/20 transition-all duration-300 min-h-[180px]">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#FC9986]/30 to-[#FFB4A2]/30 rounded-2xl flex items-center justify-center group-hover:from-[#FC9986]/40 group-hover:to-[#FFB4A2]/40 group-hover:scale-110 transition-all duration-300">
                        <i className="ri-add-line text-3xl text-[#FC9986]"></i>
                    </div>
                    <span className="text-[#FC9986] font-medium group-hover:text-white transition-colors">Create New Project</span>
                </button>

                {/* Project cards list - filtered */}
                {
                    filteredProjects.map((proj) => (
                        <div key={proj._id}
                            onClick={() => {
                                navigate(`/project`, {
                                    state: { project: proj }
                                })
                            }}
                            className="group cursor-pointer p-6 bg-[#1e1e28] border border-[#2a2a38] rounded-2xl hover:border-[#FC9986]/50 hover:bg-[#252530] transition-all duration-300 min-h-[180px] flex flex-col justify-between hover:shadow-xl hover:shadow-[#FC9986]/10 hover:-translate-y-1">
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#FC9986]/30 to-[#FFB4A2]/30 rounded-xl flex items-center justify-center group-hover:from-[#FC9986]/40 group-hover:to-[#FFB4A2]/40 transition-all">
                                        <i className="ri-folder-3-fill text-xl text-[#FC9986]"></i>
                                    </div>
                                    <div className="w-8 h-8 rounded-lg bg-[#2a2a38] flex items-center justify-center group-hover:bg-[#FC9986]/30 transition-all">
                                        <i className="ri-arrow-right-up-line text-gray-500 group-hover:text-[#FC9986] transition-colors"></i>
                                    </div>
                                </div>
                                <h2 className='text-white font-semibold text-lg mb-2 group-hover:text-[#FC9986] transition-colors'>{proj.name}</h2>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <i className="ri-team-line text-sm"></i>
                                    <span className="text-sm">{proj.users?.length || 0} collaborators</span>
                                </div>
                                <div className="flex -space-x-2">
                                    {proj.users?.slice(0, 3).map((u, i) => (
                                        <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FC9986] to-[#FFB4A2] border-2 border-[#1e1e28] flex items-center justify-center text-[10px] text-[#1a1a24] font-medium">
                                            {u.email?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    ))}
                                    {proj.users?.length > 3 && (
                                        <div className="w-6 h-6 rounded-full bg-[#2a2a38] border-2 border-[#1e1e28] flex items-center justify-center text-[10px] text-gray-300">
                                            +{proj.users.length - 3}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                }

                {/* No results message */}
                {searchQuery && filteredProjects.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                        <i className="ri-search-line text-4xl mb-3"></i>
                        <p>No projects found matching "{searchQuery}"</p>
                    </div>
                )}
            </div>


            {/* Create Project Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
                    <div className="bg-[#1e1e28] p-8 rounded-2xl shadow-2xl shadow-[#FC9986]/10 w-full max-w-md border border-[#2a2a38] mx-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-white">Create New Project</h2>
                            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-lg bg-[#2a2a38] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#3a3a48] transition-all">
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>
                        <form onSubmit={createProject}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-400 mb-2">Project Name</label>
                                <input
                                    onChange={(e) => setProjectName(e.target.value)}
                                    value={projectName}
                                    type="text"
                                    placeholder="Enter project name"
                                    className="w-full px-4 py-3.5 rounded-xl bg-[#151518] text-white placeholder-gray-500 border border-[#2a2a38] focus:border-[#FC9986] focus:outline-none focus:ring-2 focus:ring-[#FC9986]/20 transition-all"
                                    required />
                            </div>
                            <div className="flex gap-3">
                                <button type="button" className="flex-1 px-4 py-3 bg-[#2a2a38] hover:bg-[#3a3a48] text-gray-300 rounded-xl font-medium transition-colors" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-[#FC9986] to-[#FFB4A2] hover:from-[#e88a78] hover:to-[#ffa390] text-[#1a1a24] rounded-xl font-medium transition-all shadow-lg shadow-[#FC9986]/25">Create Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Click outside to close menu */}
            {showUserMenu && (
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
            )}
        </main>
    )
}

export default Home