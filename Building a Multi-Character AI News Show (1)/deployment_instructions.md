# Deployment Instructions for AI News Show

## Backend Deployment to Heroku

1. Install the Heroku CLI:
```bash
npm install -g heroku
```

2. Login to Heroku:
```bash
heroku login
```

3. Navigate to the backend directory:
```bash
cd /home/ubuntu/ai-news-show/backend
```

4. Initialize a Git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial backend deployment"
```

5. Create a Heroku app:
```bash
heroku create ai-news-show-backend
```

6. Set environment variables:
```bash
heroku config:set NODE_ENV=production
heroku config:set OPENAI_API_KEY=your_openai_api_key
heroku config:set GOOGLE_NEWS_API_KEY=your_google_news_api_key
heroku config:set PRODUCER_PASSWORD=producer123
heroku config:set CORS_ORIGIN=https://ai-news-show.vercel.app
```

7. Deploy to Heroku:
```bash
git push heroku master
```

8. Enable WebSockets:
```bash
heroku features:enable http-session-affinity
```

## Frontend Deployment to Vercel

1. Install the Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Navigate to the frontend directory:
```bash
cd /home/ubuntu/ai-news-show/frontend
```

4. Deploy to Vercel:
```bash
vercel --prod
```

5. During deployment, Vercel will ask for configuration options. Use the following:
   - Set up and deploy: Yes
   - Directory: ./
   - Override settings: No

6. After deployment, Vercel will provide a URL for your deployed frontend.

## Connecting Frontend to Backend

1. Update the frontend environment variables in Vercel:
   - Go to the Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add the following variables:
     - NEXT_PUBLIC_BACKEND_URL=https://ai-news-show-backend.herokuapp.com
     - NEXT_PUBLIC_SOCKET_URL=https://ai-news-show-backend.herokuapp.com

2. Redeploy the frontend:
```bash
vercel --prod
```

## Verifying the Deployment

1. Visit your Vercel frontend URL to ensure the application loads correctly.
2. Test the producer panel login with the password "producer123".
3. Test the chat functionality to ensure real-time communication works.
4. Test the news fetching and character animations.

## Setting Up a Custom Domain (Optional)

1. Purchase a domain from a domain registrar (e.g., Namecheap, GoDaddy).
2. Add the domain to your Vercel project:
   - Go to the Vercel dashboard
   - Select your project
   - Go to Settings > Domains
   - Add your domain

3. Configure DNS settings as instructed by Vercel.
4. Update the CORS_ORIGIN environment variable in Heroku to match your custom domain.

## Monitoring and Maintenance

1. Set up monitoring for your Heroku app:
```bash
heroku addons:create papertrail:choklad
```

2. View logs:
```bash
heroku logs --tail
```

3. Set up automatic backups for your database (if applicable).

4. Regularly update dependencies to patch security vulnerabilities.
