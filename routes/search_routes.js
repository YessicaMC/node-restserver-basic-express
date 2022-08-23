const { Router } = require("express");
const { searchGET } = require("../controllers/search_controller");

const router = Router();

router.get('/:collection/:term', searchGET);

module.exports = router;