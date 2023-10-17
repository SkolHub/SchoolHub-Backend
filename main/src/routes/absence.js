import express from 'express';
import { Absence } from '../models/Absence.js';

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

    Absence.create({
        excused: false,
        date,
        schoolclassId: req.params.classId,
        userId,
        organizationId: 1 // TO BE MODIFIED WITH ACTUAL ORGANIZATION
    }).then((absence) => {
        res.json(absence);
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