import {Router} from 'express' ;
import * as userController from '../controllers/user.controller.js'

import * as authMiddleware from '../middlewares/auth.middleware.js'

import {body} from 'express-validator'

const router = Router();

router.post('/register',
    body('email').isEmail().withMessage('Email must be a valid email address '),
    body('password').isLength({min: 3}).withMessage('Passoword must be a atleast 3 characters long '),
    userController.createUserController);


router.post('/login', 
    body('email').isEmail().withMessage('Email must be a valid email address '),
    body('password').isLength({min: 3}).withMessage('Passoword must be a atleast 3 characters long '),
    userController.loginController
);

router.get('/profile',authMiddleware.authUser , userController.profileController) ;

router.get('/logout', authMiddleware.authUser, userController.logoutController);

router.get('/all', authMiddleware.authUser, userController.getAllUserController);

export default router ; 