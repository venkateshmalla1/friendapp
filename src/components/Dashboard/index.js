// src/components/Dashboard/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPeople } from "../../api";
import FormReg from "../FormReg";
import "./index.css";

const apiConstraints = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  error: "ERROR",
};

const Dashboard = () => {
  const [people, setPeople] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiConstraints.initial);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  useEffect(() => {
    const fetchPeople = async () => {
      setApiStatus(apiConstraints.inProgress);
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const data = await getAllPeople(token);

        if (Array.isArray(data)) {
          setPeople(data);
          setApiStatus(apiConstraints.success);
        } else {
          setApiStatus(apiConstraints.error);
        }
      } catch (err) {
        console.error("Error fetching people:", err);
        setApiStatus(apiConstraints.error);
      }
    };

    fetchPeople();
  }, [navigate]);

  const handlePersonAdded = (newPerson) => {
    setPeople((currentPeople) => [...currentPeople, newPerson]);
    setShowForm(false);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h2>Dashboard</h2>
        <div>
          <button
            type="button"
            className="btn btn-primary me-2"
            onClick={() => setShowForm((isVisible) => !isVisible)}
          >
            {showForm ? "Close form" : "Add person"}
          </button>
          <button type="button" className="btn btn-danger button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {showForm && (
        <section className="dashboard-content mb-4">
          <FormReg onSuccess={handlePersonAdded} />
        </section>
      )}

      {/* API states */}
      {apiStatus === apiConstraints.error && (
        <div className="alert alert-danger">Failed to load people list.</div>
      )}

      {apiStatus === apiConstraints.inProgress && (
        <div className="loading">Loading...</div>
      )}

      {apiStatus === apiConstraints.success && (
        <main className="dashboard-content">
          <div className="row">
            {people.map((person) => (
              <div key={person._id} className="col-sm-12 col-md-6 col-lg-4 mb-4 mt-4">
                <div className="card h-100 shadow-sm">
                  {person.image && (
                    <img
                      src={person.image}
                      className="w-100 object-cover"
                      alt={person.names[0]}
                    />
                  )}
                  <div className="card-body d-flex flex-column justify-content-between pb-3 pt-3">
                    <h5 className="card-title">{person.names.join(", ")}</h5>
                    <p className="card-text">{person.description}</p>
                    {person.quote && (
                      <blockquote className="blockquote">
                        <small>{person.quote}</small>
                      </blockquote>
                    )}
                    {person.relation && (
                      <p className="text-muted">Relation: {person.relation}</p>
                    )}
                    {person.music && (
                      <a
                        href={person.music}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        🎵 Listen
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {people.length === 0 && (
              <p className="text-center">No people found.</p>
            )}
          </div>
        </main>
      )}
    </div>
  );
};

export default Dashboard;
