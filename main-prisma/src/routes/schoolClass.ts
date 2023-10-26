import express, { Request, Response } from "express";
import { body } from "express-validator";
import prisma from "../../prisma/prisma-client";
import { validate } from "../middleware/validator";

const router = express.Router();

const schoolClassContentValidator = [
  body("name").exists().isString().isLength({ min: 3, max: 255 }),
  body("identifier").exists().isString().isLength({ min: 3, max: 255 }),
  body("subject").exists().isString().isLength({ min: 3, max: 255 }),
  body("icon").exists().isString().isLength({ min: 3, max: 255 }),
  body("theme").exists().isString().isLength({ min: 3, max: 255 }),
];

router.get("/:id/student", (req: Request, res: Response) => {
    
});

router.post(
  "/:organizationId",
  schoolClassContentValidator,
  validate,
  (req: Request, res: Response) => {
    const { name, identifier, subject, icon, theme } = req.body;

    prisma.schoolClass
      .create({
        data: {
          name,
          identifier,
          subject,
          icon,
          theme,
          creatorId: +req.body.user,
          organizationId: +req.params.organizationId,
        },
      })
      .then((schoolClass) => {
        res.json(schoolClass);
      })
      .catch((e) => {
        res.status(500).json(e);
      });
  }
);

router.put(
  "/:id",
  schoolClassContentValidator,
  validate,
  (req: Request, res: Response) => {
    const { name, identifier, subject, icon, theme } = req.body;

    prisma.schoolClass
      .update({
        where: {
          id: +req.params.id,
        },
        data: {
          ...(name && { name }),
          ...(identifier && { identifier }),
          ...(subject && { subject }),
          ...(icon && { icon }),
          ...(theme && { theme }),
        },
      })
      .then((schoolClass) => {
        res.json(schoolClass);
      })
      .catch((e) => {
        res.status(500).json(e);
      });
  }
);

router.delete("/:id", (req: Request, res: Response) => {
  prisma.schoolClass
    .delete({
      where: {
        id: +req.params.id,
      },
    })
    .then((schoolClass) => {
      res.json(schoolClass);
    })
    .catch((e) => {
      res.status(500).json(e);
    });
});

export default router;
