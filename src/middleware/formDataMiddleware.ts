import { NextFunction, Response } from "express";
import { Request } from "../models/requestModel";

const saveFormData = (req: Request, res: Response, next: NextFunction) => {
	req.formData = req.body;

    console.log(req.body)

    next();
};

export { saveFormData };