import React, { useState } from "react";

/**
 * User Login Form
 * - POST /auth/login (form-urlencoded)
 * - Receives: {username, password}
 * - On success: calls onSuccess(token, username)
 */
// PUBLIC_INTERFACE
function Login({ API_BASE, onSuccess, onRegisterLink }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleInput = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    const body = new URLSearchParams({ username: form.username, password: form.password });
    try {
      const resp = await fetch(API_BASE + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      if (!resp.ok) throw new Error("Invalid credentials");
      const d = await resp.json();
      onSuccess(d.access_token, form.username);
    } catch (err) {
      setError("Login failed: " + err.message);
    }
  }

  return (
    <div className="auth-form-container">
      <h2>Login</h2>
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
        <button type="submit" className="btn btn-large">Login</button>
      </form>
      {error && <div className="error-message">{error}</div>}
      <div style={{marginTop: 12}}>
        <span>Don&apos;t have an account? </span>
        <button type="button" onClick={onRegisterLink} className="btn-link">Register</button>
      </div>
    </div>
  );
}

export default Login;
