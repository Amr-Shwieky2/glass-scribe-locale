import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/he/admin', '/en/admin', '/ar/admin', '/ru/admin', '/admin'],
      },
      // Explicitly allow all major AI crawlers for GEO (Generative Engine Optimization)
      { userAgent: 'GPTBot', allow: '/' },           // ChatGPT / OpenAI
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },        // Anthropic Claude
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },    // Perplexity AI
      { userAgent: 'Google-Extended', allow: '/' },  // Google Gemini / Bard
      { userAgent: 'Googlebot', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
      { userAgent: 'Meta-ExternalAgent', allow: '/' }, // Meta AI (Llama)
      { userAgent: 'YouBot', allow: '/' },           // You.com AI
      { userAgent: 'cohere-ai', allow: '/' },        // Cohere
      { userAgent: 'CCBot', allow: '/' },            // Common Crawl (training data)
    ],
    sitemap: 'https://www.shwakiglassworks.com/sitemap.xml',
    host: 'https://www.shwakiglassworks.com',
  };
}
