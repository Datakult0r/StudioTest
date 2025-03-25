# AI News Show - Deployment Guide

## Prerequisites

Before deploying the AI News Show, ensure you have the following:

1. **API Keys**:
   - OpenAI API key for the Realtime API
   - Google News API key
   - (Optional) ElevenLabs API key as fallback

2. **Hosting Services**:
   - Frontend hosting (Vercel, Netlify, or AWS Amplify recommended)
   - Backend hosting (AWS EC2, Google Cloud Run, or Heroku recommended)
   - WebSocket support for real-time communication

3. **Domain Name** (optional but recommended)

## Frontend Deployment

### Option 1: Vercel (Recommended for Next.js)

1. **Prepare the project**:
   ```bash
   cd /home/ubuntu/ai-news-show/frontend
   npm run build
   ```

2. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel login
   vercel
   ```

4. **Configure environment variables**:
   - Set `NEXT_PUBLIC_API_URL` to your backend URL
   - Set `NEXT_PUBLIC_SOCKET_URL` to your WebSocket server URL

### Option 2: Netlify

1. **Prepare the project**:
   ```bash
   cd /home/ubuntu/ai-news-show/frontend
   npm run build
   ```

2. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

3. **Deploy to Netlify**:
   ```bash
   netlify login
   netlify deploy --prod
   ```

4. **Configure environment variables** in the Netlify dashboard.

## Backend Deployment

### Option 1: AWS EC2

1. **Launch an EC2 instance** with Ubuntu 22.04.

2. **Install dependencies**:
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm
   ```

3. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd ai-news-show/backend
   npm install
   ```

4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   nano .env
   ```
   Fill in all required API keys and configuration.

5. **Install PM2 for process management**:
   ```bash
   npm install -g pm2
   ```

6. **Start the server**:
   ```bash
   pm2 start server.js
   pm2 startup
   pm2 save
   ```

7. **Set up Nginx as a reverse proxy**:
   ```bash
   sudo apt install -y nginx
   sudo nano /etc/nginx/sites-available/ai-news-show
   ```
   
   Add the following configuration:
   ```
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

8. **Enable the site and restart Nginx**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/ai-news-show /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

9. **Set up SSL with Let's Encrypt**:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

### Option 2: Heroku

1. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   ```

2. **Initialize Git repository** (if not already done):
   ```bash
   cd /home/ubuntu/ai-news-show/backend
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **Create Heroku app**:
   ```bash
   heroku login
   heroku create ai-news-show-backend
   ```

4. **Set environment variables**:
   ```bash
   heroku config:set OPENAI_API_KEY=your_openai_api_key
   heroku config:set GOOGLE_NEWS_API_KEY=your_google_news_api_key
   # Set other required environment variables
   ```

5. **Deploy to Heroku**:
   ```bash
   git push heroku master
   ```

6. **Enable WebSockets**:
   ```bash
   heroku features:enable http-session-affinity
   ```

## Database Setup

For this project, we're using a file-based database system. If you want to use a more robust database:

### MongoDB Setup

1. **Create a MongoDB Atlas account** or set up a local MongoDB server.

2. **Update the DatabaseService.js** file to use MongoDB instead of file-based storage.

3. **Set the MongoDB connection string** in your environment variables.

## WebSocket Configuration

Ensure your hosting provider supports WebSockets for real-time communication:

1. **For AWS**: Ensure your load balancer is configured to support WebSockets.

2. **For Heroku**: Enable the HTTP session affinity feature.

3. **For other providers**: Check their documentation for WebSocket support.

## Post-Deployment Verification

After deployment, verify the following:

1. **Frontend-Backend Communication**: Ensure the frontend can communicate with the backend API.

2. **WebSocket Connectivity**: Verify real-time updates are working.

3. **Voice Generation**: Test voice generation for all characters.

4. **News Fetching**: Verify news is being fetched correctly.

5. **Producer Panel**: Test all producer panel functionality.

6. **Chat System**: Verify chat messages are being sent and received.

## Scaling Considerations

As your user base grows, consider the following scaling strategies:

1. **Horizontal Scaling**: Add more backend instances behind a load balancer.

2. **Caching**: Implement Redis for caching frequently accessed data.

3. **CDN**: Use a CDN for static assets to reduce server load.

4. **Database Optimization**: If using MongoDB, implement proper indexing and sharding.

5. **Voice Generation Optimization**: Implement caching for frequently used phrases.

## Monitoring and Maintenance

Set up monitoring to ensure your system remains healthy:

1. **Server Monitoring**: Use tools like PM2, New Relic, or AWS CloudWatch.

2. **Error Tracking**: Implement Sentry or similar error tracking services.

3. **Performance Monitoring**: Monitor API response times and WebSocket performance.

4. **Regular Backups**: Set up automated backups for your database.

5. **Security Updates**: Regularly update dependencies to patch security vulnerabilities.
