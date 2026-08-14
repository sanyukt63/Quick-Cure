const router = require('express').Router();
const { authUser } = require('../middlewares/authMiddleware');
const { updateProfile,getProfile ,search, setSchedule, verify, getById, list,doctorAppointments,doctorStats } = require('../controllers/doctorController');


// Public
router.get('/me', authUser, doctorAppointments);
router.get('/me/stats', authUser, doctorStats);

router.get('/profile',authUser,getProfile);
router.post('/update',updateProfile);

router.get('/', list);
router.get('/search', search);
router.get('/:id', getById);


// Doctor self-service (doctor or admin)
router.put('/:id/schedule', authUser, setSchedule);


// Admin verify\ nrouter.post('/:id/verify', auth, permit('admin'), verify);


module.exports = router;