const express = require('express');
const router = express.Router();
// const { authenticatateJWT } = require('../middleware/authenticator');
 const agencyController = require('../controllers/agencyController');
const touristController = require('../controllers/touristController');


router.get("/getUsers", agencyController.readAll);
router.post("/insertPackage", agencyController.insertPackage);
router.get("/searchAgencybyId/:packageId", agencyController.searchAgencybyId);
router.post("/agency/register", agencyController.agencyRegister);
router.post("/agency/login", agencyController.agencyLogin);
router.post("/agency/directlogin", agencyController.directLogin);
router.delete("/agency/deletepackage/:agencyId&:packageId", agencyController.deletePackage);
router.post("/agency/createAgency", agencyController.createAgency);
router.post("/agency/updateAgencyInfo", agencyController.updateAgencyInfo);
router.post("/agency/updatePackage", agencyController.updatePackage);
router.get("/searchAgencybyEmail/:userLocalEmail", agencyController.searchAgencybyEmail);
router.get("/getTourists", touristController.getTourists);
router.get("/getTotalNumberOfPaidOrders",touristController.getTotalNumberOfPaidOrders)
router.get("/getTotalNumberOfPackages",agencyController.getTotalNumberOfPackages)
router.get("/getTotalNumberOfAgencies",agencyController.getTotalNumberOfAgencies)
router.get("/getTotalNumberOfAgencyPackages/:userLocalEmail",agencyController.getTotalNumberOfAgencyPackages)
router.get("/getTotalNumberOfOrdersPending/:userLocalEmail",touristController.getTotalNumberOfOrdersPending)
router.get("/getTotalNumberOfAgencyPaidOrders/:userLocalEmail",touristController.getTotalNumberOfAgencyPaidOrders)
router.get("/getTotalNumberOfActiveClients/:userLocalEmail",touristController.getTotalNumberOfActiveClients)
router.get("/getActiveClients/:userLocalEmail",touristController.getActiveClients)
router.get("/getAgencyRevenue/:userLocalEmail",touristController.getAgencyRevenue)
router.get("/findPackagePrice/:id",agencyController.findPackagePrice)


router.post("/insertUser", touristController.insertUser);
router.post("/insertData", touristController.insertData);
router.post("/addpackage", touristController.addpackage);
router.get("/getData", touristController.getData);
router.post("/login", touristController.login);
router.post("/update/:id", touristController.updateId);
router.post("/payment", touristController.payment);
// router.post(
// 	'/',
// 	authenticatateJWT,
// 	upload.single('productImage'),
// 	productController.create
// );
// router.get('/', productController.readAll);
// router.get('/count', productController.readByCount);
// router.get('/:productId', productController.read);
// router.put(
// 	'/:productId',
// 	authenticatateJWT,
// 	upload.single('productImage'),
// 	productController.update
// );
// router.delete('/:productId', authenticatateJWT, productController.delete);

module.exports = router;
