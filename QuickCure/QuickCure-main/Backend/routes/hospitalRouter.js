const router = require('express').Router();
const { authUser } = require('../middlewares/authMiddleware');
const { create, list, verify } = require('../controllers/hospitalController');


router.get('/', list);
router.post('/', authUser, create);
router.post('/:id/verify', authUser, verify);


module.exports = router;