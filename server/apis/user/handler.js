const utils = require("../../utils/utils");
const { exception_handler } = require("../../utils/exception_handler");
const config = require("../../configuration/config");

// Database library
const User = require("../../models/User");
const { default: axios } = require("axios");

module.exports.register = async (event) => {
  const _queryParam = event.queryStringParameters;

  try {
    var _records_info = await axios.get(
      config.server_info.concat("/dev/user/check"),
      {
        params: _queryParam,
      }
    );
  } catch (err) {
    // Http Request Exception
    // return exception_handler()
    console.log(err);
  }

  if (_records_info.data.status === "success") {
    await User.insertNewUser(_queryParam);
    return {
      statusCode: 200,
      body: JSON.stringify(
        { status: "success", message: "register successful" },
        null,
        2
      ),
    };
  } else {
    return exception_handler(300);
  }
};
module.exports.login = async (event) => {
  const _queryParam = event.queryStringParameters;

  if (!utils.hasKeys(_queryParam, ["userid", "password"])) {
    return exception_handler(403);
  }
  try {
    var _information = await User.findUserRecords(_queryParam);
    if (_information.length > 1) {
      // there are no records more than 1 row (critical security exception)
      return exception_handler(400);
    } else if (_information.length < 1) {
      return {
        statusCode: 200,
        body: JSON.stringify(
          { status: "failed", message: "login failed" },
          null,
          2
        ),
      };
    }
    // Now, there is only one record matched user
    // JWT Token generation logic will be implement to below
  } catch (err) {}
  return {
    statusCode: 200,
    body: JSON.stringify(
      { status: "success", message: "login successful", token: "token.." },
      null,
      2
    ),
  };
};
module.exports.check = async (event) => {
  const _queryParam = event.queryStringParameters;

  if (!utils.hasKeys(_queryParam, ["userid", "password"])) {
    // exception code 400 : missing arguments
    return exception_handler(403);
  }
  const _fetched = await User.findOne(_queryParam);
  if (_fetched.length >= 1) {
    // exception code 300 : existing record
    return exception_handler(300);
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ status: "success", message: "no record" }, null, 2),
  };
};
module.exports.delete = async (event) => {
  const _queryParam = event.queryStringParameters;
  if (!utils.hasKeys(_queryParam, ["userid", "password"])) {
    return exception_handler(403);
  }
  // We need to check received user token information for user record accessibility
  await User.deleteUser(_queryParam);
  return {
    statusCode: 200,
    body: JSON.stringify(
      { status: "success", message: "delete complete" },
      null,
      2
    ),
  };
};
module.exports.token_check = async (data) => {};
