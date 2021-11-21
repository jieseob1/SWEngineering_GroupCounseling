const utils = require("../../utils/utils");
const { exception_handler } = require("../../utils/exception_handler");
const config = require("../../configuration/config");

// Database library
const User = require("../../models/User");
const { default: axios } = require("axios");

module.exports.create_chat = async (event) => {};
module.exports.create_board = async (data) => {};
module.exports.alarm = (data) => {};
module.exports.view_boards = async (data) => {};
module.exports.view_chats = async (data) => {};
module.exports.my_chats = async (data) => {};
module.exports.send = async (data) => {};
