import express from 'express';
import { Absence } from '../models/Absence.js';
import { SchoolClass } from '../models/SchoolClass.js';

const router = express.Router();

router.get('/student/:organizationId', (req, res) => {
    Absence.findAll({
        where: {
            organizationId: req.params.organizationId,
            userId: req.user.id
        }
    }).then((absences) => {
        res.json(absences);
    }).catch((e) => {
        res.status(500).json(e);
    });
});

router.post('/:classId', (req, res) => {
    const { date, userId } = req.body;

    SchoolClass.findByPk(req.params.classId)
    .then((schoolClass) => {
        if (!schoolClass) return res.status(404).json({ message: 'class not found' });

        Absence.create({
            excused: false,
            date,
            schoolclassId: req.params.classId,
            userId,
            organizationId: schoolClass.organizationId
        }).then((absence) => {
            res.json(absence);
        }).catch((e) => {
            res.status(500).json(e);
        });

    }).catch((e) => {
        res.status(500).json(e);
    });
});

router.put('/:id', (req, res) => {
    const { excused } = req.body;

    Absence.update({
        excused
    }, {
        where: {
            id: req.params.id
        }
    }).then((absence) => {
        res.json(absence);
    }).catch((e) => {
        res.status(500).json(e);
    });
});

router.delete('/:id', (req, res) => {
    Absence.destroy({
        where: {
            id: req.params.id
        }
    }).then((absence) => {
        res.json(absence);
    }).catch((e) => {
        res.status(500).json(e);
    });
});

export default router;