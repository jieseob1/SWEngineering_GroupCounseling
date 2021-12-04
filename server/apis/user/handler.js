const utils = require("../../utils/utils");
const { success, error } = require("../../utils/exception_handler");
const config = require("../../configuration/config");

// Database library
const User = require("../../models/User");
const { get_jwt_token } = require("../../service/token.service");

const { default: axios } = require("axios");
const querystring = require("querystring");
const jwt = require("jsonwebtoken");

module.exports.register = async (event) => {
  const _queryParam = event.queryStringParameters;
  // const _queryParam = querystring.stringify(event.body);

  try {
    var _records_info = await axios.get(
      config.server_info.concat("/dev/user/check"),
      {
        params: _queryParam,
      }
    );
  } catch (err) {
    return error("some errors in register handler");
  }
  if (_records_info.data.status === "success") {
    await User.insertNewUser(_queryParam);
    return success("register successful");
  } else {
    return error("user already exists");
  }
};
module.exports.login = async (event) => {
  const _queryParam = event.queryStringParameters;
  // const _queryParam = querystring.stringify(event.body);

  if (!utils.hasKeys(_queryParam, ["userid", "userpw"])) {
    return error("access error");
  }
  try {
    var _information = await User.findUserRecords(_queryParam);
    if (_information.length > 1) {
      // there are no records more than 1 row (critical security exception)
      return error("duplicated users (contact admin)");
    } else if (_information.length < 1) {
      return error("login failed");
    }
    // Now, there is only one record matched user
    // JWT Token generation logic will be implement to below
  } catch (err) {
    return error("some errors in login handler");
  }
  const token = await get_jwt_token(_information);
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(
      { status: "success", message: "login successful", token: token },
      null,
      2
    ),
  };
};
module.exports.check = async (event) => {
  const _queryParam = event.queryStringParameters;
  // const _queryParam = querystring.stringify(event.body);

  if (!utils.hasKeys(_queryParam, ["userid", "userpw"])) {
    // exception code 400 : missing arguments
    return error("access error");
  }
  const _fetched = await User.findOne(_queryParam);

  if (_fetched.length >= 1) {
    // exception code 300 : existing record
    return error({ status: "failed", message: "existing record" });
  }
  return success("no record");
};
module.exports.delete = async (event) => {
  const _queryParam = event.queryStringParameters;
  // const _queryParam = querystring.stringify(event.body);

  if (!utils.hasKeys(_queryParam, ["userid", "userpw", "token"])) {
    return error("access error");
  }
  try {
    const { token } = _queryParam;
    const decoded = await jwt.verify(token, config.secret);
  } catch (err) {
    return error(err);
  }
  // We need to check received user token information for user record accessibility
  const status = await User.deleteUser(_queryParam);
  if (status) {
    return success("delete complete");
  } else {
    return error("some errors in delete handler");
  }
};
module.exports.token_test = async (event) => {
  const _queryParam = event.queryStringParameters;

  if (!utils.hasKeys(_queryParam, ["token"])) {
    return error("access error");
  }
  try {
    const { token } = _queryParam;
    const decoded = await jwt.verify(token, config.secret);
  } catch (err) {
    return error(err);
  }
  return success("Valid token");
};
