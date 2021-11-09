const { findOne } = require("../models/User");

module.exports.user_test = async (event) => {
  const data = await findOne({ username: "test", password: "test" });
};
