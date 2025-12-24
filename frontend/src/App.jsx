import React from 'react'
import AppRoutes from './routes/AppRoutes'
import { UserProvider } from './context/user.context' 
import { Toaster } from 'react-hot-toast' // Toast notifications
import 'remixicon/fonts/remixicon.css'
const App = () => {
  return (
    <UserProvider>
           <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a23',
            color: '#fff',
            border: '1px solid #2d2d3a',
          },
          success: {
            iconTheme: {
              primary: '#9333ea',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <AppRoutes />
  </UserProvider>

  )
}

export default App
