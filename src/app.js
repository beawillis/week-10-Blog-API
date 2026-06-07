const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const config = require('./config/env');

const authRoutes = require('./routes/auth.routes');
const articleRoutes = require('./routes/article.routes');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./middlewares/logger');

const app = express();

app.use(cors({ origin: config.corsOrigin === '*' ? true : config.corsOrigin }));
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));
app.use(helmet());
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use('/auth', authRoutes);
app.use('/articles', articleRoutes);

app.use(errorHandler);

module.exports = app;