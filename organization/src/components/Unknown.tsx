import { useNavigate } from "react-router-dom";

export default function Unknown() {
    const navigate = useNavigate();

    function home() { navigate('/'); }
    function login() { navigate('/login'); }

    return (
        <>
            <div className="container">
                <h1 className="text-center fw-bold display-6 mt-3" style={{ fontSize: '2.0rem' }}>Page not found<hr /> </h1>

                <div className="d-flex align-items-center justify-content-center gap-3">
                    <button className="btn btn-dark px-3 py-1" onClick={home}>Home</button>
                    <button className="btn btn-dark px-3 py-1" onClick={login}>Login</button>
                </div>

            </div>
        </>
    );
}