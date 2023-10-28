import express from 'express';
import cors from 'cors';

import authRouter from './routes/auth';
import accountController from './routes/account';
import organizationController from './routes/organization';
import classController from './routes/schoolClass';
import gradeController from './routes/grade';
import absenceController from './routes/absence';
import postController from './routes/post';
import postCommentController from './routes/postComment';
import attachmentController from './routes/attachment';
import submissionController from './routes/submission';

import { authenticateToken } from './middleware/authMiddleware';

const PORT = 8000;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/account', authenticateToken, accountController);
app.use('/api/organization', authenticateToken, organizationController);
app.use('/api/class', authenticateToken, classController);
app.use('/api/grade', authenticateToken, gradeController);
app.use('/api/absence', authenticateToken, absenceController);
app.use('/api/post', authenticateToken, postController);
app.use('/api/post_comment', authenticateToken, postCommentController);
app.use('/api/attachment', authenticateToken, attachmentController);
app.use('/api/submission', authenticateToken, submissionController);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT} ✅`);
});
