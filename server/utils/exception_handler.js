function create_message(status, message) {
  return {
    statusCode: 200,
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
