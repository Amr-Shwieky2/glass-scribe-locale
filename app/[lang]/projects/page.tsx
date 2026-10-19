import type { Metadata } from 'next';
import Projects from '@/views/Projects';
import { assertLocale } from '@/lib/i18n';
import { getAllImages } from '@/lib/cloudinary/server';
import { getCategoryFromPublicId, type CloudinaryImage } from '@/lib/cloudinary';
import { PROJECT_CATEGORIES, getLocalizedText, type SupportedLocale } from '@/data';
import { buildPageMetadata, getPageSeo, pageUrl } from '@/data/seo';
import { SERVICE_SEO_PAGES } from '@/data/service-seo-content';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = assertLocale((await params).lang);
  return buildPageMetadata(locale, '/projects', getPageSeo('projects', locale));
}

const IN_ISRAEL: Record<SupportedLocale, string> = { he: 'בישראל', en: 'in Israel', ar: 'في إسرائيل', ru: 'в Израиле' };

function categoryLabel(img: CloudinaryImage, locale: SupportedLocale): string {
  const folder = getCategoryFromPublicId(img.public_id);
  const match = folder ? PROJECT_CATEGORIES.find((c) => c.cloudinaryFolder === folder) : undefined;
  return match ? getLocalizedText(match.name, locale) : '';
}

function buildImageGallerySchema(locale: SupportedLocale, images: CloudinaryImage[]) {
  const seo = getPageSeo('projects', locale);
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: seo.title,
    description: seo.description,
    url: pageUrl(locale, '/projects'),
    inLanguage: locale,
    primaryImageOfPage: images.length > 0 ? {
      '@type': 'ImageObject',
      contentUrl: images[0].secure_url,
      description: images[0].context?.custom?.alt || `${categoryLabel(images[0], locale)} installation`,
    } : undefined,
    hasPart: images.slice(0, 15).map((img, idx) => ({
      '@type': 'ImageObject',
      contentUrl: img.secure_url,
      thumbnailUrl: img.secure_url.replace('/upload/', '/upload/c_fill,w_400,h_400/'),
      name: `${categoryLabel(img, locale)} ${idx + 1}`,
      description: img.context?.custom?.alt || `${categoryLabel(img, locale)} ${IN_ISRAEL[locale]}`,
      representativeOfPage: idx === 0,
    })),
  };
}

export default async function Page({ params }: Props) {
  const locale = assertLocale((await params).lang);
  const images = await getAllImages();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildImageGallerySchema(locale, images)) }} />
      <Projects
        locale={locale}
        images={images}
        serviceHrefByCategory={Object.fromEntries(SERVICE_SEO_PAGES.map((p) => [p.projectCategoryId, `/${locale}/${p.slug}`]))}
      />
    </>
  );
}
