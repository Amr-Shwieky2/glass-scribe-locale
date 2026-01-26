# Strapi Content-Type Schemas

Complete guide for setting up Content-Types in Strapi Content-Type Builder.

---

## 📋 Collection Types

### 1. Services

**Collection Name:** `service` (API ID: `service`)

#### Fields Configuration

| Field Name | Type | Settings |
|------------|------|----------|
| `title` | Text (Short text) | Required, Unique |
| `slug` | UID | Required, Attached to `title` |
| `shortDescription` | Text (Short text) | Required, Max 200 characters |
| `description` | Rich Text (Blocks) | Required |
| `icon` | Media (Single) | Required, Images only |
| `coverImage` | Media (Single) | Required, Images only |
| `gallery` | Media (Multiple) | Optional, Images only |
| `order` | Number (Integer) | Required, Default: 0 |
| `isActive` | Boolean | Required, Default: true |

#### Settings
- **Draft & Publish**: Enabled
- **Internationalization**: Enabled (if using i18n)
- **Default sort**: `order:asc`

#### Permissions (Public Role)
- ✅ `find` (List all services)
- ✅ `findOne` (Get single service)
- ❌ `create`, `update`, `delete` (Admin only)

---

### 2. Project Categories

**Collection Name:** `project-category` (API ID: `project-category`)

#### Fields Configuration

| Field Name | Type | Settings |
|------------|------|----------|
| `title` | Text (Short text) | Required, Unique |
| `slug` | UID | Required, Attached to `title` |
| `order` | Number (Integer) | Required, Default: 0 |

#### Settings
- **Draft & Publish**: Enabled
- **Internationalization**: Enabled (if using i18n)
- **Default sort**: `order:asc`

#### Permissions (Public Role)
- ✅ `find` (List all categories)
- ✅ `findOne` (Get single category)
- ❌ `create`, `update`, `delete` (Admin only)

---

### 3. Projects

**Collection Name:** `project` (API ID: `project`)

#### Fields Configuration

| Field Name | Type | Settings |
|------------|------|----------|
| `title` | Text (Short text) | Required |
| `slug` | UID | Required, Attached to `title` |
| `description` | Rich Text (Blocks) | Required |
| `coverImage` | Media (Single) | Required, Images only |
| `gallery` | Media (Multiple) | Required, Images only, Min: 1 |
| `category` | Relation | Many-to-One with `project-category` |
| `isFeatured` | Boolean | Required, Default: false |

#### Relation Details
- **Type**: Many (Projects) to One (Project Category)
- **Field name on project**: `category`
- **Field name on project-category**: `projects`

#### Settings
- **Draft & Publish**: Enabled
- **Internationalization**: Enabled (if using i18n)
- **Default sort**: `createdAt:desc`

#### Permissions (Public Role)
- ✅ `find` (List all projects)
- ✅ `findOne` (Get single project)
- ❌ `create`, `update`, `delete` (Admin only)

---

## 🎯 API Endpoints

After creating the collections, the following endpoints will be available:

### Services
```http
GET /api/services
GET /api/services/:id
GET /api/services?filters[slug][$eq]=:slug
GET /api/services?filters[isActive][$eq]=true
GET /api/services?populate=icon,coverImage,gallery
```

### Project Categories
```http
GET /api/project-categories
GET /api/project-categories/:id
GET /api/project-categories?filters[slug][$eq]=:slug
```

### Projects
```http
GET /api/projects
GET /api/projects/:id
GET /api/projects?filters[slug][$eq]=:slug
GET /api/projects?filters[isFeatured][$eq]=true
GET /api/projects?filters[category][slug][$eq]=:categorySlug
GET /api/projects?populate=coverImage,gallery,category
GET /api/projects?pagination[page]=1&pagination[pageSize]=50
```

---

## 🔐 Permissions Setup

### Public Role Permissions

Navigate to **Settings → Roles → Public** and enable:

#### Services
- ✅ find
- ✅ findOne

#### Project Categories
- ✅ find
- ✅ findOne

#### Projects
- ✅ find
- ✅ findOne

#### Upload (for media access)
- ✅ find
- ✅ findOne

### Authenticated Role (Optional)
Same as Public unless you need user-specific features.

---

## 📦 Media Library Settings

### Optimization for Large Galleries

1. **Enable responsive formats** (Settings → Media Library):
   - Thumbnail: 245×156
   - Small: 500×500
   - Medium: 750×750
   - Large: 1000×1000

2. **Upload limits** (config):
   ```js
   // config/plugins.js
   module.exports = {
     upload: {
       config: {
         sizeLimit: 10 * 1024 * 1024, // 10MB
         breakpoints: {
           xlarge: 1920,
           large: 1000,
           medium: 750,
           small: 500,
           xsmall: 64
         }
       }
     }
   };
   ```

3. **CDN recommendations**:
   - Use Cloudinary, AWS S3, or similar for production
   - Enable automatic format conversion (WebP/AVIF)
   - Implement lazy loading on frontend

---

## 🧪 Testing Your Setup

### 1. Create Test Data

**Services:**
1. Create 3-5 services
2. Set different `order` values
3. Mark at least 2 as `isActive: true`
4. Upload icon and cover images

**Project Categories:**
1. Create 3-4 categories (e.g., "Residential", "Commercial", "Custom")
2. Set sequential `order` values

**Projects:**
1. Create 8-10 projects
2. Assign different categories
3. Mark 3-4 as `isFeatured: true`
4. Upload multiple gallery images (5-10 per project)

### 2. Test API Endpoints

```bash
# Test services endpoint
curl http://localhost:1337/api/services?populate=*

# Test projects endpoint with filtering
curl http://localhost:1337/api/projects?filters[isFeatured][$eq]=true&populate=*

# Test project categories
curl http://localhost:1337/api/project-categories
```

### 3. Verify Permissions

Try accessing endpoints without authentication. All should return data (not 403 Forbidden).

---

## 🎨 Frontend Integration Examples

### Example: Using Services Hook

```tsx
import { useServices, getStrapiImageUrl } from '@/lib/strapi';

function ServicesPage() {
  const { data: services, isLoading, error } = useServices();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading services</div>;

  return (
    <div className="grid grid-cols-3 gap-6">
      {services?.map((service) => (
        <div key={service.slug}>
          <img 
            src={getStrapiImageUrl(service.coverImage.data.attributes.url)} 
            alt={service.title}
          />
          <h3>{service.title}</h3>
          <p>{service.shortDescription}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example: Featured Projects

```tsx
import { useFeaturedProjects, getStrapiImageUrl } from '@/lib/strapi';

function FeaturedProjects() {
  const { data: projects } = useFeaturedProjects(6);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {projects?.map((project) => (
        <div key={project.slug}>
          <img 
            src={getStrapiImageUrl(project.coverImage.data.attributes.url)} 
            alt={project.title}
          />
          <h4>{project.title}</h4>
          <span>{project.category.data.attributes.title}</span>
        </div>
      ))}
    </div>
  );
}
```

### Example: Projects by Category

```tsx
import { useProjectsByCategory, getStrapiImageUrl } from '@/lib/strapi';

function CategoryProjects({ categorySlug }: { categorySlug: string }) {
  const { data: projects } = useProjectsByCategory(categorySlug);

  return (
    <div className="masonry-grid">
      {projects?.map((project) => (
        <div key={project.slug}>
          {project.gallery.data.map((image) => (
            <img 
              key={image.id}
              src={getStrapiImageUrl(image.attributes.url)} 
              alt={image.attributes.alternativeText || project.title}
              loading="lazy"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
```

---

## 🚀 Production Checklist

- [ ] All content types created with correct fields
- [ ] Public permissions enabled for `find` and `findOne`
- [ ] Upload plugin permissions enabled
- [ ] Media library optimized for responsive images
- [ ] Test data created and verified
- [ ] API endpoints tested and returning correct data
- [ ] Frontend integration tested
- [ ] CDN configured for media (recommended)
- [ ] Environment variables set correctly
- [ ] CORS configured for your domain

---

## 📚 Related Documentation

- [Strapi Content-Type Builder](https://docs.strapi.io/dev-docs/backend-customization/models)
- [Strapi Media Library](https://docs.strapi.io/user-docs/media-library)
- [Strapi REST API](https://docs.strapi.io/dev-docs/api/rest)
- [Frontend Integration Guide](./STRAPI-INTEGRATION.md)

---

**Next Steps:** After setting up these schemas, proceed to create sample content and test the frontend integration.
