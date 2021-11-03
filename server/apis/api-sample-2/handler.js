'use strict';

module.exports.hello_2 = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'sample 2 excute success!',
        input: event,
      },
      null,
      2
    ),
  };
};
