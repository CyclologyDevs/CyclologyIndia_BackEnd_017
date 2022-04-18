const event_controller = require('../controllers/eventcontroller')

const router = require('express').Router()


router.get(`/event001`, event_controller.event001);
router.get('/event002', event_controller.event002);
router.get('/event003', event_controller.event003);


module.exports = router;