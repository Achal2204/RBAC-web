import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Switch,
  TextField,
  Box,
  Modal,
  Select,
  MenuItem,
} from "@mui/material";
import toast from "react-hot-toast";
import Spinner from "../Spinner";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [otherData, setOtherData] = useState([]);
  const API_KEY =
    "$2a$10$zrfrbsLMkD.A0EC9Ai.3KOhLPqcS1GcTbavVzljNlKWAGsTUS51fe";

  useEffect(() => {
    fetchUsersAndRoles();
    // fetchRoles();
  }, []);
  const fetchUsersAndRoles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.jsonbin.io/v3/b/6742c525ad19ca34f8cf5937",
        {
          headers: {
            "X-Master-Key": API_KEY,
          },
        }
      );
      const existingData = response.data.record;
      setUsers(existingData.users || []);
      setRoles(existingData.roles || []);
      setOtherData(existingData); // Preserve the entire object for updates
    } catch (error) {
      console.error("Error fetching users or roles:", error);
    }
    setLoading(false);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      );

      const updatedData = { ...otherData, users: updatedUsers };

      await axios.put(
        "https://api.jsonbin.io/v3/b/6742c525ad19ca34f8cf5937",
        updatedData,
        {
          headers: {
            "X-Master-Key": API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Role updated successfully!");
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role!");
    }
  };

  const toggleActiveStatus = async (id, isActive) => {
    try {
      const updatedUsers = users.map((user) =>
        user.id === id ? { ...user, isActive: !isActive } : user
      );

      const updatedData = { ...otherData, users: updatedUsers };

      await axios.put(
        "https://api.jsonbin.io/v3/b/6742c525ad19ca34f8cf5937",
        updatedData,
        {
          headers: {
            "X-Master-Key": API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("User status updated successfully!");
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error toggling active status:", error);
      toast.error("Failed to update user status!");
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id ? selectedUser : user
      );

      const updatedData = { ...otherData, users: updatedUsers };

      await axios.put(
        "https://api.jsonbin.io/v3/b/6742c525ad19ca34f8cf5937",
        updatedData,
        {
          headers: {
            "X-Master-Key": API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      setUsers(updatedUsers);
      setOpen(false);
      toast.success("User details updated successfully!");
    } catch (error) {
      console.error("Error updating user details:", error);
      toast.error("Failed to update user details!");
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="m-auto">
      <div className="m-5 flex justify-center">
        <h3 className="text-3xl font-bold text-white text-center">
          User Management
        </h3>
      </div>

      {/* Table Section */}
      <div className="flex flex-col px-4 md:px-10 lg:px-28 overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow className="bg-blue-400">
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    fullWidth
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.name}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={user.isActive}
                    onChange={() => toggleActiveStatus(user.id, user.isActive)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleEdit(user)}
                    size="small"
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal Section */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <div className="flex justify-center p-4">
            <h2 className="text-2xl font-bold">Edit User Details</h2>
          </div>
          {selectedUser && (
            <form>
              <TextField
                label="First Name"
                fullWidth
                value={selectedUser.firstName}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    firstName: e.target.value,
                  })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                label="Last Name"
                fullWidth
                value={selectedUser.lastName}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, lastName: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                label="Email"
                fullWidth
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{ mt: 2 }}
                fullWidth
              >
                Save
              </Button>
            </form>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default UserManagement;
