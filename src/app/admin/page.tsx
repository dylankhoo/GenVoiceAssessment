"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import {
  getAllUsers,
  updateUserAdminAction,
  deletUserAction,
} from "@/actions/users";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<{
    id: string | null;
    email: string;
    password: string;
  }>({ id: null, email: "", password: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const users = await getAllUsers();
      setUsers(users);
    } catch (error) {
      toast.error(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    let errorMessage;
    errorMessage = (await deletUserAction(id))?.errorMessage;
    if (!errorMessage) {
      setUsers(users.filter((user) => user.id !== id));
      toast.success("User deleted successfully");
    } else {
      toast.error(`Error: ${errorMessage}`);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser.id) return;

    let errorMessage;
    errorMessage = (
      await updateUserAdminAction(
        editingUser.id,
        editingUser.email,
        editingUser.password
      )
    )?.errorMessage;

    if (!errorMessage) {
      fetchUsers();
      toast.success("User updated successfully");
      setEditingUser({ id: null, email: "", password: "" });
    } else {
      toast.error(`Error: ${errorMessage}`);
    }
  };

  if (loading) return <div className="p-4">Loading users...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Last Sign In</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b text-center align-middle">
                {editingUser.id === user.id ? (
                  <Input
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        email: e.target.value,
                      })
                    }
                    placeholder="New Username"
                  />
                ) : (
                  user.username
                )}
              </td>
              <td className="py-2 px-4 border-b text-center align-middle">
                {new Date(
                  user.last_sign_in_at || user.created_at
                ).toLocaleString()}
              </td>
              <td className="py-2 px-4 border-b space-x-2 text-center align-middle">
                {editingUser.id === user.id ? (
                  <div className="flex gap-2 text-center justify-center align-middle">
                    <Input
                      type="password"
                      value={editingUser.password}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          password: e.target.value,
                        })
                      }
                      placeholder="New password (minimum 6 characters)"
                      className="w-70"
                    />
                    <Button size="sm" onClick={handleUpdateUser}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setEditingUser({
                          id: null,
                          email: "",
                          password: "",
                        })
                      }
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setEditingUser({
                          id: user.id,
                          email: user.email,
                          password: "",
                        })
                      }
                    >
                      Edit
                    </Button>
                    <Button size="sm" onClick={() => handleDelete(user.id)}>
                      Delete
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
