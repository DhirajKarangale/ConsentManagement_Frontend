import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { uri_allconsents, uri_updateuserConsent, uri_checkuserconsent } from "../utils/APIs";
import { getRequest, postRequest } from "../utils/APIManager";
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
        isAccepted: boolean,
    }

    const navigate = useNavigate();

    const user = useSelector((state: RootState) => state.user);
    const organization = useSelector((state: RootState) => state.organization);

    const [msg, setMsg] = useState<string>("");
    const [msgColor, setMsgColor] = useState<string>("text-danger");
    const [isContinueBtn, setIsContinueBtn] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [consents, setConsnets] = useState<Consnet[]>([]);
    const [selectedConsent, setSelectedConsent] = useState<Consnet | null>(null);

    useEffect(() => {
        checkLogin();
        loadConsents();
    }, []);

    function checkLogin() {
        if (!user || !organization) {
            navigate('/login');
        }
    }

    async function loadConsents() {
        const response = await getRequest<Consnet[]>(`${uri_allconsents}/${organization?.id}`);

        if (response.success) {
            if (response.data) {
                const fetchedConsents = response.data;
                await setUserConsent(fetchedConsents);
            }
            else setConsnets([]);
        } else {
            setConsnets([]);
        }
    }

    async function setUserConsent(consentsToCheck: Consnet[]) {
        if (!user?.id) return;

        const updatedConsents: Consnet[] = [];

        for (const consent of consentsToCheck) {
            try {
                const response = await getRequest<{ isAccepted: boolean }>(`${uri_checkuserconsent}/${consent.id}/${user.id}`);
                const isAccepted = response.data?.isAccepted ?? false;

                updatedConsents.push({
                    ...consent,
                    isAccepted: isAccepted,
                });
            } catch (err) {
                updatedConsents.push({ ...consent, isAccepted: false });
            }
        }

        setConsnets(updatedConsents);
    }

    async function selectConsent(consent: Consnet) {
        setSelectedConsent(consent);
        setShowModal(true);
    }

    async function setConsent(isAccepted: boolean) {
        const uri = `${uri_updateuserConsent}/${user?.id}/${selectedConsent?.id}/${isAccepted}`
        const response = await postRequest(uri, {});

        if (response.success) {

            setConsnets(prev =>
                prev.map(item =>
                    item.id === selectedConsent?.id
                        ? { ...item, isAccepted: isAccepted }
                        : item
                )
            );

            setMsg(`Consent '${selectedConsent?.name}' ${isAccepted ? "ACCEPTED" : "REJECTED"}`);
            setMsgColor('text-success');
        } else {
            setMsgColor('text-danger');
            setMsg('Error in adding consent, ' + response.error);
        }

        setTimeout(() => { setMsg(''); }, 1000);
        setShowModal(false);
        const canContinue = consents.every(c => c.isAccepted || c.isOptional);
        setIsContinueBtn(canContinue);
    }

    function uiModel() {
        return (
            <>
                {showModal && selectedConsent && (
                    <div
                        className="modal d-block m-0 p-0"
                        tabIndex={-1}
                        role="dialog"
                        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    >
                        <div className="modal-dialog modal-lg" role="document">
                            <div className="m-0 p-0 modal-content" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>

                                <div className="m-0 p-1 ms-1 me-1 modal-header" style={{ flexShrink: 0 }}>
                                    <h5 className="modal-title" style={{ fontSize: '1.2rem ' }}>Consent Details</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>

                                <div className="modal-body m-0 p-2" style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '1rem', }}>
                                    <p className="m-1 p-0"><strong>ID:</strong> {selectedConsent.id}</p>
                                    <p className="m-1 p-0"><strong>Organization ID:</strong> {selectedConsent.organizationId}</p>
                                    <p className="m-1 p-0"><strong>Name:</strong> {selectedConsent.name}</p>
                                    <p className="m-1 p-0"><strong>Version:</strong> {selectedConsent.version}</p>
                                    <p className="m-1 p-0"><strong>Is Optional:</strong> {selectedConsent.isOptional ? 'Yes' : 'No'}</p>
                                    <p className="m-1 p-0"><strong>Status:</strong> {selectedConsent.status}</p>
                                    <p className="m-1 p-0"><strong>Created On:</strong> {new Date(selectedConsent?.createdAt).toDateString()}</p>
                                    <p className="m-1 p-0"><strong>Expiry:</strong> {new Date(selectedConsent?.expiry).toDateString()}</p>
                                    <p className="m-1 p-0"><strong>Description:</strong></p>
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

                                        <div className="d-flex gap-3 align-self-end">
                                            {!selectedConsent.isAccepted ? <button className={`btn btn-sm ${selectedConsent.status === 'ACCEPTED' ? 'btn-success' : 'btn-outline-success'}`}
                                                onClick={() => { setConsent(true); }}>ACCEPT</button> :
                                                <button className={`btn btn-sm ${selectedConsent.status === 'REJECTED' ? 'btn-danger' : 'btn-outline-danger'}`}
                                                    onClick={() => { setConsent(false); }}>REJECT</button>}
                                            <button className="btn btn-secondary" onClick={() => { setShowModal(false) }}>Close</button>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

    function uiConsents() {
        return (
            <div className="row p-0 m-0">

                <div className="list-group">
                    {consents.map(consent => (
                        <div
                            key={consent.id}
                            className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center border-white mb-2">
                            <div>
                                <strong>{consent.name}{!consent.isOptional && <span className="text-light"> * </span>}</strong>
                                <span className="text-light">({consent.version})</span>
                            </div>
                            <div className="btn-group">
                                {
                                    !consent.isAccepted ? <button
                                        className={`btn btn-sm ${consent.status === 'ACCEPTED' ? 'btn-success' : 'btn-outline-success'}`}
                                        onClick={() => selectConsent(consent)}> Accept </button>
                                        :
                                        <button
                                            className={`btn btn-sm ${consent.status === 'REJECTED' ? 'btn-danger' : 'btn-outline-danger'}`}
                                            onClick={() => selectConsent(consent)}>Reject</button>
                                }
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-4">
                    <button className="btn btn-primary px-4 py-2" disabled={isContinueBtn} onClick={() => navigate('/dashboard')} >Continue</button>
                </div>

            </div>
        );
    }


    return (
        <div className="container">
            <h1 className="text-center fw-bold display-6 mt-3" style={{ fontSize: '2.0rem' }}>{organization?.name}<hr /> </h1>
            <p className={`m-0 p-0 fw-bold text-center ${msgColor}`} style={{ minHeight: "1.5em", fontSize: '0.8rem' }}>{msg}</p>

            <div className="container my-5">
                {uiConsents()}
                {uiModel()}
            </div>
        </div>
    );
}