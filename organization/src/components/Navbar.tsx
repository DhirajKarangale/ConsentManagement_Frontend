import { NavLink } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleNavbar = () => setIsCollapsed(!isCollapsed);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
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
                        <NavLink to="/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            Users
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/consents" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            Consents
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/addconsents" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            AddConsents
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
}