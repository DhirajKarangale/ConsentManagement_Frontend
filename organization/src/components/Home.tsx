import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { type AppDispatch } from "../store/store";
import { type RootState } from "../store/store";
import { clearOrganization } from "../store/organization-slice";

export default function Home() {

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const organization = useSelector((state: RootState) => state.organization);

    useEffect(() => { checkLogin(); }, []);

    function checkLogin() {
        if (!organization) {
            navigate('/login');
        }
    }

    function logout() {
        dispatch(clearOrganization());
        navigate('/login');
    }

    return (
        <div className="container">
            <h1 className="text-center fw-bold display-6 mt-3" style={{ fontSize: '2.0rem' }}>{organization?.name}<hr /> </h1>

            <div className="container my-5">
                <div className="card bg-dark text-white shadow p-4 rounded">
                    <div className="card-body">

                        <div className="mb-2">
                            <strong>ID:</strong> {organization?.id}
                        </div>

                        <div className="mb-2">
                            <strong>Name:</strong> {organization?.name}
                        </div>

                        <div className="mb-2">
                            <strong>Email:</strong>{' '}
                            <span className="text-light">{organization?.email}</span>
                        </div>

                        <div className="mb-2">
                            <strong>Password:</strong> {organization?.password}
                        </div>

                        <div className="mb-2">
                            <strong>Website:</strong>{' '}
                            <a href={organization?.websiteURL} className="text-white" target="_blank" rel="noreferrer">
                                {organization?.websiteURL}
                            </a>
                        </div>

                        <div className="mb-2">
                            <strong>Status:</strong> {organization?.status}
                        </div>

                        <div className="mb-2">
                            <strong>Created At:</strong>{' '}
                            {organization && new Date(organization?.createdAt).toDateString()}
                        </div>

                        <hr className="border-light my-4" />

                        <div>
                            <strong>Description:</strong>
                            <p className="mt-2" style={{ whiteSpace: 'pre-wrap' }}>
                                {organization?.description}
                            </p>
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