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
    const admin = useSelector((state: RootState) => state.admin);
    const [organizationState, setOrganizationState] = useState<Organization[]>([]);


    useEffect(() => {
        checkLogin();
        loadOrganizations();
    }, []);

    function checkLogin() {
        if (!admin) {
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

                <div className="row p-0 m-0">

                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Status</th>
                                <th>More</th>
                            </tr>
                        </thead>
                        <tbody>
                            {organizationState.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.status}</td>
                                    <td>
                                        <button onClick={() => {
                                            dispatch(setOrganization(item));
                                            navigate('/organization');
                                        }} className="btn btn-dark">More</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>

            </div>
        </>
    );
}