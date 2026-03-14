import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const { login, resendVerificationEmail, authLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setInfoMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Unable to sign in");
    }
  };

  const handleResendVerification = async () => {
    setError("");
    setInfoMessage("");
    setIsResending(true);
    const result = await resendVerificationEmail(formData.email);
    setIsResending(false);

    if (result.success) {
      setInfoMessage("Verification email sent. Please confirm your email and try again.");
    } else {
      setError(result.error || "Unable to resend verification email.");
    }
  };

  const isEmailNotConfirmed = error.toLowerCase().includes("email not confirmed");

  return (
    <main className="section auth-page">
      <div className="container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your ALIZA account</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}
            {infoMessage && <div className="auth-info">{infoMessage}</div>}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={authLoading}>
              {authLoading ? "Signing In..." : "Sign In"}
            </button>
            {isEmailNotConfirmed && (
              <button
                type="button"
                className="btn btn-secondary btn-full resend-btn"
                onClick={handleResendVerification}
                disabled={isResending || !formData.email}
              >
                {isResending ? "Sending..." : "Resend Verification Email"}
              </button>
            )}
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/register">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
