const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const apiRoutes = require('../backend/src/routes/api');

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Vercel strips the /api function prefix before invoking this handler.
app.use('/', apiRoutes);

// Serverless Handler
module.exports = app;
