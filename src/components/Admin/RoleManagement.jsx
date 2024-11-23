import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Modal,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import toast from "react-hot-toast";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", permissions: [] });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/roles");
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  const handlePermissionChange = async (roleId, permission) => {
    const updatedRoles = roles.map((role) => {
      if (role.id === roleId) {
        const hasPermission = role.permissions.includes(permission);
        return {
          ...role,
          permissions: hasPermission
            ? role.permissions.filter((perm) => perm !== permission)
            : [...role.permissions, permission],
        };
      }
      return role;
    });

    setRoles(updatedRoles);

    try {
      const updatedRole = updatedRoles.find((role) => role.id === roleId);
      await axios.put(`http://localhost:5000/roles/${roleId}`, updatedRole);
    } catch (error) {
      console.error("Error updating permissions:", error);
    }
  };

  const handleDeleteRole = async (roleId) => {
    try {
      await axios.delete(`http://localhost:5000/roles/${roleId}`);

      setRoles(roles.filter((role) => role.id !== roleId));
      toast.success("Role Deleted");
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddRole = async () => {
    try {
      const response = await axios.post("http://localhost:5000/roles", newRole);
      setRoles([...roles, response.data]);
      setNewRole({ name: "", permissions: [] });
      handleClose();
      toast.success(`New Role Added : ${newRole.name}`);
    } catch (error) {
      console.error("Error adding role:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="m-auto">
      <div className="m-5 flex justify-center">
        <h3 className="text-3xl font-bold text-white">Role Management</h3>
      </div>
      <div className="flex justify-end px-28 mb-4">
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Role
        </Button>
      </div>
      <div className="flex px-28">
        <Table>
          <TableHead>
            <TableRow className="bg-blue-400">
              <TableCell>Role</TableCell>
              <TableCell>Read</TableCell>
              <TableCell>Write</TableCell>
              <TableCell>Delete</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={role.permissions.includes("Read")}
                    onChange={() => handlePermissionChange(role.id, "Read")}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={role.permissions.includes("Write")}
                    onChange={() => handlePermissionChange(role.id, "Write")}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={role.permissions.includes("Delete")}
                    onChange={() => handlePermissionChange(role.id, "Delete")}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    style={{ background: "indianred" }}
                    variant="contained"
                    onClick={() => handleDeleteRole(role.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Modal open={open} onClose={handleClose}>
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
          <Typography variant="h6" gutterBottom>
            Add New Role
          </Typography>
          <TextField
            fullWidth
            label="Role Name"
            value={newRole.name}
            onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
            margin="normal"
          />
          <div>
            <Typography>Permissions:</Typography>
            <Checkbox
              checked={newRole.permissions.includes("Read")}
              onChange={() =>
                setNewRole((prev) => ({
                  ...prev,
                  permissions: prev.permissions.includes("Read")
                    ? prev.permissions.filter((perm) => perm !== "Read")
                    : [...prev.permissions, "Read"],
                }))
              }
            />
            Read
            <Checkbox
              checked={newRole.permissions.includes("Write")}
              onChange={() =>
                setNewRole((prev) => ({
                  ...prev,
                  permissions: prev.permissions.includes("Write")
                    ? prev.permissions.filter((perm) => perm !== "Write")
                    : [...prev.permissions, "Write"],
                }))
              }
            />
            Write
            <Checkbox
              checked={newRole.permissions.includes("Delete")}
              onChange={() =>
                setNewRole((prev) => ({
                  ...prev,
                  permissions: prev.permissions.includes("Delete")
                    ? prev.permissions.filter((perm) => perm !== "Delete")
                    : [...prev.permissions, "Delete"],
                }))
              }
            />
            Delete
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddRole}
            sx={{ mt: 2 }}
          >
            Add Role
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default RoleManagement;
