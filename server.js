require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rishik-blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define schemas
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String },
  videoUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create models
const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Category = mongoose.model('Category', categorySchema);
const Contact = mongoose.model('Contact', contactSchema);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/rishik-blog' }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, 'public/uploads'));
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    return next();
  }
  res.redirect('/admin/login');
};

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Routes

// Public routes
app.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    const categories = await Category.find();
    res.render('index', { posts, categories });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/post/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post not found');
    }
    const categories = await Category.find();
    res.render('post', { post, categories, req });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/category/:name', async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.params.name });
    if (!category) {
      return res.status(404).send('Category not found');
    }
    const posts = await Post.find({ category: category.name }).sort({ createdAt: -1 });
    const categories = await Category.find();
    res.render('category', { category, posts, categories });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/contact', async (req, res) => {
  try {
    const categories = await Category.find();
    res.render('contact', { categories });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Save contact message to database
    const newContact = new Contact({
      name,
      email,
      message
    });
    await newContact.save();
    
    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    
    const categories = await Category.find();
    res.render('contact', { success: true, categories });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Admin routes
app.get('/admin/login', (req, res) => {
  res.render('admin/login');
});

app.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('admin/login', { error: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('admin/login', { error: 'Invalid credentials' });
    }
    
    // Set session
    req.session.isAuthenticated = true;
    req.session.userId = user._id;
    
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/admin/dashboard', isAuthenticated, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    const categories = await Category.find();
    res.render('admin/dashboard', { posts, categories });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/admin/posts/new', isAuthenticated, async (req, res) => {
  try {
    const categories = await Category.find();
    res.render('admin/new-post', { categories });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/admin/posts/new', isAuthenticated, upload.single('image'), async (req, res) => {
  try {
    const { title, content, category, videoUrl } = req.body;
    
    const newPost = new Post({
      title,
      content,
      category,
      videoUrl,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : ''
    });
    
    await newPost.save();
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/admin/posts/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post not found');
    }
    const categories = await Category.find();
    res.render('admin/edit-post', { post, categories });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/admin/posts/edit/:id', isAuthenticated, upload.single('image'), async (req, res) => {
  try {
    const { title, content, category, videoUrl } = req.body;
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post not found');
    }
    
    post.title = title;
    post.content = content;
    post.category = category;
    post.videoUrl = videoUrl;
    post.updatedAt = Date.now();
    
    if (req.file) {
      post.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    await post.save();
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/admin/posts/delete/:id', isAuthenticated, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/admin/categories', isAuthenticated, async (req, res) => {
  try {
    const categories = await Category.find();
    res.render('admin/categories', { categories });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/admin/categories/new', isAuthenticated, async (req, res) => {
  try {
    const { name } = req.body;
    
    const newCategory = new Category({ name });
    await newCategory.save();
    
    res.redirect('/admin/categories');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/admin/categories/delete/:id', isAuthenticated, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.redirect('/admin/categories');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// Initialize admin user if not exists
async function initAdminUser() {
  try {
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
      console.log('Admin user created');
    }
  } catch (err) {
    console.error('Error creating admin user:', err);
  }
}

// Create uploads directory if not exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(path.join(__dirname, 'public'))) {
  fs.mkdirSync(path.join(__dirname, 'public'));
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initAdminUser();
});