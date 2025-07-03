import { Router } from 'express';

const router = Router();

// TODO: Implement file upload and management routes
router.get('/', (req, res) => {
  res.status(501).json({ error: 'File routes not implemented yet' });
});

export default router;