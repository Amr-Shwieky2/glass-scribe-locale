# Fusion Glassworks Website

A modern, multilingual website for Fusion Glassworks - a professional architectural glass installation company serving all of Israel.

## 🌟 Features

### Multilingual Support
- **Three Languages**: English, Hebrew (עברית), and Arabic (العربية)
- Full RTL (Right-to-Left) support for Hebrew and Arabic
- Automatic language detection with manual switcher
- Complete translation coverage across all pages

### Pages & Sections
- **Home**: Hero section with quick contact form, services showcase, and business statistics
- **Services**: Detailed glass installation services (Shower Enclosures, Railings, Storefronts, Windows, Mirrors, Repairs)
- **Projects**: Portfolio showcase with completed work examples
- **About**: Company story, values, and team statistics
- **Process**: 5-step installation process visualization
- **Contact**: Professional contact page with multiple contact methods
- **Contractors**: Dedicated page for trade partners and architects

### Contact Integration
- **WhatsApp Integration**: Official WhatsApp button with green branding (#25D366)
- **Telegram Bot**: Contact form submissions sent directly to Telegram
- **Floating WhatsApp Button**: Always accessible contact option
- **Phone & Email**: Direct contact links throughout the site

### Design & UX
- Modern, clean design with gradient backgrounds
- Welcoming color scheme optimized for client comfort
- Fully responsive layout for all devices
- Professional card-based layouts for Contact and About pages
- Smooth animations using Framer Motion
- Glass morphism effects and premium design elements

### Technical Features
- Built with React 18.3 and TypeScript 5.8
- Vite 5.4 for fast development and building
- Tailwind CSS for styling
- shadcn/ui component library
- i18next for internationalization
- React Router for navigation
- Form validation with React Hook Form and Zod

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm installed
- Git for version control

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd glass-scribe-locale

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
glass-scribe-locale/
├── src/
│   ├── components/         # React components
│   │   ├── icons/          # Custom icon components (WhatsApp)
│   │   ├── layout/         # Header, Footer, Layout
│   │   ├── ui/             # shadcn/ui components
│   │   ├── FloatingWhatsApp.tsx
│   │   ├── QuickContactForm.tsx
│   │   └── ServiceCard.tsx
│   ├── constants/          # App constants and configuration
│   │   ├── animation.ts    # Animation settings
│   │   └── contact.ts      # Business contact information
│   ├── contexts/           # React contexts
│   │   └── LanguageContext.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   ├── useGSAPScrollAnimations.ts
│   │   └── useScrollDetection.ts
│   ├── i18n/               # Internationalization
│   │   └── index.ts        # Translation resources (EN/HE/AR)
│   ├── lib/                # Utility libraries
│   │   ├── telegram.ts     # Telegram bot integration
│   │   └── utils.ts        # Helper functions
│   ├── pages/              # Page components
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── Contractors.tsx
│   │   ├── HomeNew.tsx
│   │   ├── NotFound.tsx
│   │   ├── Process.tsx
│   │   ├── Projects.tsx
│   │   └── Services.tsx
│   ├── styles/             # Global styles
│   │   └── premium-design.css
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global CSS
├── public/                 # Static assets
├── .env.local              # Environment variables (Telegram bot token)
└── package.json            # Dependencies and scripts
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_TELEGRAM_BOT_TOKEN=your_bot_token_here
VITE_TELEGRAM_CHAT_ID=your_chat_id_here
```

### Business Information

Update contact details in `src/constants/contact.ts`:

```typescript
export const BUSINESS_INFO = {
  phone: {
    number: "058-5022264",
    display: "058-5022264",
    link: "tel:0585022264"
  },
  whatsapp: {
    number: "972585022264",
    link: "https://wa.me/972585022264"
  },
  email: {
    address: "glassworksfusion@gmail.com",
    link: "mailto:glassworksfusion@gmail.com"
  },
  website: {
    url: "https://fusion-glassworks.co.il/",
    display: "fusion-glassworks.co.il"
  }
};
```

## 🌐 Internationalization

### Adding/Editing Translations

All translations are in `src/i18n/index.ts`. The structure supports:
- English (`en`)
- Hebrew (`he`)
- Arabic (`ar`)

Example translation structure:
```typescript
const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        services: "Services",
        // ...
      }
    }
  },
  he: {
    translation: {
      nav: {
        home: "בית",
        services: "שירותים",
        // ...
      }
    }
  }
};
```

### Using Translations in Components

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('nav.home')}</h1>;
}
```

## 🎨 Customization

### Theme Colors

Primary colors are defined in `tailwind.config.ts`:
- Primary: Blue (#3b82f6)
- WhatsApp Green: #25D366
- Gradients: Various blue-to-cyan combinations

### Styling

The project uses Tailwind CSS with custom utilities. Global styles are in:
- `src/index.css` - Base styles and CSS variables
- `src/styles/premium-design.css` - Glass morphism effects

## 📱 Contact Integration

### WhatsApp
- Official green color (#25D366)
- Custom WhatsApp icon component
- Floating button on all pages
- Direct messaging links

### Telegram Bot
- Automatic form submissions to Telegram
- Error handling with fallback to WhatsApp
- Configured in `src/lib/telegram.ts`

## 🚀 Deployment

### Build Command
```bash
npm run build
```

### Output
Production files will be in the `dist/` directory.

### Hosting Recommendations
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

### Environment Variables for Production
Make sure to set the Telegram bot credentials in your hosting platform's environment variables section.

## 📄 Technologies Used

- **React 18.3** - UI library
- **TypeScript 5.8** - Type safety
- **Vite 5.4** - Build tool
- **Tailwind CSS 3.4** - Styling
- **i18next 25.5** - Internationalization
- **React Router 6.30** - Routing
- **Framer Motion 12.23** - Animations
- **React Hook Form 7.54** - Form handling
- **Zod 3.24** - Schema validation
- **shadcn/ui** - Component library
- **Lucide React 0.462** - Icons

## 📞 Business Contact Information

**Fusion Glassworks**
- **Phone**: 058-5022264
- **WhatsApp**: 058-5022264
- **Email**: glassworksfusion@gmail.com
- **Website**: fusion-glassworks.co.il
- **Location**: Central Israel
- **Service Area**: Throughout Israel

**Business Hours**:
- Sunday-Thursday: 8:00-17:00
- Friday: 8:00-14:00
- Saturday: Closed

## 🎯 Services Offered

1. **Shower Enclosures** - Custom glass shower doors and partitions
2. **Glass Railings** - Modern railings for stairs, balconies, and terraces
3. **Storefronts** - Commercial glass storefronts and entrance systems
4. **Windows** - Custom window glass replacement and installation
5. **Mirrors** - Custom cut mirrors for various applications
6. **Glass Repairs** - Emergency glass repair services

## 📝 License

Copyright © 2025 Fusion Glassworks. All rights reserved.

## 🤝 Support

For technical support or questions about the website, contact the development team.
For glass services, contact Fusion Glassworks directly through the website.
