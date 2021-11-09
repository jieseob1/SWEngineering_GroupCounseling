const User = require("../models/User");

module.exports.user_test = async (event) => {
  await User.createUserTable();
  await User.insertOne({ username: "test", password: "test" });
};
