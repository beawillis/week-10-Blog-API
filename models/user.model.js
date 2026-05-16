const mongoose = require('mongoose'); // Import Mongoose library

const userSchema = new mongoose.Schema({ // Define the User schema
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields    
}
);

module.exports = mongoose.model('User', userSchema); // Export the User model