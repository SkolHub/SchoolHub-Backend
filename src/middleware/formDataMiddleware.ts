import { NextFunction, Response } from "express";
import { Request } from "../models/requestModel";

const saveFormData = (req: Request, res: Response, next: NextFunction) => {

    next();
};

export { saveFormData };