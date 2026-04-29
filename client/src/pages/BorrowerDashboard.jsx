import { Link } from "react-router-dom";

export default function BorrowerDashboard() {
    return (
        <div>
            <h1>Borrower Dashboard</h1>
            <Link to="/create-loan" className="text-blue-500 hover:underline">Create a new loan request</Link>
        </div>
    );
}