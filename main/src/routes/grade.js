import express from 'express';
import { Grade } from '../models/Grade.js';
import { SchoolClass } from '../models/SchoolClass.js';

const router = express.Router();

router.get('/student/:organizationId', (req, res) => {
    Grade.findAll({
        where: {
            organizationId: req.params.organizationId,
            userId: req.user.id
        }
    }).then((grades) => {
        res.json(grades);
    }).catch((e) => {
        res.status(500).json(e);
    });
});

router.get('/teacher/:classId', (req, res) => {
    
});

router.post('/:classId', (req, res) => {
    const { value, date, userId } = req.body;

    SchoolClass.findByPk(req.params.classId)
    .then((schoolClass) => {
        if (!schoolClass) return res.status(404).json({ message: 'class not found' });

        Grade.create({
            value,
            date,
            schoolclassId: req.params.classId,
            userId,
            organizationId: schoolClass.organizationId
        }).then((grade) => {
            res.json(grade);
        }).catch((e) => {
            res.status(500).json(e);
        });

    }).catch((e) => {
        res.status(500).json(e);
    });
});

router.put('/:id', (req, res) => {
    const { value, date } = req.body;

    Grade.update({
        value,
        date
    }, {
        where: {
            id: req.params.id
        }
    }).then((grade) => {
        res.json(grade);
    }).catch((e) => {
        res.status(500).json(e);
    });
});

router.delete('/:id', (req, res) => {
    Grade.destroy({
        where: {
            id: req.params.id
        }
    }).then((grade) => {
        res.json(grade);
    }).catch((e) => {
        res.status(500).json(e);
    });
});

export default router;