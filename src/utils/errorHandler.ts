export class ErrorHandler extends Error {
	readonly statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
		// Set the prototype explicitly.
		// Object.setPrototypeOf(this, ErrorHandler.prototype);
		Error.captureStackTrace(this, this.constructor);
	}
}
