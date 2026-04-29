export default function LoanCard(
    { loan }
) {

    return (
        <div>

            <h3>
                ₹{loan.amount}
            </h3>

            <p>
                Purpose:
                {loan.purpose}
            </p>

            <p>
                Tenure:
                {loan.tenureMonths} months
            </p>

            <p>
                Status:
                {loan.status}
            </p>

            <p>
                Funded:
                ₹{loan.fundedAmount}
            </p>

        </div>
    )

}