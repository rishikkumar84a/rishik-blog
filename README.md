# RKC Insights

A personal blog website connected to Rishik Kumar Chaurasiya's portfolio. This blog features both public-facing content and a secure admin area for content management.

## Features

### Admin Features (Secure Access)

- Secure login system using email and password authentication
- Admin dashboard with full content management capabilities
- Create, edit, and delete blog posts
- Add images and videos to posts
- Create and manage categories
- Only authorized email can access the admin area

### Public Features

- Public blog where anyone can read articles (no login required)
- Category-based article filtering
- Contact section with form (sends to admin email)
- Social media links (LinkedIn, GitHub, WhatsApp)
- SEO-friendly and mobile-responsive design
- Modern and creative styling
- Integration with portfolio site

## Tech Stack

- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose ODM
- **View Engine**: EJS templates
- **Authentication**: Express-session with bcrypt
- **File Uploads**: Multer
- **Email**: Nodemailer

## Installation

1. Clone the repository
2. Install MongoDB (if not already installed):
   - Download MongoDB 8.0.8 from the official website
   - During installation, select "Install MongoDB as a Service" option
   - Choose "Run service as Network Service user"
   - Data Directory: `C:\Program Files\MongoDB\Server\8.0\data\`
   - Log Directory: `C:\Program Files\MongoDB\Server\8.0\log\`
   - Note: The installation wizard shows the paths as seen in the image
   - You can customize these paths during installation if needed
   - The MongoDB service will start automatically with Windows
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/rishik-blog
   SESSION_SECRET=your_session_secret_key_change_this
   ADMIN_EMAIL=your_email@example.com
   ADMIN_PASSWORD=your_secure_password
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```
5. Start the server:
   ```
   npm start
   ```
   For development with auto-restart:
   ```
   npm run dev
   ```

## Usage

### Public Access
- Visit `http://localhost:3000` to view the blog
- Browse posts by category
- Use the contact form to send messages

### Admin Access
- Visit `http://localhost:3000/admin/login`
- Login with the admin email and password set in your `.env` file
- Use the dashboard to manage blog content

## Connecting to Portfolio

The blog is designed to integrate with the portfolio site at `https://rishikkumarchaurasiya.live/`. Links to the portfolio are included in the navigation and footer sections.

## Deployment to GitHub

Follow these steps to deploy this project to GitHub:

1. Create a GitHub repository for your project
2. Initialize Git in your local project folder (if not already done):
   ```
   git init
   ```
3. Add all files to Git:
   ```
   git add .
   ```
4. Commit the changes:
   ```
   git commit -m "Initial commit"
   ```
5. Add your GitHub repository as remote:
   ```
   git remote add origin https://github.com/yourusername/your-repo-name.git
   ```
6. Push to GitHub:
   ```
   git push -u origin main
   ```

Note: For a Node.js application like this, you'll need to use a hosting service that supports Node.js applications, such as Heroku, Vercel, or Netlify, as GitHub Pages only supports static websites.

## License

This project is private and intended for personal use only.

## Author

Rishik Kumar Chaurasiya