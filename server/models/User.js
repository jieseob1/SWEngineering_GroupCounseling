const config = require("../configuration/config");

const { PostgreSQL } = require("fxsql");
const { CONNECT } = PostgreSQL;

const POOL = CONNECT(config.config);

const { QUERY, VALUES } = POOL;

const TABLE_NAME = "user_info";

/*
 * createUserTable()
 * development comment
 ** 사실 매 실행마다 createUserTable()을 부르는식으로 접근하면
 ** PostgreSQL에서는 에러를 반환하더라도 실행에 문제가 없기 때문에 내버려두지만
 ** 만일 코드의 리팩토링을 하게 된다면 테이블이 존재하는지 확인한 뒤에
 **실행하도록 코드를 변경하는 것도 필요할 것
 */
async function createUserTable() {
  try {
    await QUERY`
      CREATE TABLE ${TABLE_NAME} (
        username varchar(256),
        password varchar(256)
      );
    `;
    console.log("[DB Info] createUserTable() Done");
  } catch (err) {
    console.log(err);
  }
}

async function deleteUserTable() {
  try {
    await QUERY`
      DROP TABLE ${TABLE_NAME}
    `;
    console.log("[DB Info] deleteUserTable() Done");
  } catch (err) {
    console.log(err);
  }
}

module.exports.insertOne = async (object) => {
  const data = { username: "test", password: "test" };
  console.log(await VALUES(data));
  try {
    await QUERY`
      INSERT INTO ${TABLE_NAME} ${VALUES(object)};
    `;
    console.log("ok");
  } catch (err) {
    console.log(err);
  }
};

module.exports.findOne = async (object) => {
  let error = 0;
  const { username, password } = object;
  try {
    const _fetched = await QUERY`SELECT username FROM user_db LIMIT 1`;
    console.log(_fetched);
  } catch (err) {
    error = 1;
    console.log(err);
  }
};

if (config.DEBUG_MODE) {
  module.exports.createUserTable = createUserTable;
  module.exports.deleteUserTable = deleteUserTable;
}
