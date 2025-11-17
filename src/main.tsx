import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Cakes from './pages/Cakes'
import Login from './pages/Login'
import Admin from './pages/Admin'

const router = createBrowserRouter([
  { path: '/', element: <Cakes/> },
  { path: '/login', element: <Login/> },
  { path: '/admin', element: <Admin/> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
