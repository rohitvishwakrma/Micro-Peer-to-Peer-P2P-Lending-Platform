import { Link } from "react-router-dom";

export default function LenderDashboard() {
    return (
        <div>
            <h1>Lender Dashboard</h1>
            <p>Welcome to your dashboard! Here you can view your loans, manage your profile, and explore the marketplace.</p>
            <Link to="/marketplace" className="text-blue-500 hover:underline">Explore Loan Marketplace</Link>
        </div>
    );
}