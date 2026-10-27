
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageDeliveryAgents.css";

const API_URL = "http://127.0.0.1:8000/delivery-agent/admin/list";
const DELETE_URL = "http://127.0.0.1:8000/delivery-agent/admin";

function ManageDeliveryAgents() {
  const navigate = useNavigate();

  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const loadAgents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Unable to load agents (${response.status})`);
      }

      const data = await response.json();
      const records = Array.isArray(data) ? data : data.agents;

      if (!Array.isArray(records)) {
        throw new Error("API response must contain an agents array.");
      }

      setAgents(records);
    } catch (err) {
      setError(
        "Delivery agents load nahi ho paaye. FastAPI server aur API endpoint check karo."
      );
      console.error("Delivery agents API error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  const getName = (agent) => {
    if (agent.name) return agent.name;

    return [
      agent.first_name || agent.firstname || "",
      agent.last_name || agent.lastname || "",
    ]
      .filter(Boolean)
      .join(" ") || "Unnamed Agent";
  };

  const isAgentActive = (agent) => {
    if (typeof agent.is_online === "boolean") {
      return agent.is_online;
    }

    if (typeof agent.is_active === "boolean") {
      return agent.is_active;
    }

    const status = String(agent.status || "").toLowerCase();
    return status === "active" || status === "online";
  };

  const handleRemoveAgent = async (agent) => {
    const agentId = agent.id ?? agent.agent_id;

    if (agentId == null) {
      alert("Agent ID nahi mila. Backend response check karo.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove ${getName(agent)}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setRemovingId(agentId);
    setError("");

    try {
      const response = await fetch(
        `${DELETE_URL}/${encodeURIComponent(agentId)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(
          message || `Unable to remove agent (${response.status})`
        );
      }

      // Update the UI only after the backend confirms deletion.
      setAgents((currentAgents) =>
        currentAgents.filter(
          (item) => (item.id ?? item.agent_id) !== agentId
        )
      );
    } catch (err) {
      console.error("Remove delivery agent error:", err);
      setError(
        "Agent remove nahi hua. FastAPI DELETE endpoint aur server logs check karo."
      );
    } finally {
      setRemovingId(null);
    }
  };

  const filteredAgents = agents.filter((agent) => {
    const text = [
      getName(agent),
      agent.email,
      agent.email_address,
      agent.contact_no,
      agent.phone,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return text.includes(search.toLowerCase());
  });

  const activeCount = agents.filter(isAgentActive).length;
  const inactiveCount = agents.length - activeCount;

  return (
    <div className="sa-agents-page">
      <header className="sa-agents-header">
        <div>
          <p className="sa-agents-breadcrumb">
            Admin Panel / Delivery Agents
          </p>
          <h1>Delivery Agents 🛵</h1>
          <p className="sa-agents-subtitle">
            View registered agents and their current status.
          </p>
        </div>

        <button
          className="sa-agents-refresh"
          type="button"
          onClick={loadAgents}
          disabled={loading}
        >
          ↻ {loading ? "Loading..." : "Refresh"}
        </button>
      </header>

      <section className="sa-agents-stats">
        <article className="sa-agent-stat">
          <span className="sa-agent-stat-icon">🛵</span>
          <div>
            <p>Total Agents</p>
            <h2>{agents.length}</h2>
          </div>
        </article>

        <article className="sa-agent-stat">
          <span className="sa-agent-stat-icon">🟢</span>
          <div>
            <p>Active</p>
            <h2>{activeCount}</h2>
          </div>
        </article>

        <article className="sa-agent-stat">
          <span className="sa-agent-stat-icon">⚪</span>
          <div>
            <p>Inactive</p>
            <h2>{inactiveCount}</h2>
          </div>
        </article>
      </section>

      <section className="sa-agents-table-card">
        <div className="sa-agents-table-heading">
          <div>
            <h2>Registered Delivery Agents</h2>
            <p>Agent details and availability</p>
          </div>

          <input
            type="search"
            className="sa-agents-search"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {error && (
          <div className="sa-agents-error" role="alert">
            <p>{error}</p>
            <button type="button" onClick={loadAgents}>
              Try Again
            </button>
          </div>
        )}

        {loading ? (
          <div className="sa-agents-message">
            Loading delivery agents...
          </div>
        ) : !error && filteredAgents.length === 0 ? (
          <div className="sa-agents-message">
            {agents.length === 0
              ? "No registered delivery agents found."
              : "No agents match your search."}
          </div>
        ) : !error ? (
          <div className="sa-agents-table-wrap">
            <table className="sa-agents-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>AGENT</th>
                  <th>EMAIL</th>
                  <th>CONTACT</th>
                  <th>STATUS</th>
                  <th>MANAGE</th>
                </tr>
              </thead>

              <tbody>
                {filteredAgents.map((agent, index) => {
                  const active = isAgentActive(agent);
                  const agentId = agent.id ?? agent.agent_id;

                  return (
                    <tr key={agentId ?? agent.email ?? index}>
                      <td>{index + 1}</td>

                      <td>
                        <div className="sa-agent-name-cell">
                          <span className="sa-agent-avatar">
                            {getName(agent).charAt(0).toUpperCase()}
                          </span>
                          <strong>{getName(agent)}</strong>
                        </div>
                      </td>

                      <td>
                        {agent.email || agent.email_address || "—"}
                      </td>

                      <td>
                        {agent.contact_no || agent.phone || "—"}
                      </td>

                      <td>
                        <span
                          className={`sa-agent-status ${
                            active ? "online" : "offline"
                          }`}
                        >
                          <span className="sa-agent-status-dot" />
                          {active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="sa-agent-remove-btn"
                          onClick={() => handleRemoveAgent(agent)}
                          disabled={
                            agentId == null || removingId === agentId
                          }
                        >
                          {removingId === agentId
                            ? "Removing..."
                            : "Remove"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}

        <div className="sa-agents-table-footer">
          Showing {filteredAgents.length} of {agents.length} agents
        </div>
      </section>

      <button
        className="sa-agents-back"
        type="button"
        onClick={() => navigate("/admin/dashboard")}
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}

export default ManageDeliveryAgents 