const router = require('express').Router();
const { authUser } = require('../middlewares/authMiddleware');
const { book, myAppointments, cancel, complete } = require('../controllers/appointmentController');


router.post('/', authUser, book);
router.get('/me', authUser, myAppointments);
router.post('/:id/cancel', authUser, cancel);
router.post('/:id/complete', authUser, complete);


module.exports = router;