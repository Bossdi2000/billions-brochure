import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Define a pink-heavy MUI theme inspired by Succinct Labs' logo
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF1493', // Vibrant neon pink
      contrastText: '#FFFFFF', // White for text
    },
    background: {
      default: '#FFF0F5', // Light pink background
      paper: '#FFFFFF', // White for paper components
    },
    text: {
      primary: '#FF1493', // Pink text
      secondary: '#FFFFFF', // White text
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          textTransform: 'none',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: '#C71585', // Darker pink on hover
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#FF1493',
          color: '#FFFFFF',
          fontWeight: 'bold',
        },
        body: {
          color: '#FF1493',
        },
      },
    },
  },
});

// Animation variants for Framer Motion
const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const buttonVariants = {
  hover: { scale: 1.1, transition: { duration: 0.3, yoyo: Infinity } },
  tap: { scale: 0.95 },
};

const TokenTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const contractAddress = '0x6BEF15D938d4E72056AC92Ea4bDD0D76B1C4ad29';
  const apiKey = 'JJUYVC6QCXKMDW8WEXGI9I5NVDD42F2MMZ';
  const url = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${contractAddress}&page=1&offset=10&sort=desc&apikey=${apiKey}`;

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === '1' && data.result.length > 0) {
        setTransactions(data.result);
      } else {
        setError('No transactions found or API error: ' + (data.message || 'Unknown error'));
        setTransactions([]);
      }
    } catch (err) {
      setError('Error fetching transactions: ' + err.message);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
            Token Transactions
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.primary', mb: 2 }}>
            Contract: {contractAddress}
          </Typography>
        </motion.div>

        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button variant="contained" onClick={fetchTransactions} disabled={loading} sx={{ mb: 3 }}>
            {loading ? 'Loading...' : 'Refresh Transactions'}
          </Button>
        </motion.div>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress sx={{ color: 'primary.main' }} />
            </Box>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          </motion.div>
        )}

        <TableContainer component={Paper} sx={{ boxShadow: '0 4px 20px rgba(255, 20, 147, 0.3)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tx Hash</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {transactions.map((tx, index) => (
                  <motion.tr
                    key={tx.hash}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ delay: index * 0.1 }}
                  >
                    <TableCell>
                      <a
                        href={`https://etherscan.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#FF1493', textDecoration: 'none' }}
                      >
                        {tx.hash.slice(0, 10)}...
                      </a>
                    </TableCell>
                    <TableCell>
                      {new Date(parseInt(tx.timeStamp) * 1000).toLocaleString()}
                    </TableCell>
                    <TableCell>{tx.from.slice(0, 10)}...</TableCell>
                    <TableCell>{tx.to.slice(0, 10)}...</TableCell>
                    <TableCell>
                      {(parseInt(tx.value) / 10 ** parseInt(tx.tokenDecimal)).toFixed(2)}{' '}
                      {tx.tokenSymbol}
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </ThemeProvider>
  );
};

export default TokenTransactions;