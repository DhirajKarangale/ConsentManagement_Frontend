import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { type AppDispatch } from "../store/store";
import { type User } from "../store/user-slice";

import { postRequest } from "../utils/APIManager";
import { uri_login } from "../utils/APIs";
import { setUser } from "../store/user-slice";

export default function Home() {

    const navigate = useNavigate();

    interface UserData {
        email: string;
        password: string;
    }

    const initOrganizationData: UserData = {
        email: '',
        password: '',
    };

    const dispatch = useDispatch<AppDispatch>();
    const [msg, setMsg] = useState<string>("");
    const [msgColor, setMsgColor] = useState<string>("text-danger");
    const [formData, setFormData] = useState<UserData>(initOrganizationData);
    const [formErrors, setFormErrors] = useState<UserData>(initOrganizationData);


    function reset() {
        setMsg('');
        setFormData(initOrganizationData);
        setFormErrors(initOrganizationData);
    }

    function validateField(name: string, value: string) {
        const errors: UserData = { ...formErrors };

        switch (name) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!value.trim()) {
                    errors.email = 'Email is required';
                } else if (!emailRegex.test(value)) {
                    errors.email = 'Enter a valid email';
                } else {
                    errors.email = '';
                }
                break;

            case 'password':
                if (value.length < 3) {
                    errors.password = 'Password length should be greater than 3';
                } else {
                    errors.password = '';
                }
                break;
        }

        setFormErrors(errors);
    }

    function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        e.preventDefault();

        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    }

    async function login(e: React.FormEvent) {
        e.preventDefault();

        const response = await postRequest(uri_login, formData);

        if (response.success) {
            dispatch(setUser(response.data as User));
            setMsg('Login successfully');
            setMsgColor('text-success');
            navigate('/');
        } else {
            setMsgColor('text-danger');
            setMsg('Error in login, ' + response.error);
        }

        setTimeout(() => { reset(); }, 1000);
    }

    function loginUI() {
        return (
            <form className="row align-items-center justify-content-center p-0 m-0">

                <div className="row p-0 m-0">

                    <div className="m-0 col-md-4 d-flex flex-column mb-2">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            id="email"
                            type="text"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={(e) => onChange(e)}
                            required
                        />
                        <p className="m-0 p-0 fw-bold text-danger" style={{ minHeight: "1.5em", fontSize: '0.8rem' }}>
                            {formErrors.email}
                        </p>
                    </div>

                    <div className="m-0 col-md-4 d-flex flex-column mb-2">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            id="password"
                            type="text"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={(e) => onChange(e)}
                            required
                        />
                        <p className="m-0 p-0 fw-bold text-danger" style={{ minHeight: "1.5em", fontSize: '0.8rem' }}>
                            {formErrors.password}
                        </p>
                    </div>

                </div>

                <div className="row p-0 m-0">
                    <div className="m-0 col-md-4 d-flex flex-row gap-3">
                        <button onClick={(e) => login(e)} type="button" className="btn btn-dark px-3 py-1">Login</button>
                    </div>
                </div>

            </form>
        );
    }
    return (
        <>
            <div className="container">
                <h1 className="text-center fw-bold display-6 mt-2" style={{ fontSize: '2.0rem' }}>Welcome to Consent Manager<hr /> </h1>
                <p className={`m-0 p-0 fw-bold text-center ${msgColor}`} style={{ minHeight: "1.5em", fontSize: '0.8rem' }}>{msg}</p>
                {loginUI()}
            </div>
        </>
    );
}