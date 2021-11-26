const config = require("../configuration/config");

const { PostgreSQL } = require("fxsql");
const { CONNECT } = PostgreSQL;

const POOL = CONNECT(config.db_config);

const { QUERY, VALUES, TABLE, EQ } = POOL;

const TABLE_NAME = "user_info";

/*
 * createUserTable()
 * development comment
 ** 사실 매 실행마다 createUserTable()을 부르는식으로 접근하면
 ** PostgreSQL에서는 에러를 반환하더라도 실행에 문제가 없기 때문에 내버려두지만
 ** 만일 코드의 리팩토링을 하게 된다면 테이블이 존재하는지 확인한 뒤에
 ** 실행하도록 코드를 변경하는 것도 필요할 것
 */
async function createUserTable() {
  try {
    await QUERY`
      CREATE TABLE ${TABLE(TABLE_NAME)} (
        username varchar(256),
        password varchar(256)
      );
    `;
    console.log("[DB Info] createUserTable() Done");
  } catch (err) { }
}

async function deleteUserTable() {
  try {
    await QUERY`
      DROP TABLE ${TABLE(TABLE_NAME)}o
    `;
    console.log("[DB Info] deleteUserTable() Done");
  } catch (err) { }
}

/*
 * insertOne()
 * development comment
 ** 패스워드 저장시에 해싱을 어떤 알고리즘으로 할지 정해야함
 */
async function insertOne(object) {
  try {
    await QUERY`
      INSERT INTO ${TABLE(TABLE_NAME)} ${VALUES(object)};
    `;
  } catch (err) {
    console.log(err);
  }
}

async function findOne(object) {
  const { username, password } = object;
  try {
    var _fetched = await QUERY`
    SELECT username FROM ${TABLE(
      TABLE_NAME
    )} WHERE username=${username} AND password=${password} LIMIT 1
    `;
  } catch (err) {
    console.log(err);
  }
  return _fetched || [];
}

//
async function deleteOne(object) {
  const test = `
  DELETE FROM ${TABLE(TABLE_NAME)} WHERE ${EQ(object)}
  `;
  console.log(test);
  try {
    await QUERY`
    DELETE FROM ${TABLE(TABLE_NAME)} WHERE ${EQ(object)}
    `;
  } catch (err) {
    console.log(err);
  }
  return;
}

if (config.DEBUG_MODE) {
  module.exports.insertOne = insertOne;
  module.exports.findOne = findOne;
  module.exports.createUserTable = createUserTable;
  module.exports.deleteUserTable = deleteUserTable;
}

module.exports.insertNewUser = async (object) => {
  try {
    const _fetched = await findOne(object);
    if (_fetched.length >= 1) {
      return false;
    }
    await insertOne(object);
  } catch (err) {
    console.log(err);
  }
  return true;
};

module.exports.deleteUser = async (object) => {
  try {
    const _fetched = await findOne(object);
    if (_fetched.length < 1) {
      return false;
    }
    await deleteOne(object);
  } catch (err) {
    console.log(err);
  }
  return true;
};

module.exports.findUserRecords = async (object) => {
  try {
    var _fetched = await findOne(object);
  } catch (err) {
    console.log(err);
  }
  return _fetched || [];
};
