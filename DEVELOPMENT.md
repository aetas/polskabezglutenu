# Development

## 🚀 Project Structure

Inside of this project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn-ui components
│   │   │   ├── card.tsx
│   │   │   └── badge.tsx
│   │   └── PlaceCard.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── lib/
│   │   └── utils.ts      # Utility functions
│   ├── styles/
│   │   └── globals.css   # Global styles and CSS variables
│   └── pages/
│       └── index.astro
└── package.json
```

## 🎨 UI Components

This project uses [shadcn-ui](https://ui.shadcn.com/) components with Tailwind CSS for styling. The components are built with React and integrated into Astro pages.

### Component Structure

- `src/components/ui/` - Contains all shadcn-ui components
- `src/styles/globals.css` - Global styles and CSS variables for theming
- `src/lib/utils.ts` - Utility functions for styling and components

### Styling Guidelines

1. Use Tailwind CSS classes for styling
2. Follow shadcn-ui's theming system using CSS variables
3. Use semantic color tokens (e.g., `text-primary`, `bg-muted`) instead of direct colors
4. Maintain responsive design using Tailwind's breakpoint prefixes

### Adding New Components

1. Create components in `src/components/ui/`
2. Use existing shadcn-ui components when possible
3. Follow the component structure:
   ```tsx
   import * as React from "react"
   import { cn } from "@/lib/utils"

   interface ComponentProps {
     // Props definition
   }

   export function Component({ className, ...props }: ComponentProps) {
     return (
       <div className={cn("base-classes", className)} {...props}>
         // Component content
       </div>
     )
   }
   ```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
