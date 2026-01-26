# Strapi Integration Quick Reference

## 🎯 Import Patterns

```typescript
// Hooks
import { 
  useServices, 
  useService, 
  useFeaturedProjects,
  useProjects,
  useProjectsByCategory,
  useProjectCategories 
} from '@/lib/strapi';

// Utilities
import { 
  getImageUrl, 
  getImageAlt,
  getGalleryImages,
  getImageSrcSet,
  getExcerpt 
} from '@/lib/strapi';

// Types
import type { Service, Project, ProjectCategory } from '@/lib/strapi';
```

---

## 📦 Common Patterns

### Get Image URL
```typescript
const imageUrl = getImageUrl(service.coverImage);
// Returns: http://localhost:1337/uploads/image.jpg
```

### Get Gallery Images
```typescript
const images = getGalleryImages(project.gallery);
images.map(img => getImageUrl({ data: img }))
```

### Get Category Title
```typescript
const categoryTitle = project.category.data.attributes.title;
```

### Responsive Image
```tsx
<img
  src={getImageUrl(service.coverImage)}
  srcSet={getImageSrcSet(service.coverImage)}
  sizes="(max-width: 768px) 100vw, 50vw"
  alt={getImageAlt(service.coverImage, service.title)}
  loading="lazy"
/>
```

### Extract Plain Text from Rich Text
```typescript
const excerpt = getExcerpt(service.description, 150);
```

---

## 🔧 Hook Examples

### All Services
```tsx
const { data: services, isLoading, error } = useServices();
```

### Single Service by Slug
```tsx
const { data: service } = useService('shower-doors');
```

### Featured Projects (limit 6)
```tsx
const { data: projects } = useFeaturedProjects(6);
```

### All Projects with Pagination
```tsx
const { data } = useProjects(page, pageSize);
const { projects, pagination } = data || {};
```

### Projects by Category
```tsx
const { data: projects } = useProjectsByCategory('residential');
```

### All Categories
```tsx
const { data: categories } = useProjectCategories();
```

---

## 🎨 Component Templates

### Service Card
```tsx
{services?.map((service) => (
  <div key={service.slug}>
    <img src={getImageUrl(service.coverImage)} alt={service.title} />
    <h3>{service.title}</h3>
    <p>{service.shortDescription}</p>
  </div>
))}
```

### Project Card
```tsx
{projects?.map((project) => (
  <div key={project.slug}>
    <img src={getImageUrl(project.coverImage)} alt={project.title} />
    <h4>{project.title}</h4>
    <span>{project.category.data.attributes.title}</span>
  </div>
))}
```

### Gallery Grid
```tsx
{getGalleryImages(service.gallery).map((image) => (
  <img 
    key={image.id}
    src={getImageUrl({ data: image })} 
    alt={getImageAlt({ data: image })}
    loading="lazy"
  />
))}
```

---

## 📋 API Endpoints

| Collection | Endpoint | Populate |
|------------|----------|----------|
| Services | `/api/services` | `icon,coverImage,gallery` |
| Service by slug | `/api/services?filters[slug][$eq]=:slug` | `*` |
| Categories | `/api/project-categories` | - |
| Projects | `/api/projects` | `coverImage,gallery,category` |
| Featured Projects | `/api/projects?filters[isFeatured][$eq]=true` | `*` |
| Category Projects | `/api/projects?filters[category][slug][$eq]=:slug` | `*` |

---

## ⚡ Performance Tips

1. **Use pagination** for large datasets
2. **Enable lazy loading** for images
3. **Use appropriate stale times** (already configured in hooks)
4. **Optimize images** with srcset
5. **Cache aggressively** with React Query

---

## 🐛 Troubleshooting

### No data returned
- Check Strapi public permissions
- Verify API endpoint is correct
- Check browser console for CORS errors

### Images not loading
- Verify `VITE_STRAPI_URL` in `.env`
- Check Strapi upload folder permissions
- Verify image URLs in browser network tab

### TypeScript errors
- Ensure proper imports from `@/lib/strapi`
- Check null/undefined handling
- Use optional chaining: `service?.coverImage`

---

## 📚 Documentation

- **Full Setup Guide**: STRAPI-SCHEMAS.md
- **Integration Guide**: STRAPI-COLLECTIONS.md
- **Code Examples**: src/lib/strapi/examples.tsx
- **Type Definitions**: src/lib/strapi/types.ts
