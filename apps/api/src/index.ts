import express, { Request, Response } from 'express';
import { userLoginSchema, userRegistrationSchema } from '@rrd10-sas/validators';
import { z } from 'zod';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API is running' });
});

// Example: Login endpoint with validation
app.post('/auth/login', (req: Request, res: Response) => {
  try {
    const data = userLoginSchema.parse(req.body);
    // Data is now validated and type-safe
    res.json({ message: 'Login successful', user: { email: data.email } });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.issues });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Example: Registration endpoint with validation
app.post('/auth/register', (req: Request, res: Response) => {
  try {
    const data = userRegistrationSchema.parse(req.body);
    // Data is now validated and type-safe
    res.json({
      message: 'Registration successful',
      user: { email: data.email, name: data.name }
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.issues });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

