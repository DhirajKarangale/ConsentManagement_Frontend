import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../store/store";
import { useNavigate } from "react-router-dom";

import { getRequest } from "../utils/APIManager";
import { uri_allconsents } from "../utils/APIs";


export default function Consents() {

    type Consnet = {
        id: number,
        organizationId: number,
        name: string,
        isOptional: boolean,
        version: number,
        description: string,
        expiry: Date,
        status: string,
        createdAt: Date,
    }

    const navigate = useNavigate();
    const organization = useSelector((state: RootState) => state.organization);

    const [showModal, setShowModal] = useState(false);
    const [consent, setConsnet] = useState<Consnet[]>([]);
    const [selectedConsent, setSelectedConsent] = useState<Consnet | null>(null);


    useEffect(() => {
        checkLogin();
        loadConsents();
    }, []);

    function checkLogin() {
        if (!organization) {
            navigate('/login');
        }
    }

    async function loadConsents() {
        const response = await getRequest<Consnet[]>(`${uri_allconsents}/1`);

        if (response.success) {
            if (response.data) setConsnet(response.data);
            else setConsnet([]);
        } else {
            setConsnet([]);
        }
    }

    return (
        <>
            <div className="container">

                <h1 className="text-center display-6 mt-3" style={{ fontSize: '2.0rem' }}>Consents <hr /> </h1>

                <div className="row p-0 m-0">

                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Name</th>
                                <th>Version</th>
                                <th>Is Optional</th>
                                <th>Status</th>
                                <th>More</th>
                            </tr>
                        </thead>
                        <tbody>
                            {consent.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.version}</td>
                                    <td>{item.isOptional ? 'Yes' : 'No'}</td>
                                    <td>{item.status}</td>
                                    <td>
                                        <button onClick={() => {
                                            setSelectedConsent(item);
                                            setShowModal(true);
                                        }} className="btn btn-dark">More</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {showModal && selectedConsent && (
                        <div className="modal d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                                <div className="modal-content" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>

                                    <div className="modal-header" style={{ flexShrink: 0 }}>
                                        <h5 className="modal-title">Consent Details</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                    </div>

                                    <div
                                        className="modal-body"
                                        style={{
                                            overflowY: 'auto',
                                            flexGrow: 1,
                                            paddingRight: '1rem',
                                        }}
                                    >
                                        <p><strong>ID:</strong> {selectedConsent.id}</p>
                                        <p><strong>Organization ID:</strong> {selectedConsent.organizationId}</p>
                                        <p><strong>Name:</strong> {selectedConsent.name}</p>
                                        <p><strong>Version:</strong> {selectedConsent.version}</p>
                                        <p><strong>Is Optional:</strong> {selectedConsent.isOptional ? 'Yes' : 'No'}</p>
                                        <p><strong>Status:</strong> {selectedConsent.status}</p>
                                        <p><strong>Created On:</strong> {new Date(selectedConsent?.createdAt).toDateString()}</p>
                                        <p><strong>Expiry:</strong> {new Date(selectedConsent?.expiry).toDateString()}</p>
                                        <p><strong>Description:</strong></p>
                                        <div
                                            style={{
                                                border: "1px solid #ccc",
                                                padding: "0.5rem",
                                                borderRadius: "4px",
                                                maxHeight: "200px",
                                                overflowY: "auto",
                                                whiteSpace: "pre-wrap"
                                            }}
                                        >
                                            {selectedConsent.description}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}

                </div>

            </div>
        </>
    );
}