"use client";
import React, { useState, useEffect } from "react";
import LayoutWrapper from "@/components/Layout";
import { format } from "date-fns";
import { createClient } from "@/utils/supabase/client";
interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      setUsers(data);
      console.log(data);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== userId));
      } else {
        setError("Failed to delete user");
      }
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  if (loading)
    return (
      <LayoutWrapper>
        <div>Loading...</div>
      </LayoutWrapper>
    );
  if (error)
    return (
      <LayoutWrapper>
        <div className="text-red-500">{error}</div>
      </LayoutWrapper>
    );

  return (
    <LayoutWrapper>
      <div className="p-6">
        <h1 className="mb-6 text-2xl font-bold">User Management</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-lg bg-white shadow-md">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="whitespace-nowrap px-6 py-4">{user.email}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {format(new Date(user.created_at), "yyyy-MM-dd")}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default UserManagement;
