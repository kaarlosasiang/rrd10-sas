# RRD10-SAS Monorepo

A monorepo setup using pnpm workspaces with shared validation schemas.

## 🏗️ Project Structure

```
.
├── apps/
│   ├── api/          # Backend API (Node.js + Express + TypeScript)
│   └── frontend/     # Frontend app (Next.js)
├── packages/
│   └── validators/   # Shared Zod validation schemas
└── pnpm-workspace.yaml
```

## 📦 Packages

### `apps/api`
Backend API built with Node.js, Express, and TypeScript.
- **Tech Stack**: Express, TypeScript, Zod
- **Port**: 3000 (default)

### `apps/frontend`
Frontend application built with Next.js.
- **Tech Stack**: Next.js, React, TypeScript

### `packages/validators`
Shared validation schemas using Zod for both frontend and backend.
- **Exports**: User validation schemas (login, registration, update)
- **Benefits**: Single source of truth for validation across the stack

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- pnpm v8 or higher

### Installation

Install all dependencies across the monorepo:

```bash
pnpm install
```

### Development

**Run both API and frontend together:**
```bash
pnpm dev
```

**Run the API backend only:**
```bash
pnpm dev:api
```

**Run the frontend only:**
```bash
pnpm dev:frontend
```

**Build validators (if changes are made):**
```bash
pnpm build:validators
# Or watch mode:
pnpm validators:watch
```

### Building for Production

**Build everything:**
```bash
pnpm build
```

**Build specific apps:**
```bash
pnpm build:api
pnpm build:frontend
pnpm build:validators
```

### Running Production Builds

```bash
pnpm start:api
pnpm start:frontend
```

## 🔧 Workspace Usage

The validators package is shared between apps using pnpm workspaces.

### Adding the validators package to an app:

```json
// In apps/api/package.json or apps/frontend/package.json
{
  "dependencies": {
    "@rrd10-sas/validators": "workspace:*"
  }
}
```

Then run:
```bash
pnpm install
```

### Using validators in code:

**Backend (Express):**
```typescript
import { userLoginSchema } from '@rrd10-sas/validators';

app.post('/auth/login', (req, res) => {
  try {
    const data = userLoginSchema.parse(req.body);
    // Handle validated data
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.issues });
    }
  }
});
```

**Frontend (React):**
```typescript
import { userLoginSchema, UserLogin } from '@rrd10-sas/validators';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm<UserLogin>({
  resolver: zodResolver(userLoginSchema)
});
```

## 🛠️ Scripts

### Root level (run from project root):
```bash
pnpm install              # Install all dependencies
pnpm dev                  # Run all apps in parallel
pnpm dev:api              # Run API only
pnpm dev:frontend         # Run frontend only
pnpm build                # Build all packages and apps
pnpm build:api            # Build API only
pnpm build:frontend       # Build frontend only
pnpm build:validators     # Build validators package
pnpm validators:watch     # Watch validators in dev mode
pnpm start:api            # Run production API
pnpm start:frontend       # Run production frontend
pnpm typecheck            # Type check all packages
pnpm lint                 # Lint all packages
pnpm clean                # Clean all node_modules and dist
```

### Individual app scripts (when inside app directory):
```bash
# In apps/api
pnpm dev              # Start dev server with hot reload
pnpm build            # Build for production
pnpm start            # Run production build

# In packages/validators
pnpm build            # Build TypeScript to JavaScript
pnpm dev              # Watch mode for development
```

## 📝 Adding New Validators

1. Create a new validator file in `packages/validators/src/`
2. Define Zod schemas and export types
3. Export from `packages/validators/src/index.ts`
4. Rebuild the package: `cd packages/validators && pnpm build`
5. Use in your apps!

## 🤝 Benefits of This Setup

✅ **Type Safety**: Shared TypeScript types across frontend and backend  
✅ **Consistency**: Same validation rules everywhere  
✅ **DRY**: Define validation schemas once, use everywhere  
✅ **Fast**: pnpm workspaces provide instant local package linking  
✅ **Scalable**: Easy to add more shared packages as needed  

## 📚 Tech Stack

- **Runtime**: Node.js
- **Package Manager**: pnpm
- **Backend**: Express.js
- **Frontend**: Next.js
- **Language**: TypeScript
- **Validation**: Zod
- **Monorepo**: pnpm workspaces

