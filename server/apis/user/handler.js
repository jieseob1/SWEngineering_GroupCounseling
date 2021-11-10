const utils = require("../../utils/utils");
const { exception_handler } = require("../../utils/exception_handler");
const config = require("../../configuration/config");

// Database library
const User = require("../../models/User");

module.exports.login = async (data) => {};
module.exports.register = async (data) => {};
module.exports.check = async (event) => {
  const _queryParam = event.queryStringParameters;

  if (!utils.hasKeys(_queryParam, ["username", "password"])) {
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
module.exports.delete = (data) => {};
module.exports.token_check = async (data) => {};

/*
module.exports.hello_2 = async (event) => {
  let error = 0;
  try {
    const list = await QUERY`SELECT * FROM sample`;
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: list,
          input: event,
        },
        null,
        2
      ),
    };
  } catch (err) {
    error = 1;
  }
};

*/
