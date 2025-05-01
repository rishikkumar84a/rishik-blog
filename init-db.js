// Database initialization script
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rishik-blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for initialization'))
.catch(err => console.error('MongoDB connection error:', err));

// Define schemas
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

// Create models
const User = mongoose.model('User', userSchema);
const Category = mongoose.model('Category', categorySchema);

// Initialize admin user and default categories
async function initializeDatabase() {
  try {
    // Create admin user if not exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    const existingUser = await User.findOne({ email: adminEmail });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const newUser = new User({
        email: adminEmail,
        password: hashedPassword
      });
      await newUser.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
    
    // Create default categories if not exist
    const defaultCategories = ['Technology', 'Personal', 'Projects', 'Tutorials'];
    
    for (const categoryName of defaultCategories) {
      const existingCategory = await Category.findOne({ name: categoryName });
      if (!existingCategory) {
        const newCategory = new Category({ name: categoryName });
        await newCategory.save();
        console.log(`Category '${categoryName}' created successfully`);
      } else {
        console.log(`Category '${categoryName}' already exists`);
      }
    }
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the initialization
initializeDatabase();