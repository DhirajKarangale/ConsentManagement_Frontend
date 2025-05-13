import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../store/store";
import { useNavigate } from "react-router-dom";

import { getRequest } from "../utils/APIManager";
import { uri_organizationall } from "../utils/APIs";
import { type AppDispatch } from "../store/store";
import { setOrganization } from "../store/organization-slice";


export default function OrganizationList() {

    type Organization = {
        id: number,
        name: string,
        status: string,

        email: string,
        password: string,
        websiteURL: string,
        description: string,
        createdAt: Date,
    }

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user);
    const [organizationState, setOrganizationState] = useState<Organization[]>([]);


    useEffect(() => {
        checkLogin();
        loadOrganizations();
    }, []);

    function checkLogin() {
        if (!user) {
            navigate('/login');
        }
    }

    async function loadOrganizations() {
        const response = await getRequest<Organization[]>(uri_organizationall);

        if (response.success) {
            if (response.data) setOrganizationState(response.data);
            else setOrganizationState([]);
        } else {
            setOrganizationState([]);
        }
    }

    return (
        <>
            <div className="container">

                <h1 className="text-center display-6 mt-3" style={{ fontSize: '2.0rem' }}>Organizations <hr /> </h1>

                <div className="row">
                    {organizationState.map((org) => (
                        <div key={org.id} className="col-md-6 col-lg-4 mb-4">
                            <div
                                className="card bg-dark text-white h-100 shadow-sm border-light"
                                style={{ cursor: "pointer", transition: "transform 0.2s" }}
                                onClick={() => {
                                    dispatch(setOrganization(org));
                                    navigate('/organization');
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            >
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{org.name}</h5>
                                    <p className="card-text text-white-50" style={{ fontSize: "0.9rem" }}>
                                        {org.description.length > 100
                                            ? org.description.slice(0, 100) + "..."
                                            : org.description}
                                    </p>

                                    <div className="mt-auto pt-3 border-top border-secondary">
                                        <p className="mb-1"><strong>ID:</strong> {org.id}</p>
                                        <p className="mb-1">
                                            <strong>Website:</strong>{" "}
                                            <a href={org.websiteURL} target="_blank" rel="noreferrer" className="text-white text-decoration-underline">
                                                {org.websiteURL}
                                            </a>
                                        </p>
                                        <p className="mb-0">
                                            <strong>Created:</strong> {new Date(org.createdAt).toDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );
}