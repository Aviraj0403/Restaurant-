import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAll, toggleBlock } from '../../services/userService';
import classes from './usersPage.module.css';
import Title from '../../components/Title/Title';
import Search from '../../components/Search/Search';

// Debounce function to limit the rate of search requests
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { searchTerm } = useParams();
  const auth = useAuth();

  // Use useCallback to memoize the loadUsers function
  const loadUsers = useCallback(
    debounce(async (search) => {
      try {
        setLoading(true);
        setError('');
        const fetchedUsers = await getAll(search);
        setUsers(fetchedUsers);
      } catch (err) {
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    }, 300), // Adjust debounce delay as needed
    []
  );

  useEffect(() => {
    loadUsers(searchTerm);
  }, [searchTerm, loadUsers]);

  const handleToggleBlock = async (userId) => {
    try {
      const isBlocked = await toggleBlock(userId);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isBlocked } : user
        )
      );
    } catch (err) {
      setError('Failed to update user status. Please try again later.');
    }
  };

  return (
    <div className={classes.container}>
      <Title title="Manage Users" margin="1rem 0" />
      <Search
        searchRoute="/admin/users/"
        defaultRoute="/admin/users"
        placeholder="Search Users"
        margin="1rem 0"
      />
      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className={classes.error}>{error}</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <>
          <div className={classes.list_item}>
            <h3>Name</h3>
            <h3>Email</h3>
            <h3>Address</h3>
            <h3>Admin</h3>
            <h3>Actions</h3>
          </div>
          {users.map((user) => (
            <div key={user.id} className={classes.list_item}>
              <span>{user.name}</span>
              <span>{user.email}</span>
              <span>{user.address}</span>
              <span>{user.isAdmin ? '✅' : '❌'}</span>
              <span className={classes.actions}>
                <Link to={`/admin/editUser/${user.id}`}>Edit</Link>
                {auth.user.id !== user.id && (
                  <button
                    className={classes.toggleButton}
                    onClick={() => handleToggleBlock(user.id)}
                  >
                    {user.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                )}
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
