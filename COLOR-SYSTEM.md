# Shwaki Glassworks - Color System Documentation

## Brand Colors

### Primary Colors
- **White**: `#FFFFFF` - Main background color
- **Light Gray**: `#F2F2F2` - Secondary background, subtle sections
- **Charcoal**: `#2B2B2B` - Primary text, dark backgrounds
- **Gold/Bronze**: `#B08D57` - Accent color for CTAs, highlights, active states

## CSS Variable Mapping

All colors are centralized in `/src/index.css` using CSS variables:

```css
--background: 0 0% 100%;        /* #FFFFFF - White */
--foreground: 0 0% 17%;          /* #2B2B2B - Charcoal */
--primary: 0 0% 17%;             /* #2B2B2B - Charcoal */
--secondary: 0 0% 95%;           /* #F2F2F2 - Light Gray */
--accent: 38 35% 52%;            /* #B08D57 - Gold */
--border: 0 0% 90%;              /* #E5E5E5 - Light border */
```

## Usage Guide

### Tailwind Classes (Recommended)
Use these pre-defined Tailwind classes that automatically use the CSS variables:

**Backgrounds:**
- `bg-white` or `bg-background` - White background
- `bg-secondary` - Light gray background
- `bg-primary` - Charcoal background
- `bg-accent` - Gold background

**Text:**
- `text-foreground` - Charcoal text (default)
- `text-muted-foreground` - Lighter gray text
- `text-accent` - Gold text
- `text-white` - White text

**Borders:**
- `border-border` - Standard border color
- `border-accent` - Gold border

**Buttons:**
- `bg-primary text-primary-foreground` - Charcoal button
- `bg-accent text-white` - Gold button
- `border border-primary` - Outline button

### Component Examples

#### Hero Section
```tsx
<div className="bg-white text-foreground">
  <h1 className="text-foreground">Shwaki Glassworks</h1>
  <Button className="bg-accent text-white hover:bg-accent/90">
    Get Quote
  </Button>
</div>
```

#### Card with Accent
```tsx
<Card className="bg-white border-border">
  <CardContent>
    <div className="flex items-center gap-2">
      <Star className="text-accent" />
      <span className="text-foreground">Featured</span>
    </div>
  </CardContent>
</Card>
```

#### Active Navigation
```tsx
<Link 
  className={isActive 
    ? 'text-accent' 
    : 'text-foreground/80 hover:text-foreground'
  }
>
  Services
</Link>
```

## Color Roles

### White (#FFFFFF)
- **Use for**: Main backgrounds, cards, clean surfaces
- **Avoid**: Text on light backgrounds (use charcoal instead)

### Light Gray (#F2F2F2)
- **Use for**: Alternate section backgrounds, subtle separators
- **Avoid**: Large text blocks (can reduce readability)

### Charcoal (#2B2B2B)
- **Use for**: Primary text, headings, dark backgrounds
- **Avoid**: Overuse in backgrounds (maintain white primary)

### Gold/Bronze (#B08D57)
- **Use for**: 
  - Call-to-action buttons
  - Active navigation states
  - Icons and highlights
  - Hover states
  - Important badges
- **Avoid**: 
  - Body text (poor readability)
  - Overuse (should be accent only, ~10-15% of design)

## Design Principles

1. **White as Primary**: Most of the website should have white backgrounds
2. **Charcoal for Text**: Use charcoal for all primary text for maximum readability
3. **Gold Sparingly**: Use gold only for accents, CTAs, and highlights
4. **Light Gray Transitions**: Use light gray to create visual separation without harsh contrasts
5. **No Gradients**: Keep it clean and professional - solid colors only
6. **Subtle Shadows**: Use minimal shadows (0 2px 8px rgba(0,0,0,0.06))

## Migration Checklist

✅ Updated hero sections from dark to white
✅ Changed blue/purple accents to gold
✅ Updated Header background to white
✅ Fixed navigation colors for light background
✅ Updated form inputs to white backgrounds
✅ Changed card backgrounds from dark slate to white
✅ Updated all button colors to brand palette
✅ Fixed mobile menu colors
✅ Updated active states to use gold

## Testing Checklist

- [ ] All pages load with correct colors
- [ ] Header is readable on white background
- [ ] Navigation active states show gold
- [ ] Buttons use charcoal or gold
- [ ] Forms have white backgrounds with visible borders
- [ ] Mobile menu displays correctly
- [ ] All text is readable (sufficient contrast)
- [ ] No blue, purple, or cyan colors remain
- [ ] Hover states work correctly
- [ ] Dark mode (if needed) maintains brand colors

## Future Additions

If you need to add new colors, follow this process:

1. Add to `/src/index.css` CSS variables
2. Document in `/src/constants/colors.ts`
3. Update Tailwind config if needed
4. Update this documentation
5. Ensure it follows brand guidelines (professional, minimal, clean)

## Contact

For questions about color usage, refer to the brand guidelines or contact the design team.
