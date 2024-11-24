import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useMediaQuery } from "@mui/material";

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [rolePermissions, setRolePermissions] = useState([]);
  const API_KEY =
    "$2a$10$zrfrbsLMkD.A0EC9Ai.3KOhLPqcS1GcTbavVzljNlKWAGsTUS51fe";

  const isMobile = useMediaQuery("(max-width:600px)");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const renderNavOptions = () =>
    user &&
    navOptions[user?.role]?.map((option) => (
      <Button
        key={option.label}
        color="inherit"
        onClick={() => handleNavClick(option)}
        sx={{ my: 1, mx: 2 }}
      >
        {option.label}
      </Button>
    ));

  useEffect(() => {
    const fetchRolePermissions = async () => {
      if (user?.role) {
        try {
          const response = await axios.get(
            "https://api.jsonbin.io/v3/b/6742c525ad19ca34f8cf5937",
            {
              headers: {
                "X-Master-Key": API_KEY,
              },
            }
          );

          const roleData = response.data.record.roles?.find(
            (role) => role.name === user.role
          );

          setRolePermissions(roleData?.permissions || []);
        } catch (error) {
          console.error("Error fetching role permissions:", error);
        }
      }
    };

    fetchRolePermissions();
  }, [user]);

  const navOptions = {
    admin: [
      { label: "Home", path: "/user/home" },
      { label: "User Management", path: "/admin/user-management" },
      { label: "Role Management", path: "/admin/role-management" },
      { label: "Add Spots", path: "/admin/add-spots", permission: "Write" },
    ],
    user: [
      { label: "Home", path: "/user/home" },
      { label: "Explore", path: "/user/explore", permission: "Read" },
      { label: "Add Spots", path: "/user/add-spots", permission: "Write" },
    ],
  };

  const handleNavClick = (option) => {
    if (option.permission && !rolePermissions.includes(option.permission)) {
      toast.error(`You are not authorized to access ${option.label}.`);
      return;
    }
    if (option.label === "Home" && !user?.isActive) {
      toast.error("You are not authorized to access this page.");
      return;
    }
    navigate(option.path);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppBar
      position="static"
      className="bg-slate-900"
      style={{ background: "#1e293b", border: "1px solid white" }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          RBAC App
        </Typography>
        {user ? (
          isMobile ? (
            <>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                <Box
                  sx={{
                    width: 250,
                    p: 2,
                    backgroundColor: "#1e293b",
                    height: "100%",
                    color: "white",
                  }}
                  role="presentation"
                  onClick={toggleDrawer(false)}
                  onKeyDown={toggleDrawer(false)}
                >
                  <List>
                    {renderNavOptions()}
                    <ListItem button onClick={handleLogout}>
                      <ListItemText primary="Logout" />
                    </ListItem>
                  </List>
                </Box>
              </Drawer>
            </>
          ) : (
            <>
              {renderNavOptions()}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )
        ) : (
          <div>
            <Button color="inherit" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button color="inherit" onClick={() => navigate("/register")}>
              Register
            </Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
