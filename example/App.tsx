import React, { useState, useEffect } from 'react';
import { User, UserStats } from './types';

interface AppProps {
  title?: string;
}

const App: React.FC<AppProps> = ({ title = 'User Dashboard' }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate API call
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Mock data
        const mockUsers: User[] = [
          { id: 1, name: 'Alice Johnson', email: 'alice@example.com', active: true },
          { id: 2, name: 'Bob Smith', email: 'bob@example.com', active: false },
          { id: 3, name: 'Charlie Davis', email: 'charlie@example.com', active: true },
        ];

        setUsers(mockUsers);
        setStats({
          total: mockUsers.length,
          active: mockUsers.filter(u => u.active).length,
          inactive: mockUsers.filter(u => !u.active).length,
        });
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <h1>{title}</h1>

      {stats && (
        <div className="stats">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{stats.total}</p>
          </div>
          <div className="stat-card">
            <h3>Active</h3>
            <p>{stats.active}</p>
          </div>
          <div className="stat-card">
            <h3>Inactive</h3>
            <p>{stats.inactive}</p>
          </div>
        </div>
      )}

      <div className="user-list">
        <h2>User List</h2>
        {users.map(user => (
          <div key={user.id} className="user-card">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <span className={`status ${user.active ? 'active' : 'inactive'}`}>
              {user.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
