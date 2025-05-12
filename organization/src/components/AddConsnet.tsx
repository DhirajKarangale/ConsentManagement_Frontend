import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../store/store";
import { useNavigate } from "react-router-dom";

import { uri_addconsent } from "../utils/APIs";
import { postRequest } from "../utils/APIManager";

export default function AddConsents() {

    interface Consnet {
        name: string;
        version: number;
        isOptional: boolean;
        expiry: string;
        description: string;
    }

    interface Errors {
        name: string;
        version: string;
        isOptional: string;
        expiry: string;
        description: string;
    }

    const initFormData: Consnet = {
        name: '',
        version: 0,
        isOptional: false,
        expiry: '',
        description: '',
    };

    const initFormErrors: Errors = {
        name: '',
        version: '',
        isOptional: '',
        expiry: '',
        description: '',
    };

    const navigate = useNavigate();
    const organization = useSelector((state: RootState) => state.organization);

    const [msg, setMsg] = useState<string>("");
    const [msgColor, setMsgColor] = useState<string>("text-danger");
    const [btnStatus, setBtnStatus] = useState<boolean>(true);
    const [formData, setFormData] = useState<Consnet>(initFormData);
    const [formErrors, setFormErrors] = useState<Errors>(initFormErrors);

    useEffect(() => { checkLogin(); }, []);

    function checkLogin() {
        if (!organization) {
            navigate('/login');
        }
    }

    function validateField(name: string, value: string) {
        const errors: Errors = { ...formErrors };

        switch (name) {
            case 'type':
                if (value.length < 3) {
                    errors.name = 'Name length should be greater than 3';
                } else {
                    errors.name = '';
                }
                break;

            case 'version':
                const versionValue = parseFloat(value as string);
                if (!value || versionValue <= 0) {
                    errors.version = 'Version must be greater than 0';
                } else {
                    errors.version = '';
                }
                break;

            case 'description':
                if (value.length < 10) {
                    errors.description = 'Description should be at least 10 characters';
                } else {
                    errors.description = '';
                }
                break;

            case 'expiry':
                if (!value) {
                    errors.expiry = 'Expiry date is required';
                } else {
                    const today = new Date();
                    const selectedDate = new Date(value);

                    today.setHours(0, 0, 0, 0);
                    selectedDate.setHours(0, 0, 0, 0);

                    if (selectedDate <= today) {
                        errors.expiry = 'Expiry date must be in the future';
                    } else {
                        errors.expiry = '';
                    }
                }
                break;
        }

        setFormErrors(errors);

        const hasErrors = Object.values(errors).some((error) => error !== '');
        setBtnStatus(hasErrors);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value, type } = e.target;

        setFormData((prev) => ({
            ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));

        validateField(name, value);
    }

    async function handelSubmit(e: any) {
        e.preventDefault();

        const body = {
            "organizationId": organization?.id,
            "name": formData.name,
            "version": formData.version,
            "description": formData.description,
            "isOptional": formData.isOptional,
            "expiry": formData.expiry
        }
        const response = await postRequest(uri_addconsent, body);

        if (response.success) {
            setFormData(initFormData);
            setFormErrors(initFormErrors);
            setMsg('Consent added successfully');
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

                <h1 className="text-center display-6 mt-0" style={{ fontSize: '2.0rem' }}>Add Consent <hr /> </h1>

                <p className={`m-0 p-0 fw-bold text-center ${msgColor}`} style={{ minHeight: "1.5em", fontSize: '0.8rem' }}>{msg}</p>

                <form className="row align-items-center p-0 m-0">

                    <div className="row p-0 m-0">

                        <div className="m-0 col-md-4 d-flex flex-column mb-2">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                className="form-control"
                                value={formData.name}
                                onChange={(e) => handleChange(e)}
                                required
                            />
                            <p className="m-0 p-0 fw-bold text-danger" style={{ minHeight: "1.5em", fontSize: '0.8rem' }}>
                                {formErrors.name}
                            </p>
                        </div>

                        <div className="m-0 col-md-4 d-flex flex-column mb-2">
                            <label htmlFor="version" className="form-label">Version</label>
                            <input
                                id="version"
                                type="number"
                                name="version"
                                min={0}
                                step={0.1}
                                className="form-control"
                                value={formData.version}
                                onChange={(e) => handleChange(e)}
                                required
                            />
                            <p className="m-0 p-0 fw-bold text-danger" style={{ minHeight: "1.5em", fontSize: '0.8rem' }}>
                                {formErrors.version}
                            </p>
                        </div>

                    </div>

                    <div className="row p-0 m-0">

                        <div className="m-0 col-md-4 d-flex flex-column mb-2">
                            <label htmlFor="expiry" className="form-label">Expiry</label>
                            <input
                                id="expiry"
                                type="date"
                                name="expiry"
                                className="form-control"
                                value={formData.expiry}
                                onChange={(e) => handleChange(e)}
                                required
                            />
                            <p className="m-0 p-0 fw-bold text-danger" style={{ minHeight: "1.5em", fontSize: '0.8rem' }}>
                                {formErrors.expiry}
                            </p>
                        </div>

                        <div className="m-0 col-md-4 d-flex flex-column mb-2">
                            <div className="m-0 p-0 form-check custom-checkbox d-flex flex-row gap-3 mt-4">
                                <label htmlFor="isOptional" className="form-label">Optional</label>
                                <div className="form-check">
                                    <input
                                        id="isOptional"
                                        type="checkbox"
                                        name="isOptional"
                                        className="form-check-input"
                                        checked={formData.isOptional}
                                        onChange={(e) => handleChange(e)}
                                    />
                                </div>
                                <p className="m-0 p-0 fw-bold text-danger" style={{ minHeight: "1.5em", fontSize: '0.8rem' }}>
                                    {formErrors.isOptional}
                                </p>
                            </div>
                        </div>

                    </div>

                    <div className="row p-0 m-0">

                        <div className="m-0 col-md-12 d-flex flex-column mb-2">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                className="form-control"
                                value={formData.description}
                                onChange={(e) => handleChange(e)}
                                required
                            />
                            <p className="m-0 p-0 fw-bold text-danger" style={{ minHeight: "1.5em", fontSize: '0.8rem' }}>
                                {formErrors.description}
                            </p>
                        </div>

                    </div>

                    <div className="row p-0 m-0">
                        <div className="m-0 p-0 col-12 d-flex justify-content-center">
                            <button onClick={(e) => handelSubmit(e)} disabled={btnStatus} type="submit" className="btn btn-dark px-3 py-1">
                                Submit
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </>
    );
}