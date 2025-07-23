import React, { useState } from "react";

/**
 * User Registration Form
 * - POST /auth/register (JSON)
 * - Receives: {username, password}
 * - On success: calls onSuccess(token, username)
 */
// PUBLIC_INTERFACE
function Register({ API_BASE, onSuccess, onLoginLink }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleInput = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const resp = await fetch(API_BASE + "/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!resp.ok) {
        const d = await resp.json();
        throw new Error(d.detail?.[0]?.msg || "Registration failed");
      }
      // auto-login after register
      // Also immediately authenticate
      const loginResp = await fetch(API_BASE + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(form),
      });
      const ldata = await loginResp.json();
      onSuccess(ldata.access_token, form.username);
    } catch (err) {
      setError("Registration failed: " + err.message);
    }
  }

  return (
    <div className="auth-form-container">
      <h2>Register</h2>
      <form onSubmit={submit} className="auth-form">
        <input
          type="text"
          name="username"
          value={form.username}
          placeholder="Username"
          minLength={3}
          maxLength={32}
          required
          onChange={handleInput}
        />
        <input
          type="password"
          name="password"
          value={form.password}
          placeholder="Password"
          minLength={6}
          maxLength={64}
          required
          onChange={handleInput}
        />
        <button type="submit" className="btn btn-large">Register</button>
      </form>
      {error && <div className="error-message">{error}</div>}
      <div style={{marginTop: 12}}>
        <span>Already have an account? </span>
        <button type="button" onClick={onLoginLink} className="btn-link">Login</button>
      </div>
    </div>
  );
}

export default Register;
