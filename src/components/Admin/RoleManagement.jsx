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
import Spinner from "../Spinner";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", permissions: [] });
  const [loading, setLoading] = useState(false);
  const [otherData, setOtherData] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const API_KEY =
    "$2a$10$zrfrbsLMkD.A0EC9Ai.3KOhLPqcS1GcTbavVzljNlKWAGsTUS51fe";

  useEffect(() => {
    const fetchRoles = async () => {
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
        setRoles(existingData.roles || []);
        setOtherData(existingData); // Preserve the entire object for later use
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
      setLoading(false);
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
      const updatedData = { ...otherData, roles: updatedRoles };
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
    } catch (error) {
      console.error("Error updating permissions:", error);
    }
  };

  const handleDeleteRole = async (roleId) => {
    const updatedRoles = roles.filter((role) => role.id !== roleId);

    setRoles(updatedRoles);

    try {
      const updatedData = { ...otherData, roles: updatedRoles };
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
      toast.success("Role Deleted");
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const handleAddRole = async () => {
    const updatedRoles = [...roles, newRole];

    setRoles(updatedRoles);

    try {
      const updatedData = { ...otherData, roles: updatedRoles };
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
      setNewRole({ name: "", permissions: [] });
      handleClose();
      toast.success(`New Role Added: ${newRole.name}`);
    } catch (error) {
      console.error("Error adding role:", error);
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="m-auto">
      {/* Header Section */}
      <div className="m-5 flex justify-center">
        <h3 className="text-3xl font-bold text-white text-center">
          Role Management
        </h3>
      </div>

      {/* Add Role Button Section */}
      <div className="flex justify-end px-4 md:px-10 lg:px-28 mb-4">
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Role
        </Button>
      </div>

      {/* Table Section */}
      <div className="px-4 md:px-10 lg:px-28 overflow-x-auto">
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
                    variant="contained"
                    style={{ background: "indianred" }}
                    onClick={() => handleDeleteRole(role.id)}
                    size="small"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal Section */}
      <Modal open={open} onClose={handleClose}>
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
          <div className="mt-4">
            <Typography>Permissions:</Typography>
            <div className="flex flex-wrap gap-4 mt-2">
              <label className="flex items-center gap-2">
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
              </label>
              <label className="flex items-center gap-2">
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
              </label>
              <label className="flex items-center gap-2">
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
              </label>
            </div>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddRole}
            sx={{ mt: 3 }}
            fullWidth
          >
            Add Role
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default RoleManagement;
