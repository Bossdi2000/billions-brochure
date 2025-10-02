import { useState } from "react";
import { 
  Box, 
  Button, 
  Typography, 
  CircularProgress, 
  Alert, 
  Snackbar,
  Backdrop,
  Chip
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CasinoIcon from "@mui/icons-material/Casino";
import StarsIcon from "@mui/icons-material/Stars";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Roulette = ({ username, project, userId, onNext }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [finalNumber, setFinalNumber] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [sparkles, setSparkles] = useState([]);

  const numbers = [2, 3, 4, 5, 6];
  const primaryTeal = "#2EEBCB";

  const createSparkles = () => {
    const newSparkles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5,
    }));
    setSparkles(newSparkles);
  };

  const handleSpin = () => {
    setIsSpinning(true);
    setShowResult(false);
    setFinalNumber(null);
    setError("");
    setCurrentNumber(numbers[0]);

    let counter = 0;
    const maxSpins = 25;
    let speed = 50;

    const spinInterval = setInterval(() => {
      setCurrentNumber(numbers[Math.floor(Math.random() * numbers.length)]);
      counter++;
      speed += 5; // Gradually slow down

      if (counter >= maxSpins) {
        clearInterval(spinInterval);
        const result = numbers[Math.floor(Math.random() * numbers.length)];
        setCurrentNumber(result);
        setFinalNumber(result);
        setIsSpinning(false);
        createSparkles();
        setTimeout(() => {
          setShowResult(true);
        }, 800);
      }
    }, speed);
  };

  const handleContinue = async () => {
    if (!finalNumber) {
      setError("Please spin the roulette first");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/f4f/users`, {
        params: {
          project,
          count: finalNumber,
          currentUsername: username,
        },
      });

      onNext({
        username,
        project,
        userId,
        users: response.data.users,
        userCount: finalNumber,
      });
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Failed to fetch users");
      } else {
        setError("Network error. Please try again.");
      }
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      {/* Full Screen Casino Container */}
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
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          },
        }}
      >
        {/* Animated Casino Lights Background */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `
              radial-gradient(circle at 15% 25%, rgba(255, 215, 0, 0.1) 0%, transparent 30%),
              radial-gradient(circle at 85% 25%, rgba(255, 98, 0, 0.1) 0%, transparent 30%),
              radial-gradient(circle at 15% 75%, rgba(255, 20, 147, 0.1) 0%, transparent 30%),
              radial-gradient(circle at 85% 75%, rgba(138, 43, 226, 0.1) 0%, transparent 30%)
            `,
            zIndex: 1,
          }}
        />

        {/* Floating casino elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              fontSize: `${20 + i * 5}px`,
              color: `hsl(${i * 45}, 70%, 60%)`,
              zIndex: 2,
            }}
            animate={{
              x: [0, 50, -50, 0],
              y: [0, -30, 30, 0],
              rotate: [0, 180, 360],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
          >
            {i % 4 === 0 ? "💎" : i % 4 === 1 ? "🎰" : i % 4 === 2 ? "⭐" : "🎲"}
          </motion.div>
        ))}

        {/* Main Casino Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
          style={{ 
            zIndex: 10, 
            width: "100%", 
            maxWidth: { xs: "95%", sm: "500px", md: "600px" }, 
            padding: { xs: "10px", sm: "20px" }
          }}
        >
          {/* Neon Casino Card */}
          <Box
            sx={{
              background: `
                linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)),
                linear-gradient(145deg, rgba(255, 98, 0, 0.1), rgba(255, 98, 0, 0.05))
              `,
              backdropFilter: "blur(20px)",
              borderRadius: "32px",
              border: "2px solid rgba(255, 215, 0, 0.3)",
              boxShadow: `
                0 0 60px rgba(255, 215, 0, 0.2),
                0 25px 50px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `,
              padding: { xs: "20px", sm: "30px", md: "40px" },
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Sparkle Effects */}
            <AnimatePresence>
              {showResult && sparkles.map((sparkle) => (
                <motion.div
                  key={sparkle.id}
                  initial={{ opacity: 0, scale: 0, x: "50%", y: "50%" }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    x: `${sparkle.x}%`,
                    y: `${sparkle.y}%`,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 2,
                    delay: sparkle.delay,
                    ease: "easeOut",
                  }}
                  style={{
                    position: "absolute",
                    pointerEvents: "none",
                    zIndex: 20,
                  }}
                >
                  <StarsIcon sx={{ color: "#FFD700", fontSize: "24px" }} />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Casino Header */}
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Box sx={{ mb: 4 }}>
                <motion.div
                  animate={{
                    rotate: [0, -10, 10, 0],
                    scale: isSpinning ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    scale: { duration: 0.5, repeat: isSpinning ? Infinity : 0 },
                  }}
                >
                  <CasinoIcon
                    sx={{
                      fontSize: { xs: 50, sm: 60, md: 70, lg: 80 },
                      color: "#FFD700",
                      mb: { xs: 1, sm: 2 },
                      filter: "drop-shadow(0 0 20px #FFD700)",
                    }}
                  />
                </motion.div>

                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    background: "linear-gradient(45deg, #A7F3D0, #5EEAD4, #2EEBCB)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem", lg: "3.5rem" },
                    fontWeight: 900,
                    textShadow: "0 0 30px rgba(255, 215, 0, 0.5)",
                    mb: { xs: 1, sm: 2 },
                    textAlign: "center",
                  }}
                >
                  🎰 CRYPTO ROULETTE 🎰
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    color: "#FFFFFF",
                    fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem", lg: "1.4rem" },
                    fontWeight: 400,
                    opacity: 0.9,
                  }}
                >
                  Spin to discover your follow count!
                </Typography>

                <Chip
                  label={`Project: ${project.toUpperCase()}`}
                  sx={{
                    mt: 2,
                    background: "linear-gradient(45deg, #2EEBCB, #0EA5A5)",
                    color: "#FFFFFF",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    height: "32px",
                  }}
                />
              </Box>
            </motion.div>

            {/* Mega Roulette Wheel */}
            <Box sx={{ mb: 5, position: "relative" }}>
              {/* Outer Glow Ring */}
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: { xs: 200, sm: 250, md: 300 },
                  height: { xs: 200, sm: 250, md: 300 },
                  borderRadius: "50%",
                  background: `conic-gradient(
                    #A7F3D0 0deg 72deg,
                    #2EEBCB 72deg 144deg,
                    #A7F3D0 144deg 216deg,
                    #2EEBCB 216deg 288deg,
                    #A7F3D0 288deg 360deg
                  )`,
                  opacity: isSpinning ? 1 : 0.5,
                  filter: "blur(10px)",
                  zIndex: 1,
                }}
              />

              {/* Main Roulette Wheel */}
              <motion.div
                animate={{
                  rotate: isSpinning ? [0, 1800] : 0,
                  scale: isSpinning ? [1, 1.05, 1] : showResult ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  rotate: { duration: 3, ease: "easeOut" },
                  scale: { duration: 0.6, repeat: isSpinning ? 3 : showResult ? 1 : 0 },
                }}
                style={{ zIndex: 2, position: "relative" }}
              >
                <Box
                  sx={{
                    width: { xs: 180, sm: 220, md: 260 },
                    height: { xs: 180, sm: 220, md: 260 },
                    borderRadius: "50%",
                    background: `
                      linear-gradient(145deg, #FFFFFF, #F0F0F0),
                      conic-gradient(
                        #A7F3D0 0deg 72deg,
                        #FFFFFF 72deg 144deg,
                        #A7F3D0 144deg 216deg,
                        #FFFFFF 216deg 288deg,
                        #A7F3D0 288deg 360deg
                      )
                    `,
                    border: "8px solid #A7F3D0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    boxShadow: `
                      0 0 40px rgba(255, 215, 0, 0.6),
                      0 15px 35px rgba(0, 0, 0, 0.3),
                      inset 0 5px 10px rgba(255, 255, 255, 0.3)
                    `,
                    position: "relative",
                  }}
                >
                  {/* Center Number Display */}
                  <Box
                    sx={{
                      width: { xs: 80, sm: 100, md: 120 },
                      height: { xs: 80, sm: 100, md: 120 },
                      borderRadius: "50%",
                      background: "linear-gradient(145deg, #2EEBCB, #0EA5A5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "4px solid #FFFFFF",
                      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentNumber || "question"}
                        initial={{ opacity: 0, scale: 0.3, rotateY: 90 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        exit={{ opacity: 0, scale: 0.3, rotateY: -90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Typography
                          variant="h1"
                          sx={{
                            color: "#FFFFFF",
                            fontWeight: 900,
                            fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
                            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.5)",
                            lineHeight: 1,
                          }}
                        >
                          {currentNumber || "?"}
                        </Typography>
                      </motion.div>
                    </AnimatePresence>
                  </Box>

                  {/* Roulette Pointer */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: "-15px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 0,
                      height: 0,
                      borderLeft: "12px solid transparent",
                      borderRight: "12px solid transparent",
                      borderTop: "25px solid #A7F3D0",
                      filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
                      zIndex: 10,
                    }}
                  />
                </Box>
              </motion.div>
            </Box>

            {/* Action Buttons */}
            <AnimatePresence mode="wait">
              {!isSpinning && !showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<FlashOnIcon />}
                      onClick={handleSpin}
                      sx={{
                        py: 2,
                        px: 4,
                        fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                        fontWeight: 700,
                        borderRadius: "20px",
                        background: "linear-gradient(45deg, #A7F3D0, #2EEBCB)",
                        color: "#000",
                        boxShadow: `
                          0 8px 25px rgba(255, 215, 0, 0.4),
                          0 0 40px rgba(255, 215, 0, 0.2)
                        `,
                        border: "3px solid #FFFFFF",
                        "&:hover": {
                          background: "linear-gradient(45deg, #5EEAD4, #0EA5A5)",
                          boxShadow: `
                            0 12px 35px rgba(255, 215, 0, 0.6),
                            0 0 50px rgba(255, 215, 0, 0.3)
                          `,
                        },
                      }}
                    >
                      🎲 SPIN THE WHEEL! 🎲
                    </Button>
                  </motion.div>
                </motion.div>
              )}

              {isSpinning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
                    <CircularProgress size={30} sx={{ color: "#2EEBCB" }} />
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#FFFFFF",
                        fontSize: { xs: "1rem", sm: "1.2rem" },
                        fontWeight: 600,
                      }}
                    >
                      ✨ The wheel is spinning... ✨
                    </Typography>
                  </Box>
                </motion.div>
              )}

              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{
                        mb: 2,
                        background: "linear-gradient(45deg, #2EEBCB, #FFFFFF)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                        fontWeight: 800,
                        textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
                      }}
                    >
                      🎉 JACKPOT! 🎉
                    </Typography>

                    <Typography
                      variant="h5"
                      sx={{
                        mb: 1,
                        color: "#FFFFFF",
                        fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.6rem" },
                        fontWeight: 600,
                      }}
                    >
                      You'll follow {finalNumber} awesome accounts!
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        mb: 4,
                        color: "rgba(255, 255, 255, 0.8)",
                        fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                      }}
                    >
                      All passionate about {project.toUpperCase()} 🚀
                    </Typography>

                    <motion.div
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="contained"
                        size="large"
                        onClick={handleContinue}
                        sx={{
                          py: 2,
                          px: 5,
                          fontSize: { xs: "1rem", sm: "1.2rem", md: "1.3rem" },
                          fontWeight: 700,
                          borderRadius: "20px",
                          background: "linear-gradient(45deg, #2EEBCB, #0EA5A5)",
                          color: "#FFFFFF",
                          boxShadow: "0 8px 25px rgba(255, 98, 0, 0.4)",
                          border: "3px solid #FFFFFF",
                          "&:hover": {
                            background: "linear-gradient(45deg, #0EA5A5, #0E7F7F)",
                            boxShadow: "0 12px 35px rgba(255, 98, 0, 0.6)",
                          },
                        }}
                      >
                        🎯 LET'S GO! 🎯
                      </Button>
                    </motion.div>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </motion.div>
      </Box>

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

export default Roulette;
