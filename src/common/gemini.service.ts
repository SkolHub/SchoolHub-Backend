import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/config';
import * as fs from 'node:fs';

@Injectable()
export class GeminiService {
	private genAI = new GoogleGenerativeAI(config.GEMINI_API);

	private model = this.genAI.getGenerativeModel({
		model: 'gemini-1.5-flash',
		generationConfig: {
			responseMimeType: 'application/json'
		}
	});

	private fileToGenerativePart(path: string, mimeType: string) {
		return {
			inlineData: {
				data: Buffer.from(fs.readFileSync(path)).toString('base64'),
				mimeType
			}
		};
	}

	async generate(
		prompt: string,
		files: {
			path: string;
			mimetype: string;
		}[]
	) {
		return await this.model.generateContent([
			prompt,
			...files.map((file) =>
				this.fileToGenerativePart(file.path, file.mimetype)
			)
		]);
	}
}
