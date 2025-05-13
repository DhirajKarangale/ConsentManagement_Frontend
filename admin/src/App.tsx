import { Provider } from "react-redux"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './utils/style.css'
import { store } from "./store/store"

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Unknown from "./components/Unknown";
import Login from "./components/Login";
import Organization from "./components/Organization";
import OrganizationList from "./components/OrganizationList";

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/organization" element={<Organization />} />
          <Route path="/organizationlist" element={<OrganizationList />} />
          <Route path="*" element={<Unknown />} />
        </Routes>
      </Router>
    </Provider>
  )
}