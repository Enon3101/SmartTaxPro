import { Router } from 'express';

const router = Router();

// TODO: Implement admin management routes
router.get('/', (req, res) => {
  res.status(501).json({ error: 'Admin routes not implemented yet' });
});

export default router;