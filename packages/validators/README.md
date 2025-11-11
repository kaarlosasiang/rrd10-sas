# @rrd10-sas/validators

Shared Zod validation schemas for both backend and frontend applications.

## Installation

This is a local workspace package. To use it in your apps:

```bash
# In apps/api or apps/frontend
pnpm add @rrd10-sas/validators@workspace:*
```

Or add to your `package.json`:

```json
{
  "dependencies": {
    "@rrd10-sas/validators": "workspace:*"
  }
}
```

## Usage

### Backend (Express)

```typescript
import { userLoginSchema, UserLogin } from '@rrd10-sas/validators';

app.post('/login', (req, res) => {
  try {
    const data: UserLogin = userLoginSchema.parse(req.body);
    // data is now type-safe and validated
    // ... handle login
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    throw error;
  }
});
```

### Frontend (React/Next.js)

```typescript
import { userLoginSchema, UserLogin } from '@rrd10-sas/validators';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<UserLogin>({
    resolver: zodResolver(userLoginSchema)
  });

  const onSubmit = (data: UserLogin) => {
    // data is validated
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* form fields */}
    </form>
  );
};
```

## Available Validators

### User Validators

- `userLoginSchema` - Email and password for login
- `userRegistrationSchema` - Email, password, and name for registration
- `userUpdateSchema` - Optional fields for updating user info
- `emailSchema` - Email validation
- `passwordSchema` - Password validation with requirements
- `idSchema` - UUID validation

### Types

All schemas export corresponding TypeScript types:

- `UserLogin`
- `UserRegistration`
- `UserUpdate`

## Development

Build the package:

```bash
pnpm build
```

Watch mode for development:

```bash
pnpm dev
```

## Adding New Validators

1. Create a new file in `src/` (e.g., `product.validators.ts`)
2. Define your Zod schemas and export types
3. Export from `src/index.ts`
4. Rebuild the package

Example:

```typescript
// src/product.validators.ts
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1).max(200),
  price: z.number().positive(),
  description: z.string().optional(),
});

export type Product = z.infer<typeof productSchema>;
```

```typescript
// src/index.ts
export * from './user.validators';
export * from './product.validators'; // Add this line
```

