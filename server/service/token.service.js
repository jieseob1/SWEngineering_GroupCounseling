const config = require("config.json");
const jwt = require("jsonwebtoken");

module.exports = {
  get_jwt_token,
};

async function get_jwt_token(user_info) {
  const { userid, password } = user_info;
  const token = jwt.sign(
    { userid: userid, password: password_hash },
    config.secret,
    { expiresIn: "7d" }
  );

  return { ...withoutPassword(user_info), token };
}

function withoutPassword(userinfo) {
  const { password, ...withoutPasswordInfo } = userinfo;
  return withoutPasswordInfo;
}
