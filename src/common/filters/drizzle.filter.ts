import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus
} from '@nestjs/common';
import { Response } from 'express';
import { BaseExceptionFilter } from '@nestjs/core';

enum DrizzleError {
	DUPLICATE_KEY = '23505'
}

@Catch(Error)
export class DrizzleFilter
	extends BaseExceptionFilter
	implements ExceptionFilter
{
	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		if (exception.code === DrizzleError.DUPLICATE_KEY) {
			response.status(HttpStatus.CONFLICT).json({
				statusCode: HttpStatus.CONFLICT,
				message: exception.detail,
				error: 'Conflict'
			});

			return;
		}

		super.catch(exception, host);
	}
}
