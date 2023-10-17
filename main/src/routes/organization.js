import express from 'express';
import { Organization } from '../models/Organization.js';
import { User } from '../models/User.js';

const router = express.Router();

// Object.getOwnPropertyNames(Object.getPrototypeOf(user))

router.get('/:id/classes', (req, res) => {
    User.findByPk(req.user.id)
    .then((user) => {
        user.getSchoolclasses().then((classes) => {
            res.json(classes);
        }).catch((e) => {
            res.status(500).json(e);
        });
    }).catch((e) => {
        res.status(500).json(e);
    });
});

router.get('/', (req, res) => {
    User.findByPk(req.user.id)
    .then((user) => {
        user.getOrganizations({
            joinTableAttributes: ['role']
        }).then((organizations) => {
            res.json(organizations);
        }).catch((e) => {
            res.status(500).json(e);
        });
    }).catch((e) => {
        res.status(500).json(e);
    });
});

router.post('/', (req, res) => {
    const { name } = req.body;

    Organization.create({
        name,
        creator: req.user.id
    }).then((organization) => {
        res.json(organization);
    }).catch((e) => {
        res.status(500).json(e);
    });
});

router.post('/:id/join', (req, res) => {
    const { user_id, role } = req.body;

    User.findByPk(user_id)
    .then((user) => {
        if (!user) return res.status(404).json({ error: 'User not found' });

        Organization.findByPk(req.params.id)
        .then((organization) => {
            if (!organization) return res.status(404).json({ error: 'Organization not found' });

            user.addOrganization(organization, {
                through: {
                    role: role
                }
            }).then((test) => res.json(test)).catch((e) => res.status(500).json(e))

        }).catch((e) => {
            res.status(500).json(e);
        })
    }).catch((e) => {
        res.status(500).json(e);
    });
});

router.put('/:id', (req, res) => {
    const { name } = req.body;

    Organization.update({
        name
    }, {
        where: {
            id: req.params.id
        }
    }).then((organization) => {
        res.json(organization);
    }).catch((e) => {
        res.status(500).json(e);
    });
});

router.delete('/:id', (req, res) => {
    Organization.destroy({
        where: {
          id: req.params.id,
        },
    }).then((organization) => {
        res.json(organization);
    }).catch((e) => {
        res.status(500).json(e);
    });
});

export default router;