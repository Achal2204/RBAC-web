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

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get("http://localhost:5000/users");
    setUsers(response.data);
  };

  const fetchRoles = async () => {
    const response = await axios.get("http://localhost:5000/roles"); // API to fetch roles
    setRoles(response.data);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(`http://localhost:5000/users/${userId}`, {
        role: newRole,
      });
      toast.success("Role updated successfully!");
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Error updating role", error);
      toast.error("Failed to update role!");
    }
  };

  const toggleActiveStatus = async (id, isActive) => {
    await axios.patch(`http://localhost:5000/users/${id}`, {
      isActive: !isActive,
    });
    fetchUsers();
  };

  const assignRole = async (id, role) => {
    await axios.patch(`http://localhost:5000/users/${id}`, { role });
    toast.success("Role Changed Successfully");
    fetchUsers();
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:5000/users/${selectedUser.id}`,
        selectedUser
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? selectedUser : user
        )
      );
      setOpen(false);
    } catch (error) {
      console.error("Error updating user details", error);
    }
  };

  return (
    <div className="m-auto">
      <div className="m-5 flex justify-center">
        {" "}
        <h3 className="text-3xl font-bold text-white">User Management</h3>
      </div>
      <div className="flex px-28">
        <Table>
          <TableHead>
            <TableRow className="bg-blue-400 ">
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
                  <Button variant="contained" onClick={() => handleEdit(user)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
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
              {/* <TextField
                label="Role"
                fullWidth
                value={selectedUser.role}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, role: e.target.value })
                }
                sx={{ mb: 2 }}
              /> */}
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
