//axios is a bridge btw frontend and backend.It helps u send and recieve data easily using HTTP request.

import axios from 'axios'

 const axiosInstance=axios.create({
    baseURL:import.meta.env.VITE_API_URL, //base url of the api
    headers:{
      "Authorization": `Bearer ${localStorage.getItem('token')}`  //attach token to every request sent from frontend to backend  
    }
 }

 )
 export default axiosInstance;