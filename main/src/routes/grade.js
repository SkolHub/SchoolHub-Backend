import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    res.json({message: "Mircea cristea"});
});

export default router;