import React, { useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import { getCurrentUser } from "./services/api";
import { useDispatch, useSelector } from "react-redux"
import Notes from "./pages/Notes.jsx";
import History from "./pages/History.jsx";
import Pricing from "./pages/Pricing.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PaymentFailed from "./pages/PaymentFailed.jsx";
// In your frontend config or App.jsx
export const serverUrl = "http://localhost:3000";
function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    getCurrentUser(dispatch)
  }, [dispatch])

  const { userData } = useSelector((state) => state.user)
  // console.log(userData)

  return (
    <>
      <Routes>
        <Route path='/' element={userData? <Home />:<Navigate to="/auth"/>} />
        <Route path='/auth' element={userData? <Navigate to="/" replace/>:<Auth />} />
        <Route path='/history' element={<History />} />
        <Route path='/notes' element={<Notes />} />
        <Route path='/pricing' element={<Pricing />} />

                  <Route path='/payment-success' element={<PaymentSuccess />} />
        <Route path='/payment-failed' element={<PaymentFailed />} />

        <Route path='*' element={<Navigate to='/' replace />} />

      </Routes>

    </>
  )
}
export default App
