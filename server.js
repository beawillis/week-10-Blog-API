const config = require('./src/config/env');
const connectDB = require('./src/config/db');
const app = require('./src/app');

connectDB();

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});