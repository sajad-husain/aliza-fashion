import { Link } from "react-router-dom";
import { FiUser, FiMail, FiHeart, FiShoppingBag, FiLogOut, FiSettings } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <main className="section auth-page">
        <div className="container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Account</h1>
              <p>Please sign in to view your profile.</p>
            </div>
            <Link to="/login" className="btn btn-primary btn-full">
              Sign In
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container">
        <div className="profile-card">
          <h1>My Account</h1>
          <div className="profile-row">
            <FiUser />
            <span>{user.name}</span>
          </div>
          <div className="profile-row">
            <FiMail />
            <span>{user.email}</span>
          </div>
          <div className="profile-actions">
            <Link to="/wishlist" className="btn btn-primary">
              <FiHeart size={16} /> Wishlist
            </Link>
            <Link to="/checkout" className="btn btn-secondary">
              <FiShoppingBag size={16} /> Checkout
            </Link>
            {isAdmin && (
              <Link to="/admin" className="btn btn-secondary">
                <FiSettings size={16} /> Admin
              </Link>
            )}
            <button className="btn btn-primary" onClick={logout}>
              <FiLogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
