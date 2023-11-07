import express from 'express';
import cors from 'cors';

import authRouter from './routes/authRouter';
import accountController from './routes/accountRouter';
import organizationController from './routes/organizationRouter';
import classController from './routes/schoolClassRouter';
import gradeController from './routes/gradeRouter';
import absenceController from './routes/absenceRouter';
import postController from './routes/postRouter';
import postCommentController from './routes/postCommentRouter';
import attachmentController from './routes/attachmentRouter';
import submissionController from './routes/submissionRouter';

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
