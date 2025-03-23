import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
  
import './App.css'
import AppRoutes from './Routes/AppRoutes'

import { UserProvider } from './context/user.context.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className=''>

      <UserProvider>
        <AppRoutes/>
      </UserProvider>
      
    </div>
  )
}

export default App
