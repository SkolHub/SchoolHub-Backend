import express, { Request, Response } from "express";
import { body } from "express-validator";
import prisma from "../../prisma/prisma-client";
import { validate } from "../middleware/validator";

const router = express.Router();

router.get("/class/:classId/student", (req: Request, res: Response) => {
  prisma.post
    .findMany({
      where: {
        schoolClassId: +req.params.classId
      },
    })
    .then((posts) => {
      res.json(posts);
    })
    .catch((e) => {
      res.status(500).json(e);
    });
});

router.get(
  "/organization/:organizationId/student",
  (req: Request, res: Response) => {
    prisma.post
      .findMany({
        where: {
          organizationId: +req.params.organizationId,
        },
      })
      .then((posts) => {
        res.json(posts);
      })
      .catch((e) => {
        res.status(500).json(e);
      });
  }
);

const createPostValidator = [
  body("title").exists().isString().isLength({ min: 1, max: 255 }),
  body("body").exists().isString().isLength({ min: 1 }),
  body("type").exists().isIn(["announcement", "assignment"])
];

router.post(
  "/:classId",
  createPostValidator,
  validate,
  (req: Request, res: Response) => {
    const { title, body, type } = req.body;

    prisma.schoolClass
      .findUnique({
        where: {
          id: +req.params.classId,
        },
      })
      .then((schoolClass) => {
        if (!schoolClass)
          return res.status(404).json({ message: "Class not found." });

        prisma.post.create({
            data: {
                body,
                title,
                type,
                schoolClassId: schoolClass.id,
                organizationId: schoolClass.id
            }
        }).then((post) => {
            res.json(post);
        }).catch((e) => {
            res.status(500).json(e);
        });
      })
      .catch((e) => {
        res.status(500).json(e);
      });
  }
);

const updatePostValidator = [
    body("title").exists().isString().isLength({ min: 1, max: 255 }),
    body("body").exists().isString().isLength({ min: 1 })
  ];

router.put(
  "/:id",
  updatePostValidator,
  validate,
  (req: Request, res: Response) => {
    const { title, body } = req.body;

    prisma.post
      .update({
        where: {
          id: +req.params.id,
        },
        data: {
            title,
            body
        },
      })
      .then((post) => {
        res.json(post);
      })
      .catch((e) => {
        res.status(500).json(e);
      });
  }
);

router.delete("/:id", (req: Request, res: Response) => {
  prisma.post
    .delete({
      where: {
        id: +req.params.id,
      },
    })
    .then((post) => {
      res.json(post);
    })
    .catch((e) => {
      res.status(500).json(e);
    });
});

export default router;
