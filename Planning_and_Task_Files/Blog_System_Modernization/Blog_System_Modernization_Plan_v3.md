 # Blog System Enhancement Roll‑Out Plan

## Incremental Migration to Build‑Time Markdown, SEO Hardening, and Asset Control

---

## Executive Summary

The current blog delivers solid performance, but it lacks structured author data, local branding control over images, and modern SEO features. Bob’s original markdown‑at‑runtime proposal would break Vite builds and slow pages. The senior review recommends gradual change that keeps today’s static HTML strengths while layering improvements. As VP of Development, I endorse a hybrid approach that locks in quick SEO wins, centralizes data, and introduces build‑time markdown so we avoid runtime penalties.

---

## Technical Analysis

### Current Strengths to Preserve

* Static HTML renders instantly and indexes well.
* TypeScript interfaces are clear.
* React Router slugs already yield clean URLs.
* Lazy loading and basic Open Graph tags exist.&#x20;

### Critical Gaps

1. No dynamic meta tags or JSON‑LD.&#x20;
2. Author data scattered and shallow.&#x20;
3. Unsplash images risk branding drift and CDN reliance.&#x20;
4. Bob’s runtime markdown import will fail on Vercel and add fifty‑seven kilobytes to the bundle.

---

## Modernization Strategy

### Phase Matrix

| Phase | Goal                      | Key Deliverables                                                                   | Time     |
| ----- | ------------------------- | ---------------------------------------------------------------------------------- | -------- |
| 0     | Baseline & Backup         | Performance, SEO, and visual snapshots                                             | 1 h      |
| 1     | SEO Foundation            | Dynamic titles, descriptions, canonical tags, JSON‑LD, automatic sitemap           | 3 h      |
| 2     | Author System             | `authors.ts`, rich bios, optional social links, backward compatible interfaces     | 2 h      |
| 3     | Local Images              | Headers and avatars in `public/blog/images`, lossless compression, WebP conversion | 3 h      |
| 4     | Build‑Time Markdown Pilot | MD loader in Vite plugin, convert one new post, keep HTML fallback                 | 4 h      |
| 5     | Gradual Content Migration | Convert legacy posts as bandwidth allows, maintain parity tests                    | variable |
| 6     | Governance & Monitoring   | Docs, Lighthouse audits, bundle tracking, rollback script                          | 2 h      |

---

## Implementation Plan

### Pre‑Implementation Checklist

* Create feature branch `feature/blog‑enhancement`.
* Copy `src/data/blog` to `backup/blog_html`.
* Record Lighthouse score and Core Web Vitals.

### Phase 0: Baseline and Backup (1 hour)

1. Snapshot HTML output of nine existing articles.
2. Capture Google PageSpeed metrics.
3. Record current sitemap and robots entries.

### Phase 1: SEO Foundation (3 hours)

1. Install `react‑helmet‑async`.
2. Extend `BlogPost` to include `seoTitle`, `metaDescription`, `updatedAt`, `excerpt`.&#x20;
3. Inject dynamic head tags in `Article.tsx`.
4. Generate JSON‑LD Article schema.
5. Create build step that regenerates `sitemap.xml` from article metadata.
6. Add canonical link tag using site origin and slug.

### Phase 2: Central Author System (2 hours)

1. Add `src/data/blog/authors.ts` per senior plan, keeping original `author` object for backward compatibility.&#x20;
2. Refactor cards to pull avatar, bio, and social handles from new record.
3. Implement graceful fallback when extended data is missing.

### Phase 3: Local Image Management (3 hours)

1. Create directories `public/blog/images/headers`, `public/blog/images/authors`.
2. Move header assets for all posts, convert to WebP, keep filename slug‑header.webp.
3. Update metadata paths.
4. Add `next‑image‑export‑optimizer` or similar Vite plugin for responsive images.
5. Remove Unsplash URLs after verification.&#x20;

### Phase 4: Build‑Time Markdown Pilot (4 hours)

1. Install `@mdx-js/vite` as dev dependency, not in client bundle.&#x20;
2. Add Vite plugin that converts `.mdx` to static HTML at build.
3. Create `src/content/blog/hello‑mdx.mdx` and map it in `articles.ts` with flag `format:"mdx"`.
4. Update `Article.tsx` to branch: if `format==="mdx"` then render static HTML import, else render existing HTML string.
5. Verify that Vercel build passes and bundle size stays within ten percent baseline.

### Phase 5: Gradual Migration (ongoing)

* Convert two legacy posts per sprint.
* Keep parity snapshot tests to ensure visual match.
* Retire HTML string once one hundred percent migrated.

### Phase 6: Governance and Monitoring (2 hours)

1. Add docs for content authors covering MDX template, image sizing, SEO checklist.
2. Automate Lighthouse CI via GitHub Actions.
3. Include rollback script that swaps `articles_html.ts` back into build.&#x20;

---

## Success Metrics

* CLS, LCP, and FID equal or better than baseline.
* Dynamic meta tags present on every article.
* Bundle size delta less than ten percent.
* All author bios display correctly.
* No broken images or 404 routes.

---

## Risk Mitigation

* Runtime markdown parsing is avoided entirely, eliminating guaranteed Vite failure.&#x20;
* Fallback to original HTML keeps site operational if MDX build plugin misbehaves.
* Rollback script assures five minute recovery window.
* Monitoring catches image weight regressions after local asset migration.

---

## Timeline

Total core effort eight to twelve developer hours spread across one week:

* Day 1 morning: Phases 0 and 1.
* Day 1 afternoon: Phase 2.
* Day 2 morning: Phase 3.
* Day 2 afternoon: Phase 4 and first MDX post.
* Remaining sprint: Phase 5 migrations and Phase 6 docs.

---

## Conclusion

This plan secures immediate SEO gains, enriches author credibility, brings image branding under our control, and sets a safe foundation for markdown driven content without sacrificing performance or stability.
