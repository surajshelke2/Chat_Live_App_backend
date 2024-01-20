const express = require('express');
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeToGroup } = require('../controllers/chatController');
const { protect } = require('../middleware/Authentication');

const router = express.Router();

router.route('/').post(protect, accessChat);
router.route('/').get(protect, fetchChats);
router.route("/group").post(protect,createGroupChat);
router.route("/rename").put(protect,renameGroup);
router.route("/addUser").put(protect,addToGroup);
router.route("/removeUser").put(protect,removeToGroup);


module.exports = router;
