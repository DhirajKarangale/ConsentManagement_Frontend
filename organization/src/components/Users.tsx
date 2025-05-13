import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../store/store";
import { useNavigate } from "react-router-dom";

import { uri_users } from "../utils/APIs";
import { getRequest } from "../utils/APIManager";

export default function Users() {

    type User = {
        consentId: number,
        userId: string,
        userEmail: string,
        consentName: string,
        accepted: boolean,
        userName: string
    }

    const navigate = useNavigate();
    const organization = useSelector((state: RootState) => state.organization);
    const [user, setUser] = useState<User[]>([]);


    useEffect(() => {
        checkLogin();
        getUsers();
    }, []);


    function checkLogin() {
        if (!organization) {
            navigate('/login');
        }
    }

    async function getUsers() {
        const response = await getRequest<User[]>(`${uri_users}/${organization?.id}`);

        if (response.success) {
            if (response.data) setUser(response.data);
            else setUser([]);
        } else {
            setUser([]);
        }
    }


    return (
        <>
            <div className="container">

                <h1 className="text-center display-6 mt-3" style={{ fontSize: '2.0rem' }}>Users <hr /> </h1>

                <div className="row p-0 m-0">

                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>User Id</th>
                                <th>User Name</th>
                                <th>User Email</th>
                                <th>Consent Name</th>
                                <th>Consent Id</th>
                                <th>Accepted</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.userId}</td>
                                    <td>{item.userName}</td>
                                    <td>{item.userEmail}</td>
                                    <td>{item.consentName}</td>
                                    <td>{item.consentId}</td>
                                    <td>{item.accepted ? 'Yes' : 'No'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>

            </div>
        </>
    );
}