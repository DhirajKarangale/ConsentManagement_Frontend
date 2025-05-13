import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { type RootState } from "../store/store";

export default function Organization() {

    const navigate = useNavigate();
    const admin = useSelector((state: RootState) => state.admin);
    const organization = useSelector((state: RootState) => state.organization);

    useEffect(() => { checkLogin(); }, []);

    function checkLogin() {
        if (!admin || !organization) {
            navigate('/login');
        }
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

                    </div>
                </div>
            </div>

        </div>
    );
}