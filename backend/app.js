const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const voteRoutes = require("./routes/voteRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// --- Allowed origins ---
const allowedOrigins = [
  'http://localhost:5173'
];

// --- CORS Middleware ---
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.log('Blocked CORS origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS','PATCH'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With','Accept','Origin'],
  optionsSuccessStatus: 204
}));


// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/vote", voteRoutes);
app.use("/api/admin", adminRoutes);


// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    timestamp: new Date().toISOString()
  });

  const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === "production" ? 'Something went wrong' : err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

module.exports = app;