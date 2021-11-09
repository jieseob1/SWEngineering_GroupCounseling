module.exports.login = async (data) => {};
module.exports.register = async (data) => {};
module.exports.check = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        input: event,
      },
      null,
      2
    ),
  };
};
module.exports.delete = (data) => {};
module.exports.token_check = async (data) => {};
