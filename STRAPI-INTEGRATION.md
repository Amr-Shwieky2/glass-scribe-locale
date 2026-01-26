# Strapi CMS Integration Guide

## 🎯 Overview

This React frontend is now configured to work with a Strapi CMS backend. The integration uses a "zero hardcoded content" approach where all business data comes from Strapi while keeping UI/UX and translations in React.

## 📁 File Structure

```
src/lib/strapi/
├── client.ts          # Fetch wrapper with error handling
├── queries.ts         # Query builders (populate, filters, sort)
├── types.ts           # TypeScript types for Strapi responses
├── api.ts             # API functions (getSiteSettings, getServices, etc.)
├── hooks.ts           # React Query hooks for data fetching
└── index.ts           # Central export file
```

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_TOKEN=your_read_only_api_token_here
```

**Getting your Strapi token:**
1. Go to Strapi admin: `http://localhost:1337/admin`
2. Navigate to Settings → API Tokens
3. Create a new **Read-Only** token
4. Copy the token and add it to `.env`

## 📊 Strapi Content Types Required

### 1. Site Settings (Single Type)
```json
{
  "siteName": "Text",
  "phone": "Text",
  "whatsapp": "Text",
  "email": "Email",
  "address": "Text",
  "businessHours": "Text",
  "logo": "Media (Single)",
  "brandColors": {
    "navyBlue": "Text",
    "lightBlue": "Text",
    "gold": "Text",
    "darkNavy": "Text"
  },
  "socialMedia": {
    "facebook": "Text",
    "instagram": "Text",
    "linkedin": "Text"
  }
}
```

**Enable i18n**: Yes (en, he, ar)

### 2. Services (Collection Type)
```json
{
  "title": "Text (Required)",
  "slug": "UID (from title)",
  "description": "Text (Long)",
  "icon": "Text (Lucide icon name)",
  "coverImage": "Media (Single)",
  "gallery": "Media (Multiple)",
  "category": "Text",
  "order": "Number (Default: 0)"
}
```

**Enable i18n**: Yes (en, he, ar)

### 3. Project Categories (Collection Type)
```json
{
  "name": "Text (Required)",
  "slug": "UID (from name)",
  "order": "Number (Default: 0)"
}
```

**Enable i18n**: Yes (en, he, ar)

### 4. Projects (Collection Type)
```json
{
  "title": "Text (Required)",
  "slug": "UID (from title)",
  "description": "Text (Long)",
  "coverImage": "Media (Single, Required)",
  "gallery": "Media (Multiple)",
  "category": "Relation (Many-to-One with project-categories)",
  "order": "Number (Default: 0)",
  "featured": "Boolean (Default: false)"
}
```

**Enable i18n**: Yes (en, he, ar)

### 5. Testimonials (Collection Type)
```json
{
  "name": "Text (Required)",
  "location": "Text",
  "service": "Text",
  "text": "Text (Long, Required)",
  "rating": "Number (Default: 5)",
  "order": "Number (Default: 0)"
}
```

**Enable i18n**: Yes (en, he, ar)

### 6. Process Steps (Collection Type)
```json
{
  "title": "Text (Required)",
  "description": "Text (Long)",
  "icon": "Text (Lucide icon name)",
  "order": "Number (Default: 0)"
}
```

**Enable i18n**: Yes (en, he, ar)

## 🚀 Usage in Components

### Fetching Site Settings (Header/Footer)

```tsx
import { useSiteSettings, getStrapiImageUrl } from '@/lib/strapi';

function Header() {
  const { data: settings, isLoading } = useSiteSettings();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <header>
      <img src={getStrapiImageUrl(settings?.logo?.attributes?.url)} alt="Logo" />
      <a href={`tel:${settings?.phone}`}>{settings?.phone}</a>
      <a href={`https://wa.me/${settings?.whatsapp}`}>WhatsApp</a>
    </header>
  );
}
```

### Fetching Services

```tsx
import { useServices, getStrapiImageFormat } from '@/lib/strapi';

function ServicesPage() {
  const { data: services, isLoading, error } = useServices();
  
  if (isLoading) return <div>Loading services...</div>;
  if (error) return <div>Error loading services</div>;
  
  return (
    <div>
      {services?.map(service => (
        <div key={service.slug}>
          <img 
            src={getStrapiImageFormat(service.coverImage, 'medium')} 
            alt={service.title}
          />
          <h3>{service.title}</h3>
          <p>{service.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Fetching Projects with Categories

```tsx
import { useProjects, useProjectCategories, getStrapiImageFormat } from '@/lib/strapi';

function ProjectsPage() {
  const { data: categoriesData } = useProjectCategories();
  const { data: projectsData, isLoading } = useProjects();
  
  const projects = projectsData?.projects || [];
  const categories = categoriesData || [];
  
  if (isLoading) return <div>Loading projects...</div>;
  
  return (
    <div>
      {/* Category filters */}
      {categories.map(cat => (
        <button key={cat.slug}>{cat.name}</button>
      ))}
      
      {/* Projects grid */}
      {projects.map(project => (
        <div key={project.slug}>
          <img 
            src={getStrapiImageFormat(project.coverImage, 'small')} 
            alt={project.title}
          />
          <h3>{project.title}</h3>
        </div>
      ))}
    </div>
  );
}
```

## 🖼️ Image Optimization

Always use optimized image formats:

```tsx
import { getStrapiImageFormat } from '@/lib/strapi';

// For cards/thumbnails
<img src={getStrapiImageFormat(image, 'small')} />

// For medium displays
<img src={getStrapiImageFormat(image, 'medium')} />

// For hero sections
<img src={getStrapiImageFormat(image, 'large')} />

// For lightbox (full quality)
<img src={getStrapiImageFormat(image, 'large')} />
```

## 🔄 Caching Strategy

TanStack Query handles caching automatically:

- **Site Settings**: 10 minutes (rarely changes)
- **Services**: 5 minutes
- **Projects**: 5 minutes
- **Testimonials**: 10 minutes
- **Process Steps**: 10 minutes

Data is refetched when:
- Stale time expires
- Component remounts (but uses cache first)
- Manual refetch triggered

## ⚠️ Error Handling

```tsx
import { useServices } from '@/lib/strapi';

function ServicesPage() {
  const { data, isLoading, error } = useServices();
  
  if (error) {
    console.error('Strapi error:', error);
    // Show fallback UI or use local data
    return <div>Unable to load services. Please try again.</div>;
  }
  
  // Rest of component...
}
```

## 🔧 Development vs Production

### Development
```env
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_TOKEN=dev_token_here
```

### Production
```env
VITE_STRAPI_URL=https://cms.yourdomain.com
VITE_STRAPI_TOKEN=prod_read_only_token
```

## 📝 Migration Steps

### Phase 1: Site Settings ✅
- [x] Create Strapi client layer
- [x] Set up React Query
- [ ] Update Header component
- [ ] Update Footer component
- [ ] Test in all 3 languages

### Phase 2: Services ✅
- [ ] Replace `src/data/services.ts` with Strapi calls
- [ ] Update Services page
- [ ] Update HomeNew services section
- [ ] Test service detail pages

### Phase 3: Projects ✅
- [ ] Replace local images with Strapi
- [ ] Update Projects page
- [ ] Add category filtering
- [ ] Test lightbox gallery

### Phase 4: Additional Content
- [ ] Testimonials from Strapi
- [ ] Process steps from Strapi
- [ ] Update all pages

## 🧪 Testing

```bash
# Check Strapi connection
npm run dev
# Open browser console
# You should see no Strapi errors

# Test in all languages
# Switch between EN, HE, AR
# Verify data loads in correct language
```

## 🐛 Troubleshooting

### "Failed to fetch" error
- Check Strapi is running: `http://localhost:1337/admin`
- Verify API token is correct
- Check CORS settings in Strapi

### Images not loading
- Verify image URLs in Strapi admin
- Check image formats are generated
- Use `getStrapiImageUrl()` helper

### Wrong language data
- Verify content has all 3 translations in Strapi
- Check `locale` param is being sent
- Clear browser cache

## 📚 Next Steps

1. **Set up Strapi backend** with all content types
2. **Migrate existing data** to Strapi
3. **Update components** to use Strapi hooks
4. **Remove hardcoded data** files
5. **Test thoroughly** in all languages
6. **Deploy** both Strapi and React app

## 🔗 Resources

- [Strapi Documentation](https://docs.strapi.io)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Strapi i18n Plugin](https://docs.strapi.io/dev-docs/plugins/i18n)

---

**Ready to migrate!** Start with Phase 1 (Site Settings) and work through each phase systematically.
