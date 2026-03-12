/**
 * INTERMEDIATE: UserProfile
 * Demonstrates: reading from AuthContext, inline update via dispatch wrapper
 */
import { useState } from "react";
import { useAuth } from "../../hooks";

export function UserProfile() {
  const { user, logout, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");

  if (!user) return null;

  const handleSave = () => {
    updateProfile({ name });
    setEditing(false);
  };

  return (
    <div className="profile-card">
      <img src={user.avatar} alt={user.name} className="profile-avatar" />

      <div className="profile-info">
        {editing ? (
          <div className="profile-edit">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="profile-name-input"
              autoFocus
            />
            <div className="profile-actions">
              <button onClick={handleSave} className="btn btn-sm btn-primary">Save</button>
              <button onClick={() => setEditing(false)} className="btn btn-sm btn-ghost">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="profile-name">{user.name}</h3>
            <p className="profile-email">{user.email}</p>
            <span className={`role-badge role-${user.role}`}>{user.role}</span>
          </>
        )}
      </div>

      <div className="profile-footer">
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn btn-sm btn-ghost">
            ✏️ Edit
          </button>
        )}
        <button onClick={logout} className="btn btn-sm btn-danger">
          Sign Out
        </button>
      </div>
    </div>
  );
}
