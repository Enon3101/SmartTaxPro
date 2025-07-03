import { Router } from 'express';

const router = Router();

// TODO: Implement user management routes
router.get('/', (req, res) => {
  res.status(501).json({ error: 'User routes not implemented yet' });
});

export default router;