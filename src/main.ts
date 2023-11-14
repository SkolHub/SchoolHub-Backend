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
	handleResponse,
	inviteLinkRouter,
	isAdminInOrganization,
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
app.use('/api/organization', authenticateToken, organizationRouter, handleResponse);
app.use('/api/class', authenticateToken, classRouter, handleResponse);
app.use('/api/grade', authenticateToken, gradeRouter, handleResponse);
app.use('/api/absence', authenticateToken, absenceRouter, handleResponse);
app.use('/api/post', authenticateToken, postRouter, handleResponse);
app.use('/api/post-comment', authenticateToken, postCommentRouter, handleResponse);
app.use('/api/attachment', authenticateToken, fileRouter, handleResponse);
app.use('/api/submission', authenticateToken, submissionRouter, handleResponse);
app.use('/api/english-whiteboard', authenticateToken, englishWhiteboardRouter, handleResponse);
app.use('/api/class-group', authenticateToken, classGroupRouter, handleResponse);
app.use('/api/invite-link', authenticateToken, inviteLinkRouter, handleResponse);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT} ✅`);
});
