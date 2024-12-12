const express = require('express');
const cookieParser = require('cookie-parser'); 
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./config/database');  
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
dotenv.config();  // Load environment variables

// Middleware
app.use(cors());  // Enable Cross-Origin Request Sharing (CORS)
app.use(cookieParser());  // Parse cookies in the incoming requests
app.use(bodyParser.json());  // Parse JSON requests

// Import Routes
const authRoutes = require('./controllers/userController');
const memberRoutes = require('./controllers/membersController');
const rolesRoutes = require('./controllers/rolesController');
app.use('/api/dashboard', dashboardRoutes);


// Use Routes
app.use('/api/auth', authRoutes);  // Authentication routes (register, login)
app.use('/api/members', memberRoutes);  // Members management routes
app.use('/api/roles', rolesRoutes);  // Members management routes

// Public folder for frontend (if serving from the same server)
app.use(express.static(path.join(__dirname, 'public')));

// // Test Route (Protected)
// app.get('/api/test', authenticate, (req, res) => {
//   res.json({ message: 'This is a protected route', user: req.user });
// });

// Sequelize Sync (syncing the database with the models)
sequelize.sync()
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
