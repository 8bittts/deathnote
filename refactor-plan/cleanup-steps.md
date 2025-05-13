# Death Note Project Cleanup Steps

## 1. Remove Unused Editor Implementation

### Files to Delete
- `src/components/editorjs-wrapper.tsx`
- `src/types/editorjs.d.ts`

### Dependencies to Remove
Update `package.json` to remove the following unused packages:
```json
"@editorjs/checklist": "^1.6.0",
"@editorjs/code": "^2.9.3",
"@editorjs/delimiter": "^1.4.2",
"@editorjs/editorjs": "^2.30.8",
"@editorjs/embed": "^2.7.6",
"@editorjs/header": "^2.8.8",
"@editorjs/link": "^2.6.2",
"@editorjs/list": "^2.0.8",
"@editorjs/marker": "^1.4.0",
"@editorjs/quote": "^2.7.6",
"@editorjs/simple-image": "^1.6.0",
"@editorjs/table": "^2.4.4",
"@editorjs/warning": "^1.4.1",
```

## 2. API Route Cleanup

### Option 1: Document API Routes
Add JSDoc comments to the existing API routes:
- `src/app/api/deepseek/route.ts`
- `src/app/api/firecrawl/route.ts`

### Option 2: Remove Mock API Routes
If these routes are not planned for implementation, delete them:
- `src/app/api/deepseek/route.ts`
- `src/app/api/firecrawl/route.ts`

## 3. Component Documentation

Add JSDoc comments to all components, with special attention to:
- `src/components/tiptap-editor.tsx`
- `src/components/app-header.tsx`
- `src/components/app-sidebar.tsx`
- `src/components/date-range-picker.tsx`
- `src/components/footer.tsx`
- `src/components/theme-toggle.tsx`

Example format:
```tsx
/**
 * ComponentName - Brief description of what it does
 * 
 * @param prop1 - Description of prop1
 * @param prop2 - Description of prop2
 * @returns Rendered component
 */
```

## 4. Add .env.example File

Create a .env.example file with all required environment variables (without values):
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_VERIFICATION_PERIOD_DAYS=7
NEXT_PUBLIC_APP_URL=http://localhost:4321
```

## 5. Update README.md

Replace the current README.md with the improved version from `refactor-plan/README-new.md`

## 6. Add CONTRIBUTING.md

Add the CONTRIBUTING.md file from `refactor-plan/CONTRIBUTING.md`

## 7. Document Types

Add proper JSDoc comments to all type definitions in:
- `src/types/index.ts`

## 8. Improving Component Props Consistency

Ensure all components follow consistent prop naming and typing conventions:
- Use interfaces for props
- Use descriptive prop names
- Add default values where appropriate
- Use proper TypeScript types

## 9. Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit: Death Note application"
git branch -M main
git remote add origin https://github.com/8bittts/deathnote.git
git push -u origin main
```

## 10. Update Space at Edges for Avatar

Check and ensure that the avatar components have proper spacing as per the recent change request.

## 11. Add License File

Create a LICENSE file in the root directory with MIT license text. 