import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Container,
  Snackbar,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import TwitterIcon from "@mui/icons-material/Twitter";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LaunchIcon from "@mui/icons-material/Launch";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://orangedynasty.global";

const DisplayUsers = ({ username, project, userId, users, userCount }) => {
  const [usersToFollow, setUsersToFollow] = useState(users || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [allFollowed, setAllFollowed] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [messageGenerated, setMessageGenerated] = useState(false);
  
  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (users && users.length > 0) {
      setUsersToFollow(users);
    } else if (!users) {
      fetchUsers();
    }
  }, [users]);

  useEffect(() => {
    if (usersToFollow.length > 0 && followedUsers.size === usersToFollow.length) {
      setAllFollowed(true);
    } else {
      setAllFollowed(false);
    }
  }, [followedUsers, usersToFollow]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const fetchUsers = async () => {
    if (!project || !username) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${BASE_URL}/api/f4f/users`, {
        params: {
          project: project.toLowerCase(),
          count: userCount || 5,
          currentUsername: username,
        },
      });

      if (response.data.users && response.data.users.length > 0) {
        setUsersToFollow(response.data.users);
        showSnackbar(`Found ${response.data.users.length} users bullish on ${project}!`);
      } else {
        setError(`No other users found for "${project}". You might be the only one, or try again later!`);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError(`No other users found bullish on "${project}". Share the app with friends!`);
      } else if (err.response) {
        setError(err.response.data.message || "Failed to load users");
      } else {
        setError("Connection error. Please check if the server is running.");
      }
      showSnackbar("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUser = (userToFollow) => {
    try {
      // Clean username - remove @ if present and trim whitespace
      const cleanUsername = String(userToFollow).replace(/^@/, '').trim();
      
      if (!cleanUsername) {
        showSnackbar('Invalid Twitter username', 'error');
        return;
      }

      // Open Twitter profile in new tab
      const twitterUrl = `https://x.com/${cleanUsername}`;
      window.open(twitterUrl, "_blank", "noopener,noreferrer");
      
      // Mark as followed
      setFollowedUsers((prev) => new Set([...prev, cleanUsername]));
      showSnackbar(`Opened @${cleanUsername}'s profile!`);
    } catch (error) {
      console.error("Error opening Twitter profile:", error);
      showSnackbar("Error opening Twitter profile", "error");
    }
  };

  const generateMessage = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${BASE_URL}/api/f4f/generate-message`, {
        usernames: usersToFollow.map((u) => u.username),
        project: project.toLowerCase(),
      });
      setGeneratedMessage(response.data.message);
      setMessageGenerated(true);
      setShowMessageDialog(true);
      showSnackbar("Message generated successfully!");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Failed to generate message");
      } else {
        setError("Network error. Please try again.");
      }
      showSnackbar("Failed to generate message", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(generatedMessage);
      showSnackbar("Message copied to clipboard!");
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = generatedMessage;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        showSnackbar("Message copied to clipboard!");
      } catch (copyErr) {
        showSnackbar("Failed to copy message", "error");
      }
      document.body.removeChild(textArea);
    }
  };

  const handlePostOnTwitter = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${BASE_URL}/api/f4f/post`, {
        message: generatedMessage,
      });

      if (response.data.success && response.data.twitterUrl) {
        window.open(response.data.twitterUrl, "_blank", "noopener,noreferrer");
        showSnackbar("Twitter opened with your message!");
      } else {
        setError("Failed to generate Twitter URL");
        showSnackbar("Failed to generate Twitter URL", "error");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Failed to generate Twitter URL");
      } else {
        setError("Network error. Please try again.");
      }
      showSnackbar("Failed to generate Twitter URL", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshUsers = () => {
    setFollowedUsers(new Set());
    setAllFollowed(false);
    setMessageGenerated(false);
    setGeneratedMessage("");
    setShowMessageDialog(false);
    fetchUsers();
  };

  const handleStartOver = () => {
    setFollowedUsers(new Set());
    setAllFollowed(false);
    setMessageGenerated(false);
    setGeneratedMessage("");
    setShowMessageDialog(false);
    showSnackbar("Started over! Select new users to follow.");
  };

  if (loading && usersToFollow.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          width: "100vw",
          backgroundColor: "#2EEBCB",
          p: { xs: 2, sm: 3, md: 4 },
          margin: 0,
          overflow: "hidden",
        }}
      >
        <CircularProgress size={48} sx={{ color: "#FFFFFF", mb: 2 }} />
        <Typography sx={{ color: "#FFFFFF", fontSize: { xs: "0.9rem", sm: "1rem" } }}>
          Finding users bullish on {project}...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url('/WALL.jpeg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        p: 0,
        margin: 0,
        overflow: "auto",
        position: "relative",
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
      <Container 
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
          p: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
        >
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              backdropFilter: "blur(25px)",
              border: "1px solid rgba(46, 235, 203, 0.4)",
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  sx={{
                    color: "#FFFFFF",
                    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                    fontWeight: 700,
                    textShadow: "0 4px 8px rgba(0,0,0,0.8)",
                  }}
                >
                  Follow These {usersToFollow.length} Accounts
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#FFFFFF",
                    mb: 2,
                    fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                    textShadow: "0 2px 4px rgba(0,0,0,0.6)",
                    fontWeight: 500,
                  }}
                >
                  All bullish on{" "}
                  <Chip
                    label={project}
                    size="small"
                    sx={{ 
                      backgroundColor: "#2EEBCB", 
                      color: "#000000",
                      fontWeight: 600,
                      mx: 0.5,
                    }}
                  />
                </Typography>

                <Button
                  variant="outlined"
                  onClick={handleRefreshUsers}
                  startIcon={<RefreshIcon />}
                  disabled={loading}
                  sx={{
                    color: "#FFFFFF",
                    borderColor: "#FFFFFF",
                    fontSize: { xs: "0.8rem", sm: "0.9rem" },
                    py: { xs: 0.5, sm: 1 },
                    px: { xs: 1.5, sm: 2 },
                    "&:hover": {
                      borderColor: "#2EEBCB",
                      backgroundColor: "rgba(46, 235, 203, 0.1)",
                    },
                    "&:disabled": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      color: "rgba(255, 255, 255, 0.3)",
                    },
                  }}
                >
                  Get New Users
                </Button>
              </Box>

              {error && (
                <Alert 
                  severity="info" 
                  sx={{ 
                    mb: 3, 
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    "& .MuiAlert-message": {
                      color: "#0EA5A5",
                    }
                  }}
                >
                  {error}
                </Alert>
              )}

              {usersToFollow.length === 0 && !error && !loading ? (
                <Alert 
                  severity="info" 
                  sx={{ 
                    mb: 3, 
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    "& .MuiAlert-message": {
                      color: "#0EA5A5",
                    }
                  }}
                >
                  No users found for {project}. Try refreshing or check back later!
                </Alert>
              ) : (
                <>
                  <List sx={{ mb: 3 }}>
                    <AnimatePresence>
                      {usersToFollow.map((user, index) => {
                        const isFollowed = followedUsers.has(user.username);
                        return (
                          <motion.div
                            key={user.username}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <ListItem
                              sx={{
                                mb: 2,
                                bgcolor: isFollowed
                                  ? "rgba(76, 175, 80, 0.2)"
                                  : "rgba(255, 255, 255, 0.9)",
                                borderRadius: 2,
                                border: "2px solid",
                                borderColor: isFollowed ? "#4CAF50" : "rgba(46, 235, 203, 0.5)",
                                transition: "all 0.3s ease",
                                flexDirection: { xs: "column", sm: "row" },
                                alignItems: { xs: "stretch", sm: "center" },
                                gap: { xs: 1, sm: 2 },
                                p: { xs: 2, sm: 2 },
                                "&:hover": {
                                  transform: "translateY(-2px)",
                                  boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  flex: 1,
                                  minWidth: 0,
                                }}
                              >
                                <ListItemAvatar>
                                  <Avatar 
                                    sx={{ 
                                      bgcolor: isFollowed ? "#4CAF50" : "#2EEBCB",
                                      width: { xs: 40, sm: 48 },
                                      height: { xs: 40, sm: 48 },
                                    }}
                                  >
                                    <TwitterIcon sx={{ color: "#FFFFFF" }} />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={`@${user.username}`}
                                  secondary={`Bullish on ${user.project}`}
                                  sx={{
                                    "& .MuiListItemText-primary": {
                                      color: isFollowed ? "#4CAF50" : "#000000",
                                      fontSize: { xs: "0.95rem", sm: "1.1rem" },
                                      fontWeight: 700,
                                    },
                                    "& .MuiListItemText-secondary": {
                                      color: isFollowed ? "#4CAF50" : "#666666",
                                      fontSize: { xs: "0.8rem", sm: "0.9rem" },
                                      opacity: 0.9,
                                    },
                                  }}
                                />
                              </Box>
                              <Button
                                variant={isFollowed ? "outlined" : "contained"}
                                color={isFollowed ? "success" : "primary"}
                                startIcon={<PersonAddIcon />}
                                onClick={() => handleFollowUser(user.username)}
                                disabled={isFollowed}
                                sx={{
                                  minWidth: { xs: "100%", sm: 120 },
                                  fontSize: { xs: "0.85rem", sm: "0.95rem" },
                                  fontWeight: 600,
                                  py: { xs: 1, sm: 1 },
                                  backgroundColor: isFollowed ? "transparent" : "#2EEBCB",
                                  color: isFollowed ? "#4CAF50" : "#FFFFFF",
                                  borderColor: isFollowed ? "#4CAF50" : "#2EEBCB",
                                  cursor: isFollowed ? "default" : "pointer",
                                  "&:hover": {
                                    backgroundColor: isFollowed
                                      ? "rgba(76, 175, 80, 0.1)"
                                      : "#10B3A3",
                                    borderColor: isFollowed ? "#4CAF50" : "#10B3A3",
                                  },
                                  "&:disabled": {
                                    opacity: 0.8,
                                    cursor: "default",
                                  },
                                }}
                              >
                                {isFollowed ? "Followed ✓" : "Follow"}
                              </Button>
                            </ListItem>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </List>

                  <AnimatePresence>
                    {allFollowed && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Box
                          sx={{
                            textAlign: "center",
                            mt: 4,
                            p: { xs: 2, sm: 3 },
                            backgroundColor: "rgba(46, 235, 203, 0.1)",
                            borderRadius: 2,
                            border: "2px solid rgba(46, 235, 203, 0.3)",
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              mb: 2,
                              color: "#FFFFFF",
                              fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                              fontWeight: 700,
                              textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                            }}
                          >
                            Awesome! You've followed all {usersToFollow.length} accounts!
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              mb: 3,
                              color: "#FFFFFF",
                              fontSize: { xs: "0.85rem", sm: "0.95rem" },
                              fontWeight: 500,
                              textShadow: "0 1px 2px rgba(0,0,0,0.6)",
                            }}
                          >
                            Now generate a message to let them know you followed and ask for a follow back!
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: { xs: "column", sm: "row" },
                              gap: 2,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {!messageGenerated ? (
                              <Button
                                variant="contained"
                                size="large"
                                onClick={generateMessage}
                                disabled={loading}
                                sx={{
                                  py: { xs: 1.2, sm: 1.5 },
                                  px: { xs: 3, sm: 4 },
                                  fontSize: { xs: "0.85rem", sm: "0.95rem" },
                                  fontWeight: 600,
                                  backgroundColor: "#FFFFFF",
                                  color: "#0EA5A5",
                                  "&:hover": {
                                    backgroundColor: "#E0E0E0",
                                  },
                                  "&:disabled": {
                                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                                  },
                                }}
                              >
                                {loading ? (
                                  <CircularProgress size={24} sx={{ color: "#2EEBCB" }} />
                                ) : (
                                  "Generate Follow-Back Message"
                                )}
                              </Button>
                            ) : (
                              <Button
                                variant="outlined"
                                onClick={() => setShowMessageDialog(true)}
                                sx={{
                                  color: "#FFFFFF",
                                  borderColor: "#FFFFFF",
                                  fontSize: { xs: "0.85rem", sm: "0.95rem" },
                                  fontWeight: 600,
                                  "&:hover": {
                                    borderColor: "#2EEBCB",
                                    backgroundColor: "rgba(46, 235, 203, 0.1)",
                                  },
                                }}
                              >
                                View Generated Message
                              </Button>
                            )}

                            <Button
                              variant="outlined"
                              onClick={handleStartOver}
                              sx={{
                                color: "#FFFFFF",
                                borderColor: "#FFFFFF",
                                fontSize: { xs: "0.85rem", sm: "0.95rem" },
                                fontWeight: 600,
                                "&:hover": {
                                  borderColor: "#2EEBCB",
                                  backgroundColor: "rgba(46, 235, 203, 0.1)",
                                },
                              }}
                            >
                              Start Over
                            </Button>
                          </Box>
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Container>

      <Dialog
        open={showMessageDialog}
        onClose={() => setShowMessageDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ 
          sx: { 
            backgroundColor: "rgba(0, 0, 0, 0.9)", 
            backdropFilter: "blur(25px)", 
            border: "1px solid rgba(46, 235, 203, 0.4)",
          } 
        }}
      >
        <DialogTitle sx={{ color: "#FFFFFF", fontWeight: 600 }}>
          Your Follow-Back Message
        </DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={4}
            fullWidth
            value={generatedMessage}
            variant="outlined"
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "rgba(46, 235, 203, 0.5)" },
                "&:hover fieldset": { borderColor: "#2EEBCB" },
                "&.Mui-focused fieldset": { borderColor: "#2EEBCB" },
              },
              "& .MuiInputBase-input": { 
                color: "#FFFFFF",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              },
            }}
            InputProps={{
              readOnly: true,
            }}
          />
          <Typography 
            variant="caption" 
            sx={{ 
              color: "rgba(255, 255, 255, 0.7)",
              display: "block",
              mb: 1,
            }}
          >
            This message will help you connect with other {project} enthusiasts and grow your network!
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: generatedMessage.length > 280 ? "#ff5252" : "#4CAF50",
              display: "block",
              fontWeight: 600,
            }}
          >
            Characters: {generatedMessage.length}/280
          </Typography>
        </DialogContent>
        <DialogActions sx={{ 
          flexDirection: { xs: "column", sm: "row" }, 
          gap: 1,
          p: 2,
        }}>
          <Button
            onClick={handleCopyMessage}
            startIcon={<ContentCopyIcon />}
            sx={{
              color: "#FFFFFF",
              width: { xs: "100%", sm: "auto" },
              "&:hover": { 
                backgroundColor: "rgba(46, 235, 203, 0.1)",
              },
            }}
          >
            Copy Message
          </Button>
          <Button
            onClick={handlePostOnTwitter}
            startIcon={<LaunchIcon />}
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: "#2EEBCB",
              color: "#000000",
              fontWeight: 600,
              width: { xs: "100%", sm: "auto" },
              "&:hover": { 
                backgroundColor: "#10B3A3",
              },
              "&:disabled": {
                backgroundColor: "rgba(46, 235, 203, 0.5)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#000000" }} />
            ) : (
              "Post to Twitter"
            )}
          </Button>
          <Button 
            onClick={() => setShowMessageDialog(false)} 
            sx={{ 
              color: "#FFFFFF",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: snackbarSeverity === 'error' ? '#f44336' : '#4caf50',
            color: '#ffffff',
            fontWeight: 500,
            fontSize: { xs: "0.85rem", sm: "0.95rem" },
          }
        }}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default DisplayUsers;