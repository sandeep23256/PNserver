const express = require('express');
const route = express.Router();
const TechnologyController = require('../controller/TeachnologyController')
const PortfolioController = require('../controller/PortfolioController')
const EventController = require('../controller/EventController')
const TeamController = require('../controller/TeamController')
const ContactController = require('../controller/ContactController');
const AdminController = require('../controller/AdminController');
const SliderController = require('../controller/SliderController');
const placementController = require('../controller/PlacementController');
const UserController = require('../controller/UserController');
const checkUserAuth = require('../middleware/CheakUserAuth');
const checkAdminAuth = require('../middleware/CheakAdminAuth');

//User
route.post("/user/register", UserController.register);
route.post("/user/login", UserController.login);
route.get("/user/profile", checkUserAuth, UserController.profile);
route.get("/user/home", checkUserAuth, UserController.home);
route.get("/user/logout", checkUserAuth, UserController.logOut);
//Admin
route.post('/register', AdminController.register)
route.post('/login', AdminController.login)
route.put('/changePassword/:id',checkAdminAuth, AdminController.changePassword)
route.post('/logout',checkAdminAuth, AdminController.logOut)
route.get('/admin/dashboard',checkAdminAuth, AdminController.dashboard)
route.get('/profile',checkAdminAuth, AdminController.profile)

//slider controller
route.get('/getAllSlides', SliderController.getAllSlides);
route.post('/createSlide', SliderController.createSlide);
route.put('/slider/:id', SliderController.updateSlide);
route.delete('/slider/:id', SliderController.deleteSlide);

//Technology
route.post('/technologyInsert', TechnologyController.technologyInsert);
route.get('/technologyDisplay', TechnologyController.technologyDisplay);
route.get('/technologyView/:id', TechnologyController.technologyView);
route.put('/technology/:id',checkAdminAuth, TechnologyController.technologyUpdate);
route.delete('/technology/:id',checkAdminAuth, TechnologyController.technologyDelete);

//portfolio
route.post('/portfolioInsert', PortfolioController.portfolioInsert)
route.get('/portfolioDisplay', PortfolioController.portfolioDisplay)
route.get('/portfolioView/:id', PortfolioController.portfolioView)
route.delete('/portfolio/:id',checkAdminAuth, PortfolioController.portfolioDelete)
route.put('/portfolio/:id',checkAdminAuth, PortfolioController.portfolioUpdate)

//events
route.post('/eventInsert', EventController.eventinsert);
route.get('/eventDisplay', EventController.eventdisplay);
route.get('/eventView/:id', EventController.eventview);
route.put('/event/:id',checkAdminAuth, EventController.eventupdate);
route.delete('/event/:id',checkAdminAuth, EventController.eventdelete);

//about 
//team
route.post('/teamInsert',checkAdminAuth, TeamController.teaminsert)
route.get('/teamDisplay', TeamController.teamdisplay)
route.get('/teamview/:id', TeamController.teamview)
route.put('/team/:id',checkAdminAuth, TeamController.teamupdate)
route.delete('/team/:id',checkAdminAuth, TeamController.teamdelete)

//placement desk
route.post('/placementInsert',checkAdminAuth, placementController.placementinsert)
route.get('/placementDisplay', placementController.placementdisplay)
route.get('/placementview/:id', placementController.placementview)
route.put('/placement/:id',checkAdminAuth, placementController.placementupdate)
route.delete('/placement/:id',checkAdminAuth, placementController.placementdelete)

//contactpage
route.post('/contactInsert', ContactController.contactInsert);
route.get('/contactDisplay',checkUserAuth, ContactController.contactDisplay);
route.get('/contactView/:id',checkUserAuth, ContactController.contactView);
route.get('/contactDelete/:id',checkUserAuth, ContactController.contactDelete);





module.exports = route
