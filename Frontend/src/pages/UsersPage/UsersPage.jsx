import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAll, toggleBlock } from '../../services/userService';
import classes from './usersPage.module.css';
import Title from '../../components/Title/Title';
import Search from '../../components/Search/Search';
import { toast } from 'react-toastify'; // Import toast for notifications

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const { searchTerm } = useParams();
  const auth = useAuth();

  useEffect(() => {
    loadUsers();
  }, [searchTerm]);

  const loadUsers = async () => {
    setIsLoading(true); // Start loading
    setError(null); // Clear previous errors
    try {
      const fetchedUsers = await getAll(searchTerm);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
      setError('Failed to load users. Please try again later.');
      toast.error('Failed to load users. Please try again later.');
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleToggleBlock = async (userId) => {
    try {
      const isBlocked = await toggleBlock(userId);

      setUsers((oldUsers) =>
        oldUsers.map((user) =>
          user.id === userId ? { ...user, isBlocked } : user
        )
      );

      toast.success('User status updated successfully.');
    } catch (error) {
      console.error('Failed to update user status:', error);
      toast.error('Failed to update user status. Please try again later.');
    }
  };

  return (
    <div className={classes.container}>
      <Title title="Manage Users" />
      <Search
        searchRoute="/admin/users/"
        defaultRoute="/admin/users"
        placeholder="Search Users"
        margin="1rem 0"
      />
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className={classes.list}>
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
                <Link to={'/admin/editUser/' + user.id}>Edit</Link>
                {auth.user.id !== user.id && (
                  <Link onClick={() => handleToggleBlock(user.id)}>
                    {user.isBlocked ? 'Unblock' : 'Block'}
                  </Link>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
