# Deploying RKC Insights to Vercel with Custom Subdomain

This guide will walk you through the process of deploying your RKC Insights blog to Vercel and setting up the custom subdomain `blog.rishikkumarchaurasiya.live`.

## Prerequisites

- GitHub account
- Vercel account (you can sign up at [vercel.com](https://vercel.com) using your GitHub account)
- Access to your domain's DNS settings (for `rishikkumarchaurasiya.live`)

## Step 1: Prepare Your Project for Deployment

1. Make sure your project is ready for production:
   - Ensure all dependencies are correctly listed in `package.json`
   - Add build scripts to your package.json:
     ```json
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js",
       "build": "npm install",
       "vercel-build": "npm install"
     }
     ```
   - Verify that your application works locally

2. Create a `vercel.json` file in the root of your project with the following configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

3. Update your MongoDB connection to work with both development and production environments:
   - Your current setup already handles this with the fallback to local MongoDB

## Step 2: Push Your Code to GitHub

1. If you haven't already, create a GitHub repository for your project
2. Push your code to GitHub following the instructions in your README.md

## Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click on "Add New..." → "Project"
3. Import your GitHub repository (rishik-blog)
4. Configure the project:
   - Framework Preset: Select "Other"
   - Build Command: `npm run vercel-build` or `npm run build`
   - Output Directory: `public` if it exists, or `.`
   - Install Command: `npm install`
   - Development Command: `npm run dev`

   > Note: The configuration shown in the screenshot is correct and matches these recommended settings.

5. Set up environment variables (from your `.env` file):
   - Click on "Environment Variables" and add the following:
     - `MONGODB_URI`: Your MongoDB connection string (use MongoDB Atlas for production)
     - `SESSION_SECRET`: Your session secret key
     - `ADMIN_EMAIL`: Your admin email
     - `ADMIN_PASSWORD`: Your admin password
     - `EMAIL_USER`: Your email for sending notifications
     - `EMAIL_PASS`: Your email app password

6. Click "Deploy"

## Step 4: Set Up MongoDB Atlas (Production Database)

1. Sign up for a free MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (the free tier is sufficient to start)
3. Set up database access:
   - Create a database user with a strong password
   - Add your IP to the IP Access List (or allow access from anywhere for Vercel)
4. Connect to your cluster:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
5. Update your Vercel environment variables:
   - Go to your project on Vercel
   - Navigate to Settings → Environment Variables
   - Update the `MONGODB_URI` with your MongoDB Atlas connection string

## Step 5: Configure Custom Subdomain

1. In your Vercel dashboard, go to your project
2. Navigate to "Settings" → "Domains"
3. Add your custom domain: `blog.rishikkumarchaurasiya.live`
4. Vercel will provide you with DNS configuration instructions

## Step 6: Configure DNS for Your Subdomain

1. Go to your domain registrar where `rishikkumarchaurasiya.live` is registered
2. Access the DNS settings
3. Add a CNAME record:
   - Type: CNAME
   - Name/Host: `blog`
   - Value/Target: Your Vercel deployment URL (e.g., `rishik-blog.vercel.app`)
   - TTL: Use default or set to 3600

4. Alternatively, if Vercel provides nameserver instructions:
   - Add the nameserver records as instructed by Vercel

5. Wait for DNS propagation (can take up to 48 hours, but often completes within a few hours)

## Step 7: Verify Deployment

1. Visit `blog.rishikkumarchaurasiya.live` to ensure your blog is properly deployed
2. Test all functionality:
   - Viewing posts
   - Admin login
   - Creating/editing posts
   - Contact form

## Troubleshooting

- **Deployment Errors**: Check Vercel logs for any deployment issues
- **Database Connection Issues**: Verify your MongoDB Atlas connection string and network access settings
- **Domain Configuration Problems**: Ensure DNS records are correctly set up and have had time to propagate

## Maintenance

- Future updates can be deployed automatically by pushing to your GitHub repository
- Monitor your Vercel dashboard for any issues or performance metrics
- Regularly backup your MongoDB database

## Security Considerations

- Never commit your `.env` file to GitHub
- Regularly update your admin password
- Consider implementing additional security measures like rate limiting

Congratulations! Your RKC Insights blog should now be successfully deployed to Vercel with the custom subdomain `blog.rishikkumarchaurasiya.live`.