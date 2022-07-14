const event_controller = require('../controllers/eventController')

const router = require('express').Router()


router.get(`/event00001`, event_controller.event00001);
router.get('/event00002', event_controller.event00002);
router.get('/event_may750', event_controller.event_may750);
router.get('/event_june800', event_controller.event_june800);

router.get('/event_aug/total_distance', event_controller.event_august_total_distance);
router.get('/event_aug/longest_single_ride', event_controller.event_august_longest_single_ride);
router.get('/event_aug/max_no_rides', event_controller.event_august_max_no_rides);


module.exports = router;