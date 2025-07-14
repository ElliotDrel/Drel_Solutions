# Unused Code Analysis

## Analysis Progress
- [x] Analyzed project structure and identified all source files
- [x] Checked for unused files by analyzing imports and references
- [x] Identified unused components and functions within files
- [ ] Analyzed package.json dependencies against actual imports
- [ ] Checked for obsolete configuration files
- [ ] Looked for duplicate or redundant files
- [ ] Identified legacy code and outdated implementations

## Found Unused Components and Files

### Blog Components - UNUSED
1. **`src/components/blog/NewsletterCard.tsx`** - UNUSED
   - Reason: Not imported anywhere, StayUpdatedSection has its own implementation
   - Safe to delete: Yes

2. **`src/components/blog/ProgressTab.tsx`** - UNUSED  
   - Reason: Not imported or referenced anywhere
   - Safe to delete: Yes

### UI Components - UNUSED
The following UI components are not imported anywhere and can be safely deleted:

1. **`src/components/ui/accordion.tsx`** - UNUSED
2. **`src/components/ui/alert-dialog.tsx`** - UNUSED
3. **`src/components/ui/alert.tsx`** - UNUSED  
4. **`src/components/ui/aspect-ratio.tsx`** - UNUSED
5. **`src/components/ui/avatar.tsx`** - UNUSED
6. **`src/components/ui/breadcrumb.tsx`** - UNUSED
7. **`src/components/ui/calendar.tsx`** - UNUSED
8. **`src/components/ui/carousel.tsx`** - UNUSED
9. **`src/components/ui/chart.tsx`** - UNUSED
10. **`src/components/ui/checkbox.tsx`** - UNUSED
11. **`src/components/ui/collapsible.tsx`** - UNUSED
12. **`src/components/ui/command.tsx`** - UNUSED
13. **`src/components/ui/context-menu.tsx`** - UNUSED
14. **`src/components/ui/dialog.tsx`** - UNUSED
15. **`src/components/ui/drawer.tsx`** - UNUSED
16. **`src/components/ui/dropdown-menu.tsx`** - UNUSED
17. **`src/components/ui/form.tsx`** - UNUSED
18. **`src/components/ui/hover-card.tsx`** - UNUSED
19. **`src/components/ui/input-otp.tsx`** - UNUSED
20. **`src/components/ui/menubar.tsx`** - UNUSED
21. **`src/components/ui/navigation-menu.tsx`** - UNUSED
22. **`src/components/ui/pagination.tsx`** - UNUSED
23. **`src/components/ui/popover.tsx`** - UNUSED
24. **`src/components/ui/progress.tsx`** - UNUSED
25. **`src/components/ui/radio-group.tsx`** - UNUSED
26. **`src/components/ui/resizable.tsx`** - UNUSED
27. **`src/components/ui/scroll-area.tsx`** - UNUSED
28. **`src/components/ui/select.tsx`** - UNUSED
29. **`src/components/ui/separator.tsx`** - UNUSED
30. **`src/components/ui/sheet.tsx`** - UNUSED
31. **`src/components/ui/sidebar.tsx`** - UNUSED
32. **`src/components/ui/skeleton.tsx`** - UNUSED
33. **`src/components/ui/slider.tsx`** - UNUSED
34. **`src/components/ui/switch.tsx`** - UNUSED
35. **`src/components/ui/table.tsx`** - UNUSED
36. **`src/components/ui/tabs.tsx`** - UNUSED
37. **`src/components/ui/toggle-group.tsx`** - UNUSED
38. **`src/components/ui/toggle.tsx`** - UNUSED

### Component - USED (Previously incorrectly marked as unused)
1. **`src/components/ThemeToggle.tsx`** - USED
   - Reason: Imported and used by Navigation.tsx on line 7 (import) and line 77 (usage)
   - Safe to delete: NO - This component is actively used

### Empty Directories - UNUSED
1. **`src/theme/`** - Empty directory
2. **`src/content/blog/authors/`** - Empty directory  
3. **`src/types/blog/`** - Empty directory

## Components Currently In Use

### Blog Components - USED
- `src/components/blog/ArticleCard.tsx` - Used by PostGrid and RecommendedArticles
- `src/components/blog/ArticleProgress.tsx` - Used by Article page
- `src/components/blog/BlogHero.tsx` - Used by Blog page
- `src/components/blog/BrowseControls.tsx` - Used by Blog page
- `src/components/blog/FeaturedPost.tsx` - Used by Blog page
- `src/components/blog/PostGrid.tsx` - Used by Blog page
- `src/components/blog/RecommendedArticles.tsx` - Used by Article page
- `src/components/blog/StayUpdatedSection.tsx` - Used by Article page
- `src/components/blog/TagSort.tsx` - Used by Blog page

### UI Components - USED
- `src/components/ui/badge.tsx` - Used by multiple components
- `src/components/ui/button.tsx` - Used by multiple components  
- `src/components/ui/card.tsx` - Used by multiple components
- `src/components/ui/input.tsx` - Used by Contact, ModelAdvisor, StayUpdatedSection
- `src/components/ui/label.tsx` - Used by Contact page
- `src/components/ui/sonner.tsx` - Used by App.tsx
- `src/components/ui/textarea.tsx` - Used by Contact and ModelAdvisor
- `src/components/ui/toast.tsx` - Used by use-toast hook
- `src/components/ui/toaster.tsx` - Used by App.tsx
- `src/components/ui/tooltip.tsx` - Used by App.tsx
- `src/components/ui/use-toast.ts` - Used by use-toast hook

### Core Components - USED
- `src/components/Layout.tsx` - Used by App.tsx
- `src/components/MobileMenu.tsx` - Used by Navigation.tsx
- `src/components/Navigation.tsx` - Used by Layout.tsx
- `src/components/TrackedLink.tsx` - Used by Navigation.tsx

### Custom UI Component - USED
- `src/components/ui/DropdownMenu.tsx` - Used by BrowseControls

## Unused Dependencies Analysis

### Dependencies NOT Used in Source Code - CAN BE REMOVED:
1. **`@hookform/resolvers`** - Form validation resolvers, not used
2. **`axios`** - HTTP client, not used (fetch is used instead)
3. **`date-fns`** - Date utilities, not used
4. **`zod`** - Schema validation, not used

### Dependencies Used Only in Unused Components - CAN BE REMOVED:
1. **`@radix-ui/react-accordion`** - Used only in unused accordion.tsx
2. **`@radix-ui/react-alert-dialog`** - Used only in unused alert-dialog.tsx
3. **`@radix-ui/react-aspect-ratio`** - Used only in unused aspect-ratio.tsx
4. **`@radix-ui/react-avatar`** - Used only in unused avatar.tsx
5. **`@radix-ui/react-checkbox`** - Used only in unused checkbox.tsx
6. **`@radix-ui/react-collapsible`** - Used only in unused collapsible.tsx
7. **`@radix-ui/react-context-menu`** - Used only in unused context-menu.tsx
8. **`@radix-ui/react-dialog`** - Used only in unused dialog.tsx, sheet.tsx, and command.tsx
9. **`@radix-ui/react-dropdown-menu`** - Used only in unused dropdown-menu.tsx
10. **`@radix-ui/react-hover-card`** - Used only in unused hover-card.tsx
11. **`@radix-ui/react-menubar`** - Used only in unused menubar.tsx
12. **`@radix-ui/react-navigation-menu`** - Used only in unused navigation-menu.tsx
13. **`@radix-ui/react-popover`** - Used only in unused popover.tsx
14. **`@radix-ui/react-progress`** - Used only in unused progress.tsx
15. **`@radix-ui/react-radio-group`** - Used only in unused radio-group.tsx
16. **`@radix-ui/react-scroll-area`** - Used only in unused scroll-area.tsx
17. **`@radix-ui/react-select`** - Used only in unused select.tsx
18. **`@radix-ui/react-separator`** - Used only in unused separator.tsx
19. **`@radix-ui/react-slider`** - Used only in unused slider.tsx
20. **`@radix-ui/react-switch`** - Used only in unused switch.tsx
21. **`@radix-ui/react-tabs`** - Used only in unused tabs.tsx
22. **`@radix-ui/react-toggle`** - Used only in unused toggle.tsx
23. **`@radix-ui/react-toggle-group`** - Used only in unused toggle-group.tsx
24. **`cmdk`** - Used only in unused command.tsx
25. **`embla-carousel-react`** - Used only in unused carousel.tsx
26. **`input-otp`** - Used only in unused input-otp.tsx
27. **`react-day-picker`** - Used only in unused calendar.tsx
28. **`react-hook-form`** - Used only in unused form.tsx
29. **`react-resizable-panels`** - Used only in unused resizable.tsx
30. **`recharts`** - Used only in unused chart.tsx
31. **`vaul`** - Used only in unused drawer.tsx

### Dependencies Currently Used - KEEP:
- **`@radix-ui/react-label`** - Used by label.tsx and form.tsx
- **`@radix-ui/react-slot`** - Used by button.tsx, breadcrumb.tsx, form.tsx, sidebar.tsx
- **`@radix-ui/react-toast`** - Used by toast.tsx
- **`@radix-ui/react-tooltip`** - Used by tooltip.tsx
- **`@tanstack/react-query`** - Used by App.tsx
- **`@vercel/analytics`** - Used by App.tsx
- **`@vercel/speed-insights`** - Used by main.tsx
- **`class-variance-authority`** - Used by button.tsx and other components
- **`clsx`** - Used by utils.ts
- **`lucide-react`** - Used by multiple components for icons
- **`next-themes`** - Used by sonner.tsx
- **`react`** - Core dependency
- **`react-dom`** - Core dependency
- **`react-router-dom`** - Used by App.tsx and pages
- **`sonner`** - Used by sonner.tsx
- **`tailwind-merge`** - Used by utils.ts
- **`tailwindcss-animate`** - Used by Tailwind config

## Legacy Code and Duplicates Found

### Entire Backend Folder - LEGACY/DUPLICATE:
- **`backend/`** directory contains old FastAPI code that's superseded by Vercel serverless functions
- **`backend/main.py`** - Contains old FastAPI application (superseded by `api/model_search.py`)
- **`backend/requirements.txt`** - Empty file for old backend
- **`backend/services/openai_service.py`** - Duplicate of `api/services/openai_service.py`
- **`backend/services/__init__.py`** - Not needed
- **`backend/__init__.py`** - Not needed

### Package.json Scripts - LEGACY:
- **`start:backend`** - Script for old backend
- **`start:full`** - Script for old backend + frontend
- **`concurrently`** dependency not in package.json but referenced in removed script

### Other Files - LEGACY:
- **`zfull_start.bat`** - Empty batch file for old backend startup
- **`requirements.txt`** - Root requirements file for old FastAPI backend

## Obsolete Configuration Files

### Backup Files - OBSOLETE:
- **`tailwind.config.ts.backup`** - Backup of old Tailwind config, can be deleted

## Summary - Files Safe to Delete

### **TOTAL: 48 Files + 1 Directory + 35 Dependencies**

### Files (48 total):
1. `src/components/blog/NewsletterCard.tsx`
2. `src/components/blog/ProgressTab.tsx`
3. `src/components/ui/accordion.tsx`
4. `src/components/ui/alert-dialog.tsx`
5. `src/components/ui/alert.tsx`
6. `src/components/ui/aspect-ratio.tsx`
7. `src/components/ui/avatar.tsx`
8. `src/components/ui/breadcrumb.tsx`
9. `src/components/ui/calendar.tsx`
10. `src/components/ui/carousel.tsx`
11. `src/components/ui/chart.tsx`
12. `src/components/ui/checkbox.tsx`
13. `src/components/ui/collapsible.tsx`
14. `src/components/ui/command.tsx`
15. `src/components/ui/context-menu.tsx`
16. `src/components/ui/dialog.tsx`
17. `src/components/ui/drawer.tsx`
18. `src/components/ui/dropdown-menu.tsx`
19. `src/components/ui/form.tsx`
20. `src/components/ui/hover-card.tsx`
21. `src/components/ui/input-otp.tsx`
22. `src/components/ui/menubar.tsx`
23. `src/components/ui/navigation-menu.tsx`
24. `src/components/ui/pagination.tsx`
25. `src/components/ui/popover.tsx`
26. `src/components/ui/progress.tsx`
27. `src/components/ui/radio-group.tsx`
28. `src/components/ui/resizable.tsx`
29. `src/components/ui/scroll-area.tsx`
30. `src/components/ui/select.tsx`
31. `src/components/ui/separator.tsx`
32. `src/components/ui/sheet.tsx`
33. `src/components/ui/sidebar.tsx`
34. `src/components/ui/skeleton.tsx`
35. `src/components/ui/slider.tsx`
36. `src/components/ui/switch.tsx`
37. `src/components/ui/table.tsx`
38. `src/components/ui/tabs.tsx`
39. `src/components/ui/toggle-group.tsx`
40. `src/components/ui/toggle.tsx`
41. `backend/main.py`
42. `backend/requirements.txt`
43. `backend/services/openai_service.py`
44. `backend/services/__init__.py`
45. `backend/__init__.py`
46. `zfull_start.bat`
47. `requirements.txt`
48. `tailwind.config.ts.backup`

### Directory (1 total):
- `backend/` - Entire directory

### Dependencies (35 total):
1. `@hookform/resolvers`
2. `@radix-ui/react-accordion`
3. `@radix-ui/react-alert-dialog`
4. `@radix-ui/react-aspect-ratio`
5. `@radix-ui/react-avatar`
6. `@radix-ui/react-checkbox`
7. `@radix-ui/react-collapsible`
8. `@radix-ui/react-context-menu`
9. `@radix-ui/react-dialog`
10. `@radix-ui/react-dropdown-menu`
11. `@radix-ui/react-hover-card`
12. `@radix-ui/react-menubar`
13. `@radix-ui/react-navigation-menu`
14. `@radix-ui/react-popover`
15. `@radix-ui/react-progress`
16. `@radix-ui/react-radio-group`
17. `@radix-ui/react-scroll-area`
18. `@radix-ui/react-select`
19. `@radix-ui/react-separator`
20. `@radix-ui/react-slider`
21. `@radix-ui/react-switch`
22. `@radix-ui/react-tabs`
23. `@radix-ui/react-toggle`
24. `@radix-ui/react-toggle-group`
25. `axios`
26. `cmdk`
27. `date-fns`
28. `embla-carousel-react`
29. `input-otp`
30. `react-day-picker`
31. `react-hook-form`
32. `react-resizable-panels`
33. `recharts`
34. `vaul`
35. `zod`

### Package.json Scripts to Remove (2 total):
1. `start:backend`
2. `start:full`

### Empty Directories to Clean (3 total):
1. `src/theme/`
2. `src/content/blog/authors/`
3. `src/types/blog/`

## Final Analysis Complete
- [x] Analyzed project structure and identified all source files
- [x] Checked for unused files by analyzing imports and references
- [x] Identified unused components and functions within files
- [x] Analyzed package.json dependencies against actual imports
- [x] Checked for obsolete configuration files
- [x] Looked for duplicate or redundant files
- [x] Identified legacy code and outdated implementations
- [x] **VERIFICATION COMPLETE** - Double-checked analysis and corrected errors

## Verification Notes (Updated Analysis)

### Corrections Made:
1. **CORRECTED: `src/components/ThemeToggle.tsx`** - Originally marked as UNUSED, but is actually USED by Navigation.tsx
   - Import: `src/components/Navigation.tsx:7`
   - Usage: `src/components/Navigation.tsx:77`
   - **Result: REMOVED from deletion list**

2. **CORRECTED: `@radix-ui/react-dialog` dependency** - Originally marked as KEEP, but is actually unused
   - Only used by: dialog.tsx, sheet.tsx, and command.tsx (all unused)
   - **Result: MOVED to unused dependencies list**

3. **CORRECTED: `@radix-ui/react-dropdown-menu` dependency** - Originally marked as KEEP, but is actually unused
   - Only used by: dropdown-menu.tsx (which is unused)
   - **Result: MOVED to unused dependencies list**

### Final Verified Counts:
- **Files to delete: 48** (down from 49, removed ThemeToggle.tsx)
- **Dependencies to remove: 35** (up from 33, added react-dialog and react-dropdown-menu)
- **Directories to delete: 1** (backend/)

### Verification Process:
- Used grep to search for actual imports and usage across all TypeScript/JavaScript files
- Verified that components marked as "used" are actually imported and used
- Confirmed that dependencies marked as "unused" are not imported anywhere
- Double-checked all file paths and references