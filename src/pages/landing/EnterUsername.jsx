import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Snackbar,
  Backdrop,
  Avatar,
  Chip,
  IconButton,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import TwitterIcon from "@mui/icons-material/Twitter";
import CloseIcon from "@mui/icons-material/Close";
import LaunchIcon from "@mui/icons-material/Launch";
import axios from "axios";
import { projects } from "./seed";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const EnterUsername = ({ onNext }) => {
  const [username, setUsername] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim()) {
      setError("Please enter your Twitter username");
      setSnackbarOpen(true);
      return;
    }
    if (!selectedProject) {
      setError("Please select a project you're bullish on");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${BASE_URL}/api/f4f/enter`, {
        username: username.replace("@", ""),
        project: selectedProject.toLowerCase(),
      });

      onNext({
        username: response.data.username,
        project: response.data.project,
        userId: response.data.userId,
      });
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Something went wrong");
      } else {
        setError("Network error. Please try again.");
      }
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleFollowClick = () => {
    window.open("https://x.com/V3rseDev", "_blank", "noopener,noreferrer");
  };

  const primaryTeal = "#2EEBCB";

  return (
    <>
      {/* Full Screen Container */}
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          backgroundImage: `url('/WALL.jpeg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          padding: 0,
          margin: 0,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.4)",
            zIndex: 1,
          },
        }}
      >
        {/* Animated Background Elements */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `
              radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
            `,
            zIndex: 1,
          }}
        />

        {/* Floating particles animation */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              width: `${20 + i * 10}px`,
              height: `${20 + i * 10}px`,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              zIndex: 1,
            }}
            animate={{
              x: [0, 100, -100, 0],
              y: [0, -100, 100, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "linear",
            }}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
          />
        ))}

        {/* Designer Credit - Top Right */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: { xs: "10px", sm: "20px" },
              right: { xs: "10px", sm: "20px" },
              zIndex: 15,
            }}
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Chip
              avatar={
                <Avatar
                  src="/BigD.jpg"
                  alt="Big_D Designer"
                  sx={{
                    width: { xs: 24, sm: 28 },
                    height: { xs: 24, sm: 28 },
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                  }}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255, 255, 255, 0.9)",
                      fontSize: { xs: "10px", sm: "11px" },
                      fontWeight: 500,
                    }}
                  >
                    designed by Big_D
                  </Typography>
                  <LaunchIcon sx={{ fontSize: 12, color: "rgba(255, 255, 255, 0.7)" }} />
                </Box>
              }
              onClick={handleFollowClick}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.18)",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                },
              }}
            />
          </motion.div>
        </motion.div>

        {/* Main Content Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          style={{ 
            zIndex: 10, 
            width: "100%", 
            maxWidth: { xs: "95%", sm: "500px", md: "600px" }, 
            padding: { xs: "10px", sm: "20px" }
          }}
        >
          {/* Glassmorphism Card */}
          <Box
            sx={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(25px)",
              borderRadius: "28px",
              border: "1px solid rgba(46, 235, 203, 0.3)",
              boxShadow: "0 30px 60px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(46, 235, 203, 0.1)",
              padding: { xs: "20px", sm: "30px", md: "40px" },
              width: "100%",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: "28px",
                background: "linear-gradient(135deg, rgba(46, 235, 203, 0.1) 0%, rgba(14, 165, 165, 0.05) 100%)",
                zIndex: -1,
              },
            }}
          >
            {/* Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <TwitterIcon
                    sx={{
                      fontSize: { xs: 50, sm: 60 },
                      color: "#FFFFFF",
                      mb: 2,
                      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                    }}
                  />
                </motion.div>
                
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          mb: 2,
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1, sm: 2 }
        }}>
          <img 
            src="/BILL.jpg" 
            alt="Billions Connect Logo" 
            style={{ 
              height: "50px", 
              width: "auto", 
              borderRadius: "12px",
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
            }} 
          />
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              color: "#FFFFFF",
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem", lg: "3rem" },
              fontWeight: 700,
              textShadow: "0 4px 8px rgba(0,0,0,0.5)",
              background: "linear-gradient(45deg, #2EEBCB, #FFFFFF)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textAlign: "center",
            }}
          >
            Billions Connect
          </Typography>
        </Box>
                
                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(255, 255, 255, 0.95)",
                    fontSize: { xs: "1rem", sm: "1.2rem" },
                    fontWeight: 500,
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                    textAlign: "center",
                  }}
                >
                  Connect with like-minded crypto enthusiasts and grow your network
                </Typography>
              </Box>
            </motion.div>

            {/* Form Fields */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Twitter Username"
                  placeholder="Enter your username (without @)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  variant="outlined"
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: { xs: "12px", sm: "16px" },
                      "& fieldset": { 
                        borderColor: "rgba(255, 255, 255, 0.3)",
                        borderWidth: "2px",
                      },
                      "&:hover fieldset": { 
                        borderColor: "rgba(255, 255, 255, 0.5)" 
                      },
                      "&.Mui-focused fieldset": { 
                        borderColor: "#FFFFFF",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root": { 
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      "&.Mui-focused": { color: "#FFFFFF" }
                    },
                    "& .MuiInputBase-input": { 
                      color: "#FFFFFF",
                      fontSize: { xs: "1rem", sm: "1.1rem" },
                      padding: { xs: "12px 14px", sm: "16px 14px" },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <Typography sx={{ 
                        mr: 1, 
                        color: "rgba(255, 255, 255, 0.7)", 
                        fontSize: { xs: "1rem", sm: "1.1rem" }
                      }}>
                        @
                      </Typography>
                    ),
                  }}
                />

                <FormControl
                  fullWidth
                  sx={{
                    mb: 4,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: { xs: "12px", sm: "16px" },
                      "& fieldset": { 
                        borderColor: "rgba(255, 255, 255, 0.3)",
                        borderWidth: "2px",
                      },
                      "&:hover fieldset": { 
                        borderColor: "rgba(255, 255, 255, 0.5)" 
                      },
                      "&.Mui-focused fieldset": { 
                        borderColor: "#FFFFFF",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root": { 
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      "&.Mui-focused": { color: "#FFFFFF" }
                    },
                    "& .MuiSelect-icon": { color: "rgba(255, 255, 255, 0.7)" },
                  }}
                >
                  <InputLabel>Project you're bullish on</InputLabel>
                  <Select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    label="Project you're bullish on"
                    sx={{ 
                      color: "#FFFFFF",
                      fontSize: { xs: "1rem", sm: "1.1rem" },
                      padding: { xs: "12px 14px", sm: "16px 14px" },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: primaryTeal,
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "12px",
                          mt: 1,
                          "& .MuiMenuItem-root": {
                            color: "#FFFFFF",
                            fontSize: "1rem",
                            padding: "12px 16px",
                            "&:hover": {
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                            },
                            "&.Mui-selected": {
                              backgroundColor: "rgba(255, 255, 255, 0.2)",
                              "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.3)",
                              },
                            },
                          },
                        },
                      },
                    }}
                  >
                    {projects.map((project, index) => (
                      <MenuItem key={index} value={project}>
                        {project}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{
                      py: { xs: 1.5, sm: 2 },
                      px: { xs: 2, sm: 3 },
                      fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                      fontWeight: 600,
                      borderRadius: { xs: "16px", sm: "20px" },
                      background: "linear-gradient(45deg, #2EEBCB, #15C6AB)",
                      color: "#FFFFFF",
                      boxShadow: "0 12px 30px rgba(46, 235, 203, 0.3)",
                      border: "none",
                      textTransform: "none",
                      minHeight: { xs: "48px", sm: "56px" },
                      "&:hover": {
                        background: "linear-gradient(45deg, #15C6AB, #0EA5A5)",
                        boxShadow: "0 16px 40px rgba(46, 235, 203, 0.4)",
                        transform: "translateY(-2px)",
                      },
                      "&:disabled": {
                        background: "rgba(46, 235, 203, 0.3)",
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={{ xs: 24, sm: 28 }} sx={{ color: "#FFFFFF" }} />
                    ) : (
                      "🚀 Start Connecting"
                    )}
                  </Button>
                </motion.div>
              </Box>
            </motion.div>

            {/* Warning Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Typography
                variant="body2"
                textAlign="center"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: { xs: "0.85rem", sm: "0.9rem" },
                  fontStyle: "italic",
                  mt: 2,
                }}
              >
                ⚠️ Use responsibly to avoid Twitter suspension
              </Typography>
            </motion.div>

            {/* Bottom Credit - Subtle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              style={{
                position: "absolute",
                bottom: "15px",
                right: "20px",
              }}
            >
              <Button
                size="small"
                onClick={handleFollowClick}
                sx={{
                  minWidth: "auto",
                  padding: "4px 8px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: "10px",
                  fontWeight: 400,
                  textTransform: "none",
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    color: "rgba(255, 255, 255, 0.8)",
                    transform: "translateY(-1px)",
                  },
                }}
                endIcon={<TwitterIcon sx={{ fontSize: "10px !important" }} />}
              >
                @V3rseDev
              </Button>
            </motion.div>
          </Box>
        </motion.div>
      </Box>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{
          color: "#FFFFFF",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(10px)",
        }}
        open={loading}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress color="inherit" size={60} />
          <Typography variant="h6" sx={{ mt: 2, color: "#FFFFFF", fontWeight: 500 }}>
            Connecting you with crypto enthusiasts...
          </Typography>
        </Box>
      </Backdrop>

      {/* Bottom-Right Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{
          "& .MuiSnackbarContent-root": {
            minWidth: "300px",
            borderRadius: "12px",
          }
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: "12px",
            fontSize: "1rem",
            "& .MuiAlert-icon": {
              fontSize: "1.5rem"
            }
          }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={handleCloseSnackbar}
              sx={{ minWidth: "auto", p: 0.5 }}
            >
              <CloseIcon fontSize="small" />
            </Button>
          }
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EnterUsername;