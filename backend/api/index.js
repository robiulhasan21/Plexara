import serverless from 'serverless-http';
import app from '../server.js';

// Wrap the Express app with serverless-http and export the handler
export default serverless(app);
