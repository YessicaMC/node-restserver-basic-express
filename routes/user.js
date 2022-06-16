
const { Router } = require('express');
const { userGET, userPUT, userPOST, userPATCH, userDELETE } = require('../controllers/users_controller');

const router = Router();

router.get('/',  userGET);
router.post('/', userPOST);
router.put('/:id',  userPUT);
router.patch('/', userPATCH);
router.delete('/', userDELETE);

module.exports = router;