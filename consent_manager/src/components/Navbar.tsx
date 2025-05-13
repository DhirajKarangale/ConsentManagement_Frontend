import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from "react-redux";
import { type RootState } from "../store/store";

export default function Navbar() {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const user = useSelector((state: RootState) => state.user);
    const toggleNavbar = () => setIsCollapsed(!isCollapsed);

    if (!user) return null;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4" >
            <NavLink to="/" className={({ isActive }) => isActive ? 'navbar-brand active' : 'navbar-brand fw-light'}>
                ConsentManager
            </NavLink>

            <button
                className="navbar-toggler"
                type="button"
                onClick={toggleNavbar}
                aria-controls="navbarNav"
                aria-expanded={!isCollapsed}
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`} id="navbarNav">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <NavLink to="/consents" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            Consents
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav >

    );
}