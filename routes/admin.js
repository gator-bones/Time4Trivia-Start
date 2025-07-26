const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.use(isAuthenticated, isAdmin);

router.get('/users', async function (req, res, next) {
    let users = await userController.getUsers();

    users = users.filter((u) => u.userId !== req.session.user.userId);

    res.render('users', {
        title: 'User Management',
        user: req.session.user,
        isAdmin: true,
        users: users
    });
});

router.get('/delete/:userId', async function (req, res, next) {
    let userId = parseInt(req.params.userId, 10);

    const DEFAULT_ADMIN_ID = 1;
    if (userId === req.session.user.userId || userId === DEFAULT_ADMIN_ID) {
        return res.status(403).send("Access Denied: You cannot delete this admin account.");
    }

    await userController.deleteUserById(userId);
    res.redirect('/a/users');
});

router.get('/promote/:userId', async function (req, res, next) {
    let userId = parseInt(req.params.userId, 10);

    const DEFAULT_ADMIN_ID = 1;
    if (userId === req.session.user.userId || userId === DEFAULT_ADMIN_ID) {
        return res.status(403).send("Access Denied: Cannot change role of this admin account.");
    }

    await userController.promoteUser(userId);
    res.redirect('/a/users');
});

router.get('/demote/:userId', async function (req, res, next) {
    let userId = parseInt(req.params.userId, 10);

    const DEFAULT_ADMIN_ID = 1;
    if (userId === req.session.user.userId || userId === DEFAULT_ADMIN_ID) {
        return res.status(403).send("Access Denied: Cannot change role of this admin account.");
    }

    await userController.demoteUser(userId);
    res.redirect('/a/users');
});

router.get('/enable/:userId', async function (req, res, next) {
    let userId = parseInt(req.params.userId, 10);

    const DEFAULT_ADMIN_ID = 1;
    if (userId === req.session.user.userId || userId === DEFAULT_ADMIN_ID) {
        return res.status(403).send("Access Denied: Cannot change status of this admin account.");
    }

    await userController.enableUser(userId);
    res.redirect('/a/users');
});

router.get('/disable/:userId', async function (req, res, next) {
    let userId = parseInt(req.params.userId, 10);

    const DEFAULT_ADMIN_ID = 1;
    if (userId === req.session.user.userId || userId === DEFAULT_ADMIN_ID) {
        return res.status(403).send("Access Denied: Cannot change status of this admin account.");
    }

    await userController.disableUser(userId);
    res.redirect('/a/users');
});

module.exports = router;