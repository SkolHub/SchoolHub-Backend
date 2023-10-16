import express from "express";
import { SchoolClass } from "../models/SchoolClass.js";

import gradeRouter from './grade.js';

const router = express.Router();

//router.use('/:id/grade', gradeRouter);

router.get('/:id', (req, res) => {
    if (!req.user) return;

    SchoolClass.findByPk(req.params.id)
    .then((classes) => {
        res.json(classes);
    }).catch((e) => {
        res.status(500).json(e);
    });
});

router.post('/', (req, res) => {
    if (!req.user) return;

    const { organizationId, name, identifier, subject, icon, theme } = req.body;

    SchoolClass.create({
        organizationId,
        name,
        identifier,
        subject,
        icon,
        theme,
        creator: req.user.id
    }).then((schoolClass) => {
        res.json(schoolClass);
    }).catch((e) => {
        res.status(500).json(e);
    });
});

router.post('/:id/join', (req, res) => {
    if (!req.user) return;

    const { user_id } = req.body;

    User.findByPk(user_id)
    .then((user) => {
        if (!user) return res.status(404).json({ error: 'User not found' });

        SchoolClass.findByPk(req.params.id)
        .then((schoolClass) => {
            if (!schoolClass) return res.status(404).json({ error: 'Class not found' });

            user.addSchoolclass(organization)
            .then((test) => {
                res.json(test);
            }).catch((e) => {
                res.status(500).json(e);
            })

        }).catch((e) => {
            res.status(500).json(e);
        })
    }).catch((e) => {
        res.status(500).json(e);
    });
});

router.put('/:id', (req, res) => {
    if (!req.user) return;

    const { name, identifier, subject, icon, theme } = req.body;

    SchoolClass.update({
        ...(name && { name }),
        ...(identifier && { identifier }),
        ...(subject && { subject }),
        ...(icon && { icon }),
        ...(theme && { theme })
    }, {
        where: {
            id: req.params.id
        }
    }).then((schoolClass) => {
        res.json(schoolClass);
    }).catch((e) => {
        res.status(500).json(e);
    });
});

router.delete('/:id', (req, res) => {
    if (!req.user) return;

    SchoolClass.destroy({
        where: {
            id: req.params.id
        }
    }).then((schoolClass) => {
        res.json(schoolClass);
    }).catch((e) => {
        res.status(500).json(e);
    });
});

export default router;