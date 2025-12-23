//axios is a bridge btw frontend and backend.It helps u send and recieve data easily using HTTP request.

import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, //base url of the api
})

// Use interceptor to dynamically add token on each request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token && token !== 'null' && token !== 'undefined') {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
//  const axiosInstance=axios.create({
//     baseURL:import.meta.env.VITE_API_URL, //base url of the api
//     headers:{
//       "Authorization": `Bearer ${localStorage.getItem('token')}`  //attach token to every request sent from frontend to backend  
    }
 
  
 )
 export default axiosInstance;