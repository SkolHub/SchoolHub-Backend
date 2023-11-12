import {
	absenceRouter,
	accountRouter,
	authRouter,
	authenticateToken,
	classGroupRouter,
	classRouter,
	cors,
	englishWhiteboardRouter,
	express,
	fileRouter,
	gradeRouter,
	inviteLinkRouter,
	organizationRouter,
	postCommentRouter,
	postRouter,
	submissionRouter
} from './modules/mainModule';

const PORT = 8000;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/account', authenticateToken, accountRouter);
app.use('/api/organization', authenticateToken, organizationRouter);
app.use('/api/class', authenticateToken, classRouter);
app.use('/api/grade', authenticateToken, gradeRouter);
app.use('/api/absence', authenticateToken, absenceRouter);
app.use('/api/post', authenticateToken, postRouter);
app.use('/api/post-comment', authenticateToken, postCommentRouter);
app.use('/api/attachment', authenticateToken, fileRouter);
app.use('/api/submission', authenticateToken, submissionRouter);
app.use('/api/english-whiteboard', authenticateToken, englishWhiteboardRouter);
app.use('/api/class-group', authenticateToken, classGroupRouter);
app.use('/api/invite-link', authenticateToken, inviteLinkRouter);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT} ✅`);
});
