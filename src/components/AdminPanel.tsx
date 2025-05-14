import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}

export function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>('');

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users/all');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await fetch(`/api/users/admin/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to delete user');
      
      // Refresh the user list
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{user.username}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">Role: {user.role}</p>
              </div>
              <Button
                variant="destructive"
                onClick={() => deleteUser(user.id)}
              >
                Delete User
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 