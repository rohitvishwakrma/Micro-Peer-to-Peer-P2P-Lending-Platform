import {Routes, Route} from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import LenderDashboard from "./pages/LenderDashboard.jsx";
import BorrowerDashboard from "./pages/BorrowerDashboard.jsx";

import Marketplace from "./pages/Marketplace.jsx"
import CreateLoan from "./pages/CreateLoan.jsx"

import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/lender" element={<ProtectedRoute><LenderDashboard /></ProtectedRoute>} />
            <Route path="/borrower" element={<ProtectedRoute><BorrowerDashboard /></ProtectedRoute>} />

            <Route path="/create-loan" element={<ProtectedRoute><CreateLoan /></ProtectedRoute>} />
            <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
        </Routes>
    );
}

export default App;