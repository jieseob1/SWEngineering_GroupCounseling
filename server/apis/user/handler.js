const utils = require("../../utils/utils");
const { exception_handler } = require("../../utils/exception_handler");
const config = require("../../configuration/config");

// Database library
const User = require("../../models/User");
const { get_jwt_token } = require("../../service/token.service");

const { default: axios } = require("axios");
const querystring = require("querystring");
const jwt = require("jsonwebtoken");

module.exports.register = async (event) => {
  await User.initialize();
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
    // Http Request Exception
    // return exception_handler()
    console.log(err);
  }
  console.log("here");
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
  // const _queryParam = querystring.stringify(event.body);

  if (!utils.hasKeys(_queryParam, ["userid", "userpw"])) {
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
  const token = await get_jwt_token(_information);
  return {
    statusCode: 200,
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
    return exception_handler(403);
  }
  const _fetched = await User.findOne(_queryParam);
  console.log("here");
  console.log(_fetched);
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
  // const _queryParam = querystring.stringify(event.body);

  if (!utils.hasKeys(_queryParam, ["userid", "userpw", "token"])) {
    return exception_handler(403);
  }
  try {
    const { token } = _queryParam;
    const decoded = await jwt.verify(token, config.secret);
    console.log(decoded);
    console.log("here");
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return {
        statusCode: 419,
        body: JSON.stringify(
          {
            message: "Token expired",
          },
          null,
          2
        ),
      };
    }
    if (error.name === "JsonWebTokenError") {
      return {
        statusCode: 401,
        body: JSON.stringify(
          {
            message: "Invalid token information",
          },
          null,
          2
        ),
      };
    }
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
module.exports.token_test = async (event) => {
  const _queryParam = event.queryStringParameters;

  if (!utils.hasKeys(_queryParam, ["token"])) {
    return exception_handler(403);
  }
  try {
    const { token } = _queryParam;
    const decoded = await jwt.verify(token, config.secret);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return {
        statusCode: 419,
        body: JSON.stringify(
          {
            message: "Token expired",
          },
          null,
          2
        ),
      };
    }
    if (error.name === "JsonWebTokenError") {
      return {
        statusCode: 401,
        body: JSON.stringify(
          {
            message: "Invalid token information",
          },
          null,
          2
        ),
      };
    }
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Valid token" }, null, 2),
  };
};
