function create_message(status, message) {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({ status: status, message: message }, null, 2),
  };
}

module.exports.exception_handler = async (errcode) => {
  switch (errcode) {
    case 300:
      return create_message("failed", "existing record");
    case 403:
      return create_message("failed", "missing arguments");
  }
};

module.exports.error_handler = async (error) => {
  if (error.name === "TokenExpiredError") {
    return {
      statusCode: 419,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
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
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(
        {
          message: "Invalid token information",
        },
        null,
        2
      ),
    };
  }
  return {
    statusCode: 404,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({ message: "Unknown Error Code" }, null, 2),
  };
};
