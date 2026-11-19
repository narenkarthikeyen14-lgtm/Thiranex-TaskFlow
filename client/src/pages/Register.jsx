
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Mail, LockKeyhole, ArrowRight } from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">T</div>

        <h1>Create your account</h1>
        <p className="auth-subtitle">
          Start organizing your work with TaskFlow.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>

          <div className="auth-input-wrapper">
            <User size={18} />
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <label>Email Address</label>

          <div className="auth-input-wrapper">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label>Password</label>

          <div className="auth-input-wrapper">
            <LockKeyhole size={18} />
            <input
              type="password"
              placeholder="Create a password (minimum 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
