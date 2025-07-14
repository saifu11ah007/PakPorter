import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [updatingUser, setUpdatingUser] = useState(null);
  const navigate = useNavigate();

  // Fetch all users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term and verification status
  useEffect(() => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by verification status
    if (verificationFilter !== 'all') {
      filtered = filtered.filter(user => {
        if (verificationFilter === 'verified') {
          return user.isVerified === true;
        } else if (verificationFilter === 'unverified') {
          return user.isVerified === false;
        }
        return true;
      });
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, verificationFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/auth/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data);
      setError('');
    } catch (err) {
      setError('Error fetching users: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationToggle = async (userId, currentStatus) => {
    try {
      setUpdatingUser(userId);
      
      const response = await fetch(`http://localhost:5000/auth/verify-user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isVerified: !currentStatus
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update verification status');
      }

      const updatedUser = await response.json();
      
      // Update the user in the state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? { ...user, isVerified: !currentStatus } : user
        )
      );
      
    } catch (err) {
      setError('Error updating verification status: ' + err.message);
    } finally {
      setUpdatingUser(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin/login');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setVerificationFilter(e.target.value);
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🛡️ PakPorter Admin Dashboard</h1>
          <button onClick={handleLogout} className="logout-btn">
            🔓 Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="🔍 Search by name or email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          
          <div className="filter-container">
            <select
              value={verificationFilter}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="all">All Users</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <div className="users-stats">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{users.length}</p>
          </div>
          <div className="stat-card">
            <h3>Verified</h3>
            <p>{users.filter(user => user.isVerified).length}</p>
          </div>
          <div className="stat-card">
            <h3>Unverified</h3>
            <p>{users.filter(user => !user.isVerified).length}</p>
          </div>
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>CNIC</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Status</th>
                <th>CNIC Images</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.cnicNumber}</td>
                  <td>{user.phone}</td>
                  <td>{user.city}, {user.country}</td>
                  <td>
                    <span className={`status ${user.isVerified ? 'verified' : 'unverified'}`}>
                      {user.isVerified ? '✅ Verified' : '❌ Unverified'}
                    </span>
                  </td>
                  <td>
                    <div className="cnic-images">
                      {user.cnicFrontImage && (
                        <img
                          src={`http://localhost:5000/${user.cnicFrontImage}`}
                          alt="CNIC Front"
                          className="cnic-image"
                          title="CNIC Front"
                        />
                      )}
                      {user.cnicBackImage && (
                        <img
                          src={`http://localhost:5000/${user.cnicBackImage}`}
                          alt="CNIC Back"
                          className="cnic-image"
                          title="CNIC Back"
                        />
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => handleVerificationToggle(user._id, user.isVerified)}
                      className={`action-btn ${user.isVerified ? 'unverify' : 'verify'}`}
                      disabled={updatingUser === user._id}
                    >
                      {updatingUser === user._id ? (
                        'Updating...'
                      ) : user.isVerified ? (
                        'Unverify'
                      ) : (
                        'Verify'
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && !loading && (
            <div className="no-users">
              <p>No users found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;