import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { uri_allconsents, uri_organizationupdate, uri_consentsupdate } from "../utils/APIs";
import { getRequest, putRequest } from "../utils/APIManager";
import { type RootState } from "../store/store";

export default function Organization() {

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

    const admin = useSelector((state: RootState) => state.admin);
    const organization = useSelector((state: RootState) => state.organization);

    const [msg, setMsg] = useState<string>("");
    const [msgColor, setMsgColor] = useState<string>("text-danger");
    const [statusOrganization, setStatusOrganization] = useState<string>();
    const [showModal, setShowModal] = useState(false);
    const [consent, setConsnet] = useState<Consnet[]>([]);
    const [statusConsnet, setStatusConsnet] = useState<string>();
    const [selectedConsent, setSelectedConsent] = useState<Consnet | null>(null);

    useEffect(() => {
        checkLogin();
        loadConsents();
        setStatusOrganization(organization?.status);
    }, []);

    function checkLogin() {
        if (!admin || !organization) {
            navigate('/login');
        }
    }

    async function loadConsents() {
        const response = await getRequest<Consnet[]>(`${uri_allconsents}/${organization?.id}`);

        if (response.success) {
            if (response.data) setConsnet(response.data);
            else setConsnet([]);
        } else {
            setConsnet([]);
        }
    }


    async function consentSetStatus() {
        const uri = `${uri_consentsupdate}/${selectedConsent?.id}/${statusConsnet}`
        const response = await putRequest(uri, {});

        if (response.success) {

            setConsnet(prev =>
                prev.map(item =>
                    item.id === selectedConsent?.id
                        ? { ...item, status: statusConsnet ?? item.status }
                        : item
                )
            );

            setMsg(`Consent '${selectedConsent?.name}' status updated to ${statusConsnet}`);
            setMsgColor('text-success');
        } else {
            setMsgColor('text-danger');
            setMsg('Error in adding consent, ' + response.error);
        }

        setTimeout(() => { setMsg(''); }, 1000);
        setShowModal(false);
    }

    async function organizationSetStatus() {
        const uri = `${uri_organizationupdate}/${organization?.id}/${statusOrganization}`
        const response = await putRequest(uri, {});

        if (response.success) {
            setMsg(`Organization '${organization?.name}' status updated to ${statusOrganization}`);
            setMsgColor('text-success');
        } else {
            setMsgColor('text-danger');
            setMsg('Error in adding consent, ' + response.error);
        }

        setTimeout(() => { setMsg(''); }, 1000);
        setShowModal(false);
    }



    function uiOrganizationInfo() {
        return (
            <>
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

                    <div className="card-footer">
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 w-100">
                            <div className="flex-grow-1">
                                <label className="form-label mb-1">Status</label>
                                <select
                                    className="form-select"
                                    value={statusOrganization}
                                    onChange={(e) => setStatusOrganization(e.target.value)}
                                >
                                    <option value="PENDING">PENDING</option>
                                    <option value="APPROVED">APPROVED</option>
                                    <option value="REJECTED">REJECTED</option>
                                    <option value="EXPIRED">EXPIRED</option>
                                </select>
                            </div>

                            <div className="align-self-end">
                                <button className="btn btn-info" onClick={() => { organizationSetStatus(); }}>
                                    Continue
                                </button>
                            </div>
                        </div>

                    </div>

                </div>
            </>
        );
    }

    function uiConsents() {
        return (
            <>
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
                                            setStatusConsnet(item.status);
                                            setSelectedConsent(item);
                                            setShowModal(true);

                                        }} className="btn btn-dark">More</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {showModal && selectedConsent && (
                        <div
                            className="modal d-block"
                            tabIndex={-1}
                            role="dialog"
                            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                        >
                            <div className="modal-dialog modal-lg" role="document">
                                <div className="modal-content" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>

                                    <div className="modal-header" style={{ flexShrink: 0 }}>
                                        <h5 className="modal-title">Consent Details</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                    </div>

                                    <div className="modal-body" style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '1rem', }}>
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

                                    <div className="modal-footer">
                                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 w-100">
                                            <div className="flex-grow-1">
                                                <label className="form-label mb-1">Status</label>
                                                <select
                                                    className="form-select"
                                                    value={statusConsnet}
                                                    onChange={(e) => setStatusConsnet(e.target.value)}
                                                >
                                                    <option value="PENDING">PENDING</option>
                                                    <option value="APPROVED">APPROVED</option>
                                                    <option value="REJECTED">REJECTED</option>
                                                    <option value="EXPIRED">EXPIRED</option>
                                                </select>
                                            </div>

                                            <div className="d-flex gap-3 align-self-end">
                                                <button className="btn btn-info" onClick={() => { consentSetStatus(); }}>Continue</button>
                                                <button className="btn btn-secondary" onClick={() => { setShowModal(false) }}>Close</button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </>
        );
    }


    return (
        <div className="container">
            <h1 className="text-center fw-bold display-6 mt-3" style={{ fontSize: '2.0rem' }}>{organization?.name}<hr /> </h1>
            <p className={`m-0 p-0 fw-bold text-center ${msgColor}`} style={{ minHeight: "1.5em", fontSize: '0.8rem' }}>{msg}</p>

            <div className="container my-5">
                {uiOrganizationInfo()}
                {uiConsents()}
            </div>
        </div>
    );
}



/*

import { useState, useEffect } from "react";
import { uri_setstatus, uri_allconsent } from "./APIs";
import { getRequest, putRequest } from "./ApiManager";

export default function Consents() {

    type Consnet = {
        id: number,
        type: string,
        version: number,
        isOptional: boolean,
        createdBy: string,
        expiry: string,
        description: string,
        status: string,
        createdOn: string,
        approvedBy: string,
    }

    const [msg, setMsg] = useState<string>("");
    const [msgColor, setMsgColor] = useState<string>("text-danger");
    const [consent, setConsnet] = useState<Consnet[]>([]);

    const [selectedConsent, setSelectedConsent] = useState<Consnet | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [assignedBy, setAssignedBy] = useState("");
    const [status, setStatus] = useState("Active");


    useEffect(() => { loadConsents(); }, []);


    async function loadConsents() {
        const response = await getRequest<Consnet[]>(uri_allconsent);

        if (response.success) {
            if (response.data) {
                setConsnet(response.data);
            }
            else {
                setMsgColor('text-success');
                setMsg('Consent not available');
            }
        } else {
            setConsnet([]);
            setMsgColor('text-danger');
            setMsg('Error in getting consents, ' + response.error);
        }

        setTimeout(() => { setMsg(''); }, 1000);
    }

    async function handelSetStatus() {
        const uri = `${uri_setstatus}/${selectedConsent?.id}`
        const body = {
            "approvedBy": assignedBy,
            "status": status
        }
        console.log(uri);
        const response = await putRequest(uri, body);

        if (response.success) {
            setMsg(`Consent ${selectedConsent?.id} ${status} by ${assignedBy}`);
            setMsgColor('text-success');
        } else {
            setMsgColor('text-danger');
            setMsg('Error in adding consent, ' + response.error);
        }

        setTimeout(() => { setMsg(''); }, 1000);
    }

    return (
        <>
            <div className="container">

                <h1 className="text-center display-6 mt-0" style={{ fontSize: '2.0rem' }}>Consents <hr /> </h1>
                <p className={`m-0 p-0 fw-bold text-center ${msgColor}`} style={{ minHeight: "1.5em", fontSize: '0.8rem' }}>{msg}</p>

                <div className="row p-0 m-0">

                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Type</th>
                                <th>Version</th>
                                <th>Is Optional</th>
                                <th>Created By</th>
                                <th>Status</th>
                                <th>More</th>
                            </tr>
                        </thead>
                        <tbody>
                            {consent.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.type}</td>
                                    <td>{item.version}</td>
                                    <td>{item.isOptional ? 'Yes' : 'No'}</td>
                                    <td>{item.createdBy}</td>
                                    <td>{item.status}</td>
                                    <td>
                                        <button onClick={() => {
                                            setStatus(item.status);
                                            setSelectedConsent(item);
                                            setShowModal(true);

                                        }} className="btn btn-dark">More</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {showModal && selectedConsent && (
                        <div
                            className="modal d-block"
                            tabIndex={-1}
                            role="dialog"
                            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                        >
                            <div className="modal-dialog modal-lg" role="document">
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
                                        <p><strong>Type:</strong> {selectedConsent.type}</p>
                                        <p><strong>Version:</strong> {selectedConsent.version}</p>
                                        <p><strong>Is Optional:</strong> {selectedConsent.isOptional ? 'Yes' : 'No'}</p>
                                        <p><strong>Created By:</strong> {selectedConsent.createdBy}</p>
                                        <p><strong>Status:</strong> {selectedConsent.status}</p>
                                        <p><strong>Approved By:</strong> {selectedConsent.approvedBy}</p>
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
                                        <p><strong>Created On:</strong> {selectedConsent.createdOn}</p>
                                        <p><strong>Expiry:</strong> {selectedConsent.expiry}</p>
                                    </div>

                                    <div className="modal-footer" style={{ flexShrink: 0 }}>
                                        <div className="container-fluid">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label className="form-label">Assigned By</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={assignedBy}
                                                        onChange={(e) => setAssignedBy(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Status</label>
                                                    <select
                                                        className="form-select"
                                                        value={status}
                                                        onChange={(e) => setStatus(e.target.value)}
                                                    >
                                                        <option value="APPROVED">APPROVED</option>
                                                        <option value="CREATED">CREATED</option>
                                                        <option value="REJECTED">REJECTED</option>
                                                        <option value="EXPIRED">EXPIRED</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-end mt-3">
                                                <button
                                                    className="btn btn-primary me-2"
                                                    onClick={() => {
                                                        console.log("Assigned By:", assignedBy);
                                                        console.log("Status:", status);
                                                        handelSetStatus();
                                                        setShowModal(false);
                                                    }}
                                                >
                                                    Continue
                                                </button>
                                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                                    Close
                                                </button>
                                            </div>
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

*/