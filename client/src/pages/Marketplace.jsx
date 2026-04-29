import { useState, useEffect } from "react";
import api from "../services/loanApi";
import LoanCard from "../components/Loader";

export default function Marketplace() {
    const [loans, setLoans] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("")

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            const res = await api.get("/marketplace");
            setLoans(res.data.loans)
            setLoading(false)
        }
        catch (error) {
            setError("Could not load loans")
            setLoading(false)
        }
    }

    if (loading) {
        return <p>Loading...</p>
    }
    
    if (error) {
        return <p>{error}</p>
    }
    
    return (
        <div>
            <h1>Loan Marketplace</h1>
            <p>Explore available loans from borrowers. You can fund any loan that interests you and help someone achieve their financial goals.</p>
            {loans.length === 0 ? (
                <p>No loans available at the moment. Please check back later.</p>
            ) : (
                <div>
                    {loans.map((loan) => (
                        <LoanCard key={loan._id} loan={loan} />
                    ))}
                </div>
            )}
        </div>
    )
}