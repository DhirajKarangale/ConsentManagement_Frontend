import { useNavigate } from "react-router-dom";

export default function Unknown() {
    const navigate = useNavigate();

    return (
        <>
            <div className="container">
                <h1 className="text-center fw-bold display-6 mt-0" style={{ fontSize: '2.0rem' }}>Unknown<hr /> </h1>
            </div>
        </>
    );
}