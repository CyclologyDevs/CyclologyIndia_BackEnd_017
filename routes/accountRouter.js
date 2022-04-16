const multer  = require('multer')
const user_controller = require('../controllers/usercontrollers')
const blog_controller = require('../controllers/blogcontroller')
const reset = require('../middlewares/reset_password_link')
const update = require('../middlewares/update_password')
const upload = multer({ dest: '../images/' })


const router = require('express').Router()


router.post('/register', user_controller.register)
router.post('/login', user_controller.login)
router.get('/logout',user_controller.logout)
router.post('/auth', user_controller.auth)
router.get('/all', user_controller.alluser)
router.get('/:uuid', user_controller.single)
router.patch('/:uuid', user_controller.update)
router.delete('/:uuid', user_controller.deleteit)

module.exports = router


router.post('/imageupload',upload.single('files'),blog_controller)
router.post('/resetpassword', reset)
//router.post('/updatepassword', update)
router.post('/updatepassword/:token', update)