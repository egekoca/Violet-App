/**
 * Backend API for Sponsored Transactions
 * Gas fee-free transactions with the real Enoki API
 * Gerçek Enoki API ile gas fee'siz işlemler
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { EnokiClient } = require('@mysten/enoki');
const { SuiClient, getFullnodeUrl } = require('@mysten/sui/client');
const { toBase64 } = require('@mysten/sui/utils');
const { Transaction } = require('@mysten/sui/transactions');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5174',
  credentials: true
}));
app.use(express.json());

// Contract information
const PACKAGE_ID = '0x3ff3a568887c819e06f8f4521052853c40c1f311b41450b38f5c68f9cd4b3aa0';
const MODULE_NAME = 'linktree';

// Initialize clients
const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });
const enokiClient = new EnokiClient({
  apiKey: process.env.ENOKI_PRIVATE_KEY,
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend API is running with real Enoki API',
    timestamp: new Date().toISOString(),
    enokiConfigured: !!process.env.ENOKI_PRIVATE_KEY
  });
});

/**
 * Contract info endpoint
 */
app.get('/api/contract-info', (req, res) => {
  res.json({
    packageId: PACKAGE_ID,
    moduleName: MODULE_NAME,
    network: 'testnet',
    functions: [
      'create_profile',
      'update_profile', 
      'add_link',
      'update_link',
      'delete_link',
      'toggle_link'
    ]
  });
});

/**
 * Sponsored transaction endpoint
 */
app.post('/api/sponsor-transaction', async (req, res) => {
  try {
    const { transactionBlockKindBytes, userAddress, jwt } = req.body;

    if (!transactionBlockKindBytes || !userAddress) {
      return res.status(400).json({
        error: 'transactionBlockKindBytes and userAddress are required'
      });
    }

    if (!process.env.ENOKI_PRIVATE_KEY) {
      return res.status(500).json({
        error: 'ENOKI_PRIVATE_KEY not configured',
        message: 'Please set ENOKI_PRIVATE_KEY in .env file'
      });
    }

    console.log('Starting a sponsored transaction...', {
      userAddress,
      txBytesLength: transactionBlockKindBytes.length
    });

    // Enoki API ile sponsored transaction oluştur
    // Start a sponsored transaction with Enoki API
    const enokiApiUrl = 'https://api.enoki.mystenlabs.com/v1/transaction-blocks/sponsor';
    
    const sponsorResponse = await fetch(enokiApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ENOKI_PRIVATE_KEY}`,
        'Content-Type': 'application/json',
        ...(jwt && { 'zklogin-jwt': jwt }), // Add JWT
      },
      body: JSON.stringify({
        network: 'testnet',
        transactionBlockKindBytes: transactionBlockKindBytes, // Base64 string
      }),
    });

    if (!sponsorResponse.ok) {
      const errorText = await sponsorResponse.text();
      throw new Error(`Enoki sponsor API error: ${sponsorResponse.status} - ${errorText}`);
    }

    const sponsored = await sponsorResponse.json();

    res.json({
      success: true,
      result: sponsored
    });

  } catch (error) {
    console.error('Sponsored transaction error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to sponsor transaction'
    });
  }
});

/**
 * Execute sponsored transaction endpoint
 */
app.post('/api/execute-transaction', async (req, res) => {
  try {
    const { digest, signature, jwt } = req.body;

    console.log('Executing the sponsored transaction...', {
      digest: `${digest.slice(0, 8)}...${digest.slice(-4)}`,
      hasSignature: !!signature,
      hasJwt: !!jwt
    });

    // Use the Enoki execute API endpoint
    const executeApiUrl = `https://api.enoki.mystenlabs.com/v1/transaction-blocks/sponsor/${digest}`;
    
    const executeResponse = await fetch(executeApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ENOKI_PRIVATE_KEY}`,
        'Content-Type': 'application/json',
        ...(jwt && { 'zklogin-jwt': jwt }), // Add JWT
      },
      body: JSON.stringify({
        signature: signature || 'zkLogin_signature',
      }),
    });

    if (!executeResponse.ok) {
      const errorText = await executeResponse.text();
      throw new Error(`Enoki execute API error: ${executeResponse.status} - ${errorText}`);
    }

    const result = await executeResponse.json();
    res.json({ result });
  } catch (error) {
    console.error('Execute transaction error:', error);
    res.status(500).json({ error: 'Failed to execute transaction' });
  }
});

// Rate limiting (basic in-memory)
const rateLimit = new Map();

app.use('/api/sponsor-transaction', (req, res, next) => {
  const userAddress = req.body.userAddress;
  const now = Date.now();
  const windowMs = 24 * 60 * 60 * 1000; // 24 hours
  const maxRequests = 10; // Daily limit per user

  if (userAddress) {
    const userLimit = rateLimit.get(userAddress) || { count: 0, resetTime: now + windowMs };
    
    if (now > userLimit.resetTime) {
      userLimit.count = 0;
      userLimit.resetTime = now + windowMs;
    }

    if (userLimit.count >= maxRequests) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: `Maximum ${maxRequests} sponsored transactions per day`,
        resetTime: new Date(userLimit.resetTime).toISOString()
      });
    }

    userLimit.count++;
    rateLimit.set(userAddress, userLimit);
  }

  next();
});

app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Contract info: http://localhost:${PORT}/api/contract-info`);
  console.log(`Sponsored transactions: http://localhost:${PORT}/api/sponsor-transaction`);
  console.log(`Enoki configured: ${!!process.env.ENOKI_PRIVATE_KEY}`);
});

module.exports = app;