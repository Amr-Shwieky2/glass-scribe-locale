# Production Deployment Guide

## ⚠️ Security Checklist Before Deployment

### 1. Build for Production
```bash
npm run build
```

### 2. Security Verification

#### ✅ Already Implemented:
- [x] Security headers configured (X-Frame-Options, X-XSS-Protection, etc.)
- [x] Source maps disabled in production
- [x] Console logs removed in production
- [x] No hardcoded API keys or secrets
- [x] Input validation on forms
- [x] Safe external link handling
- [x] .gitignore configured for sensitive files
- [x] Production dependencies audited

#### 🔒 Required Before Going Live:

1. **Enable HTTPS/SSL Certificate**
   - Use Let's Encrypt for free SSL: `certbot --apache` or `certbot --nginx`
   - Or use your hosting provider's SSL certificate
   - **Critical for Israel**: SSL is essential to prevent man-in-the-middle attacks

2. **Configure Your Web Server**
   - **Apache**: Copy `.htaccess` file to your web root
   - **Nginx**: Use the config below

3. **Update Contact Information**
   - Verify email: `info@shwaki-glass.co.il`
   - Verify phone number in `src/constants/contact.ts`
   - Test WhatsApp integration

4. **Enable DDoS Protection**
   - Use Cloudflare (free plan available)
   - Enable "Under Attack Mode" if needed
   - Set up rate limiting

5. **Backup Strategy**
   - Set up automated daily backups
   - Store backups in secure location
   - Test restoration process

## Nginx Configuration (Alternative to Apache)

Create `/etc/nginx/sites-available/shwaki-glass`:

\`\`\`nginx
server {
    listen 80;
    listen [::]:80;
    server_name shwaki-glass.co.il www.shwaki-glass.co.il;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name shwaki-glass.co.il www.shwaki-glass.co.il;
    
    # SSL Configuration (update paths after getting certificate)
    ssl_certificate /etc/letsencrypt/live/shwaki-glass.co.il/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/shwaki-glass.co.il/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    root /var/www/shwaki-glass/dist;
    index index.html;
    
    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://wa.me https://api.whatsapp.com; frame-ancestors 'none';" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=()" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
    
    # React Router - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|webp|svg|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security: Block hidden files
    location ~ /\. {
        deny all;
    }
    
    # Rate limiting (protection against DDoS)
    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
    limit_req zone=general burst=20 nodelay;
}
\`\`\`

## Cloudflare Setup (Recommended for Israel)

Cloudflare provides free DDoS protection and is especially important for Israeli websites:

1. **Sign up at cloudflare.com**
2. **Add your domain**
3. **Change nameservers at your domain registrar**
4. **Enable these features**:
   - SSL/TLS: Full (Strict)
   - Always Use HTTPS: On
   - Auto Minify: On (HTML, CSS, JS)
   - Brotli: On
   - Under Attack Mode: Use when under DDoS
   - Browser Integrity Check: On
   - Hotlink Protection: On

5. **Page Rules** (free plan allows 3):
   - `*shwaki-glass.co.il/*` → Cache Level: Standard
   - `*shwaki-glass.co.il/assets/*` → Cache Level: Cache Everything
   - `www.shwaki-glass.co.il/*` → Forwarding URL (301) to `shwaki-glass.co.il/$1`

## Deployment Steps

### Option 1: Traditional Hosting (cPanel/DirectAdmin)

1. Build the project:
   \`\`\`bash
   npm run build
   \`\`\`

2. Upload `dist/` folder contents to your web root (usually `public_html/`)

3. Copy `.htaccess` file to web root

4. Test the website

### Option 2: Vercel (Recommended - Free SSL & CDN)

1. Install Vercel CLI:
   \`\`\`bash
   npm i -g vercel
   \`\`\`

2. Deploy:
   \`\`\`bash
   vercel --prod
   \`\`\`

3. Configure custom domain in Vercel dashboard

### Option 3: Netlify

1. Install Netlify CLI:
   \`\`\`bash
   npm i -g netlify-cli
   \`\`\`

2. Deploy:
   \`\`\`bash
   netlify deploy --prod
   \`\`\`

## Post-Deployment Testing

### Security Testing:
1. **SSL Test**: https://www.ssllabs.com/ssltest/
   - Should get A or A+ rating

2. **Security Headers**: https://securityheaders.com/
   - Should get A or A+ rating

3. **Check for vulnerabilities**:
   \`\`\`bash
   npm audit --production
   \`\`\`

### Functionality Testing:
- [ ] All pages load correctly
- [ ] Images display properly
- [ ] Language switching works (EN/HE/AR)
- [ ] Quote form submits to WhatsApp
- [ ] Phone links work
- [ ] All navigation works
- [ ] Mobile responsive design
- [ ] Fast loading times (< 3 seconds)

### Browser Testing:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## Monitoring & Maintenance

1. **Set up uptime monitoring**: uptimerobot.com (free)
2. **Google Analytics** (optional): Track visitors
3. **Regular updates**:
   \`\`\`bash
   npm update
   npm audit fix
   \`\`\`

## Emergency Contacts

If under attack:
1. Enable Cloudflare "Under Attack Mode"
2. Check server logs for attack patterns
3. Block malicious IPs in firewall
4. Contact your hosting provider

## Backup & Recovery

### Backup Files to Save:
- `/dist` folder (built website)
- `/src` folder (source code)
- Database (if you add one later)
- `.env` files (if you create any)

### Backup Schedule:
- Daily: Automated backup via hosting control panel
- Weekly: Manual backup to external storage
- Before updates: Always backup before major changes

## Legal Requirements (Israel)

1. **Privacy Policy**: Add if collecting user data
2. **Terms of Service**: Recommended for commercial website
3. **Accessibility**: Ensure WCAG 2.1 AA compliance (Israeli law requires it)
4. **Business License**: Verify business registration is current

## Support

For technical issues during deployment, check:
- Hosting provider documentation
- Cloudflare status page
- GitHub issues for this project

---

**Remember**: Always test in staging environment before production deployment!
