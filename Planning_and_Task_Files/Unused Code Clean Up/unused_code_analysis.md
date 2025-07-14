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
1. **`src/components/blog/NewsletterCard.tsx`** - UNUSED **[DELETED]**
   - Reason: Not imported anywhere, StayUpdatedSection has its own implementation
   - Safe to delete: Yes
   - **Status: Deleted**

2. **`src/components/blog/ProgressTab.tsx`** - UNUSED  **[DELETED]**
   - Reason: Not imported or referenced anywhere
   - Safe to delete: Yes
   - **Status: Deleted**

### UI Components - UNUSED
The following UI components are not imported anywhere and can be safely deleted:

1. **`src/components/ui/accordion.tsx`** - UNUSED **[DELETED]**
   - **Status: Deleted**
2. **`src/components/ui/alert-dialog.tsx`** - UNUSED **[DELETED]**
   - **Status: Deleted**
3. **`src/components/ui/alert.tsx`** - UNUSED **[DELETED]**
   - **Status: Deleted**
4. **`src/components/ui/aspect-ratio.tsx`** - UNUSED **[DELETED]**
   - **Status: Deleted**
5. **`src/components/ui/avatar.tsx`** - UNUSED **[DELETED]**
   - **Status: Deleted**
6. **`src/components/ui/breadcrumb.tsx`** - UNUSED **[DELETED]**
   - **Status: Deleted**
7. **`src/components/ui/calendar.tsx`** - UNUSED **[DELETED]**
   - **Status: Deleted**
8. **`src/components/ui/carousel.tsx`** - UNUSED **[DELETED]**
   - **Status: Deleted**
9. **`src/components/ui/chart.tsx`** - UNUSED **[DELETED]**
   - **Status: Deleted**
10. **`src/components/ui/checkbox.tsx`** - UNUSED **[DELETED]**
    - **Status: Deleted**
11. **`src/components/ui/collapsible.tsx`** - UNUSED **[DELETED]**
    - **Status: Deleted**
12. **`src/components/ui/command.tsx`** - UNUSED **[DELETED]**
    - **Status: Deleted**
13. **`src/components/ui/context-menu.tsx`** - UNUSED **[DELETED]**
    - **Status: Deleted**
14. **`src/components/ui/dialog.tsx`** - UNUSED **[DELETED]**
    - **Status: Deleted**
15. **`src/components/ui/drawer.tsx`** - UNUSED **[DELETED]**
    - **Status: Deleted**
16. **`src/components/ui/dropdown-menu.tsx`** - UNUSED **[DELETED]**
    - **Status: Deleted**
17. **`src/components/ui/form.tsx`** - UNUSED **[DELETED]**
    - **Status: Deleted**
18. **`src/components/ui/hover-card.tsx`** - UNUSED **[DELETED]**
    - **Status: Deleted**
19. **`src/components/ui/input-otp.tsx`** - UNUSED **[DELETED]**
    - **Status: Deleted**
20. **`src/components/ui/menubar.tsx`** - UNUSED **[DELETED]**
    - **Status: Deleted**
21. **`src/components/ui/navigation-menu.tsx`** - UNUSED **[DELETED]**
    - **Status: Deleted**
22. **`src/components/ui/pagination.tsx`** - UNUSED **[DELETED]**
    - **Status: Deleted**
23. **`src/components/ui/popover.tsx`** - UNUSED **[DELETED]**
    - **Status: Deleted**
24. **`src/components/ui/progress.tsx`** - UNUSED **[DELETED]**
    - **Status: Deleted**
25. **`src/components/ui/radio-group.tsx`** - UNUSED **[DELETED]**
    - **Status: Deleted**
26. **`src/components/ui/resizable.tsx`** - UNUSED **[DELETED]**
    - **Status: Deleted**
27. **`src/components/ui/scroll-area.tsx`** - UNUSED **[DELETED]**
   - **Status: Deleted**
28. **`src/components/ui/select.tsx`** - UNUSED **[DELETED]**
   - **Status: Deleted**
29. **`src/components/ui/separator.tsx`** - UNUSED **[DELETED]**
   - **Status: Deleted**
30. **`src/components/ui/sheet.tsx`** - UNUSED **[DELETED]**
   - **Status: Deleted**
31. **`src/components/ui/sidebar.tsx`** - UNUSED **[DELETED]**
   - **Status: Deleted**
32. **`src/components/ui/skeleton.tsx`** - UNUSED **[DELETED]**
   - **Status: Deleted**
33. **`src/components/ui/slider.tsx`** - UNUSED **[DELETED]**
   - **Status: Deleted**
34. **`src/components/ui/switch.tsx`** - UNUSED **[DELETED]**
   - **Status: Deleted**
35. **`src/components/ui/table.tsx`** - UNUSED **[DELETED]**
   - **Status: Deleted**
36. **`src/components/ui/tabs.tsx`** - UNUSED **[DELETED]**
   - **Status: Deleted**
37. **`src/components/ui/toggle-group.tsx`** - UNUSED **[DELETED]**
   - **Status: Deleted**
38. **`src/components/ui/toggle.tsx`** - UNUSED **[DELETED]**
   - **Status: Deleted**

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

### **TOTAL: 46 Files + 1 Directory + 35 Dependencies**

### Files (46 remaining):
1. `src/components/blog/NewsletterCard.tsx` **[DELETED]**
2. `src/components/blog/ProgressTab.tsx` **[DELETED]**
3. `src/components/ui/accordion.tsx` **[DELETED]**
4. `src/components/ui/alert-dialog.tsx` **[DELETED]**
5. `src/components/ui/alert.tsx` **[DELETED]**
6. `src/components/ui/aspect-ratio.tsx` **[DELETED]**
7. `src/components/ui/avatar.tsx` **[DELETED]**
8. `src/components/ui/breadcrumb.tsx` **[DELETED]**
9. `src/components/ui/calendar.tsx` **[DELETED]**
10. `src/components/ui/carousel.tsx` **[DELETED]**
11. `src/components/ui/chart.tsx` **[DELETED]**
12. `src/components/ui/checkbox.tsx` **[DELETED]**
13. `src/components/ui/collapsible.tsx` **[DELETED]**
14. `src/components/ui/command.tsx` **[DELETED]**
15. `src/components/ui/context-menu.tsx` **[DELETED]**
16. `src/components/ui/dialog.tsx` **[DELETED]**
17. `src/components/ui/drawer.tsx` **[DELETED]**
18. `src/components/ui/dropdown-menu.tsx` **[DELETED]**
19. `src/components/ui/form.tsx` **[DELETED]**
20. `src/components/ui/hover-card.tsx` **[DELETED]**
21. `src/components/ui/input-otp.tsx` **[DELETED]**
22. `src/components/ui/menubar.tsx` **[DELETED]**
23. `src/components/ui/navigation-menu.tsx` **[DELETED]**
24. `src/components/ui/pagination.tsx` **[DELETED]**
25. `src/components/ui/popover.tsx` **[DELETED]**
26. `src/components/ui/progress.tsx` **[DELETED]**
27. `src/components/ui/radio-group.tsx` **[DELETED]**
28. `src/components/ui/resizable.tsx` **[DELETED]**
29. `src/components/ui/scroll-area.tsx` **[DELETED]**
30. `src/components/ui/select.tsx` **[DELETED]**
31. `src/components/ui/separator.tsx` **[DELETED]**
32. `src/components/ui/sheet.tsx` **[DELETED]**
33. `src/components/ui/sidebar.tsx` **[DELETED]**
34. `src/components/ui/skeleton.tsx` **[DELETED]**
35. `src/components/ui/slider.tsx` **[DELETED]**
36. `src/components/ui/switch.tsx` **[DELETED]**
37. `src/components/ui/table.tsx` **[DELETED]**
38. `src/components/ui/tabs.tsx` **[DELETED]**
39. `src/components/ui/toggle-group.tsx` **[DELETED]**
40. `src/components/ui/toggle.tsx` **[DELETED]**
41. `backend/main.py` **[MISSING]**
42. `backend/requirements.txt` **[MISSING]**
43. `backend/services/openai_service.py` **[MISSING]**
44. `backend/services/__init__.py` **[MISSING]**
45. `backend/__init__.py` **[MISSING]**
46. `zfull_start.bat` **[MISSING]**
47. `requirements.txt` **[DELETED]**
48. `tailwind.config.ts.backup` **[MISSING]**

- Note: Files marked as **[MISSING]** could not be found and may have already been deleted or moved previously.
- Note: Files marked as **[DELETED]** were successfully deleted in this cleanup round.

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
19. `