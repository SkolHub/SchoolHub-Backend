import { Injectable } from '@nestjs/common';
import { DBService } from '../../common/db.service';
import { quizCraft } from '../../database/schema/quiz-craft';
import { eq, sql } from 'drizzle-orm';
import { GeminiService } from '../../common/gemini.service';
import { VerifyQuizCraftDto } from './dto/verify-quiz-craft.dto';
import { CreateQuizCraftDto } from './dto/create-quiz-craft.dto';
import { FeedbackQuizCraftDto } from './dto/feedback-quiz-craft.dto';

type QuestionType =
	| 'True or False'
	| 'Multiple choice'
	| 'Single choice'
	| 'Short answer'
	| 'Long answer';

@Injectable()
export class QuizCraftService extends DBService {
	constructor(private readonly geminiService: GeminiService) {
		super();
	}

	async create(
		createQuizCraftDto: CreateQuizCraftDto,
		files: Express.Multer.File[]
	) {
		const groups: {
			type: QuestionType;
			difficulty: 'Easy' | 'Medium' | 'Hard';
			count: number;
		}[] = JSON.parse(createQuizCraftDto.groups);

		const data = {
			files: files.map((file) => ({
				path: file.path,
				mimetype: file.mimetype
			})),
			groups: []
		};

		console.log('started for');

		for (const group of groups) {
			let prompt: string;

			switch (group.type) {
				case 'Multiple choice':
					prompt = `Starting from the given files, generate a list of ${group.count} Multiple choice questions of ${group.difficulty} difficulty. Response should be JSON list. Each question should have the format: { question: string, choices: string[], answers: number[] }. Answers should be the indexes of the correct answers. There should be multiple answers`;
					break;

				case 'Single choice':
					prompt = `Starting from the given files, generate a list of ${group.count} Single choice questions of ${group.difficulty} difficulty. Response should be JSON list. Each question should have the format: { question: string, choices: string[], answer: number }. Answer should be the index of the correct answer`;
					break;

				case 'True or False':
					prompt = `Starting from the given files, generate a list of ${group.count} True or False questions of ${group.difficulty} difficulty. Response should be JSON list. Each question should have the format: { question: string, answer: boolean }`;
					break;

				case 'Short answer':
					prompt = `Starting from the given files, generate a list of ${group.count} Short answer questions of ${group.difficulty} difficulty. Response should be JSON list. Each question should have the format: { question: string }`;
					break;

				case 'Long answer':
					prompt = `Starting from the given files, generate a list of ${group.count} Long answer questions of ${group.difficulty} difficulty. Response should be JSON list. Each question should have the format: { question: string }`;
					break;
			}

			const response = await this.geminiService.generate(
				prompt,
				files.map((file) => ({
					path: file.path,
					mimetype: file.mimetype
				}))
			);

			const content = response.response.candidates[0].content.parts[0].text;

			data.groups.push({
				type: group.type,
				count: group.count,
				difficulty: group.difficulty,
				questions: JSON.parse(content)
			});
		}

		console.log('finished');

		return (
			await this.db
				.insert(quizCraft)
				.values({
					body: data
				})
				.returning({ id: quizCraft.id })
		)[0];
	}

	async findAll() {
		return (
			await this.db
				.select({
					id: quizCraft.id,
					timestamp: quizCraft.timestamp,
					files: sql`${quizCraft.body}->>'files'`
				})
				.from(quizCraft)
		).map((quiz) => ({
			...quiz,
			files: JSON.parse(quiz.files as string)
		}));
	}

	async findOne(id: number) {
		return (
			await this.db.select().from(quizCraft).where(eq(quizCraft.id, id))
		)[0];
	}

	async verify(id: number, verifyQuizCraftDto: VerifyQuizCraftDto) {
		const files: {
			path: string;
			mimetype: string;
		}[] = JSON.parse(
			(
				await this.db
					.select({
						files: sql`${quizCraft.body}->>'files'`
					})
					.from(quizCraft)
					.where(eq(quizCraft.id, id))
			)[0].files as string
		) as {
			path: string;
			mimetype: string;
		}[];

		const prompt = `Starting from the given files, verify if the given answers are right or wrong for the given questions. The questions and answers are: ${JSON.stringify(verifyQuizCraftDto)}. If the answer is wrong, also provide what's wrong and an example answer. You should return a list in the following format { response: boolean, wrong?: string, example?: string } with no extra props, the list directly, not an object with the list, where wrong is what's wrong if anything`;

		const response = await this.geminiService.generate(
			prompt,
			files.map((file) => ({
				path: file.path,
				mimetype: file.mimetype
			}))
		);

		return JSON.parse(response.response.candidates[0].content.parts[0].text);
	}

	async feedback(id: number, feedbackQuizCraftDto: FeedbackQuizCraftDto) {
		const files: {
			path: string;
			mimetype: string;
		}[] = JSON.parse(
			(
				await this.db
					.select({
						files: sql`${quizCraft.body}->>'files'`
					})
					.from(quizCraft)
					.where(eq(quizCraft.id, id))
			)[0].files as string
		) as {
			path: string;
			mimetype: string;
		}[];

		const prompt = `Some questions were generated from the given files and someone answered them. Your job is to give an overall feedback for the one that answered the questions, more specifically what they could improve when learning about the given files. These are the questions and answers: ${feedbackQuizCraftDto.responses}. The response should be in this format: { feedback: string } and should contain positive, negative constructive etc. feedback.`;

		const response = await this.geminiService.generate(
			prompt,
			files.map((file) => ({
				path: file.path,
				mimetype: file.mimetype
			}))
		);

		return JSON.parse(response.response.candidates[0].content.parts[0].text);
	}
}
