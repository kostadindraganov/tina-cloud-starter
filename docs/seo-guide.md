# SEO Guide for Gamblementor

This guide explains how to use and customize the SEO features in your Gamblementor project.

## Overview

The project includes the following SEO features:

1. **Metadata**: Comprehensive metadata for all pages
2. **Sitemap**: Automatically generated sitemap.xml
3. **Robots.txt**: Customizable robots.txt file
4. **Open Graph & Twitter Cards**: Social media preview images
5. **Google Search Console**: Verification setup

## Configuration

### Base URL

Set your site's URL in the `.env` file:

```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

This URL is used for generating absolute URLs in the sitemap, metadata, and social media cards.

### Metadata

The default metadata is set in `app/layout.tsx`. You can customize:

- Site title and description
- Default OG and Twitter images
- Keywords
- Author information
- Google site verification

For dynamic pages like blog posts, metadata is generated in the page's `generateMetadata` function.

### Sitemap

The sitemap is automatically generated from your TinaCMS content in `app/sitemap.ts`. It includes:

- All posts
- All pages
- Static routes

The sitemap is accessible at `/sitemap.xml`.

### Robots.txt

The robots.txt file is defined in `app/robots.ts`. You can customize:

- User agent rules
- Allowed/disallowed paths
- Sitemap location

The robots.txt is accessible at `/robots.txt`.

### Open Graph & Twitter Cards

Default images are stored in:
- `/public/images/og-image.jpg` (1200×630px)
- `/public/images/twitter-image.jpg` (1200×600px)

#### Creating Images

There are two ways to generate these images:

1. **HTML Templates (Recommended)**:
   ```bash
   pnpm generate-og
   ```
   This creates HTML templates in `/public/images/` that you can open in your browser, take a screenshot of, and save as the appropriate image files.

2. **Static Placeholders**:
   ```bash
   pnpm generate-og:static
   ```
   This creates minimal 1×1 transparent PNG files as placeholders to prevent errors. You'll still need to replace these with actual images later.

#### Customization

You can customize the images by editing the configuration in:
- `scripts/generate-og-images.js` (for HTML templates)
- `scripts/create-static-og-images.js` (for static placeholders)

### Google Search Console

To verify your site with Google Search Console:

1. Get your verification code from Google Search Console
2. Update the verification code in:
   - `app/layout.tsx` (in the metadata.verification.google field)
   - `public/google-site-verification.html`

## Testing

You can test your SEO implementation with:

1. [Google's Rich Results Test](https://search.google.com/test/rich-results)
2. [Facebook's Sharing Debugger](https://developers.facebook.com/tools/debug/)
3. [Twitter Card Validator](https://cards-dev.twitter.com/validator)
4. [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

## Best Practices

1. **Unique Titles**: Each page should have a unique, descriptive title
2. **Meta Descriptions**: Write compelling descriptions under 160 characters
3. **Structured Data**: Add structured data for rich results
4. **Image Optimization**: Use Next.js Image component for optimized images
5. **Performance**: Monitor Core Web Vitals in Google Search Console 