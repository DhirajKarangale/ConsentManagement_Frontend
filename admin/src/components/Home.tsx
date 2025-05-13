import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { type AppDispatch } from "../store/store";
import { type RootState } from "../store/store";
import { clearAdmin } from "../store/admin-slice";

export default function Home() {

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const admin = useSelector((state: RootState) => state.admin);

    useEffect(() => { checkLogin(); }, []);

    function checkLogin() {
        if (!admin) {
            navigate('/login');
        }
    }

    function logout() {
        dispatch(clearAdmin());
        navigate('/login');
    }

    return (
        <div className="container">
            <h1 className="text-center fw-bold display-6 mt-3" style={{ fontSize: '2.0rem' }}>{admin?.name}<hr /> </h1>

            <div className="container my-5">
                <div className="card bg-dark text-white shadow p-4 rounded">
                    <div className="card-body">

                        <div className="mb-2">
                            <strong>ID:</strong> {admin?.id}
                        </div>

                        <div className="mb-2">
                            <strong>Name:</strong> {admin?.name}
                        </div>

                        <div className="mb-2">
                            <strong>Email:</strong>{' '}
                            <span className="text-light">{admin?.email}</span>
                        </div>

                        <div className="mb-2">
                            <strong>Password:</strong> {admin?.password}
                        </div>

                        <div className="d-flex justify-content-end mt-4">
                            <button className="btn btn-outline-light" onClick={logout}>
                                Logout
                            </button>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}