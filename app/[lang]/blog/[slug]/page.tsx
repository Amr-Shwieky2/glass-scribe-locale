import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPost from '@/views/BlogPost';
import { assertLocale, LOCALES } from '@/lib/i18n';
import { BLOG_POSTS, getLocalizedText } from '@/data';
import { BLOG_BRAND, buildPageMetadata } from '@/data/seo';

type Props = { params: Promise<{ lang: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => BLOG_POSTS.map((post) => ({ lang, slug: post.slug })));
}

function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = assertLocale(lang);
  const post = getPost(slug);
  if (!post) notFound();

  const publishedTime = new Date(post.date).toISOString();
  return buildPageMetadata(
    locale,
    `/blog/${post.slug}`,
    {
      title: `${getLocalizedText(post.title, locale)} | ${BLOG_BRAND[locale]}`,
      description: getLocalizedText(post.excerpt, locale),
    },
    { type: 'article', publishedTime }
  );
}

export default async function Page({ params }: Props) {
  const { lang, slug } = await params;
  const locale = assertLocale(lang);
  const post = getPost(slug);
  if (!post) notFound();
  return <BlogPost locale={locale} post={post} />;
}
