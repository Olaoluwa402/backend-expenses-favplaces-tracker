import express from 'express'
const router = express.Router();
import {userLogin, registerUser, getUserProfile, getUsers} from '../controllers/Users.js'
import {protect} from '../middleware/auth.js'


router.route('/').get(getUsers)
router.route('/login').post(userLogin)
router.route('/register').post(registerUser)
router.route('/profile').get(protect,getUserProfile)



export default router