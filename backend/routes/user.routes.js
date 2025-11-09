import { Router } from 'express';//A Router instance is a complete middleware and routing system; often referred to as a "mini-app".
import * as userController from '../controllers/user.controller.js';
import { body } from 'express-validator';//Express-validator is a set of express.js middlewares that wraps validator.js, a library for string validations and sanitizations.
import * as authMiddleware from '../middleware/auth.middleware.js';

const router = Router();


//register route
router.post('/register',
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
    userController.createUserController);
    
//login route
router.post('/login',
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
    userController.loginController);

//profile route
router.get('/profile', authMiddleware.authUser, userController.profileController);

//logout route
router.get('/logout', authMiddleware.authUser, userController.logoutController);

//get all users route
router.get('/all', authMiddleware.authUser, userController.getAllUsersController);


export default router;