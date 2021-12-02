const config = require("../configuration/config");

const { PostgreSQL } = require("fxsql");
const utils = require("../utils/utils");
const { CONNECT } = PostgreSQL;

const POOL = CONNECT(config.db_config);

const { QUERY, VALUES, TABLE, EQ } = POOL;

const TABLE_NAME = "chat_logs";

/*
 * createUserTable()
 * development comment
 ** 사실 매 실행마다 createUserTable()을 부르는식으로 접근하면
 ** PostgreSQL에서는 에러를 반환하더라도 실행에 문제가 없기 때문에 내버려두지만
 ** 만일 코드의 리팩토링을 하게 된다면 테이블이 존재하는지 확인한 뒤에
 ** 실행하도록 코드를 변경하는 것도 필요할 것
 */
async function createChatTable() {
  try {
    await QUERY`
      CREATE TABLE ${TABLE(TABLE_NAME)} (
        chat_room_id int NOT NULL,
        message_index int,
        send_userid text,
        send_time timestamp primary key default now(),
        message_contents text
      );
    `;
    console.log("[DB Info] createChatTable() Done");
  } catch (err) {}
}

async function deleteChatTable() {
  try {
    await QUERY`
      DROP TABLE ${TABLE(TABLE_NAME)}
    `;
    console.log("[DB Info] deleteChatTable() Done");
  } catch (err) {}
}

module.exports.receiveMessage = async function receiveMessage(
  object,
  rowCount = 10
) {
  const { chat_room_id } = object;
  try {
    var _fetched = await QUERY`
    SELECT * FROM ${TABLE(
      TABLE_NAME
    )} WHERE chat_room_id=${chat_room_id} LIMIT ${rowCount}`;
  } catch (err) {
    console.log(err);
  }
};

module.exports.sendMessage = async function sendMessage(object) {
  if (!utils.hasKeys(object, ["chat_room_id", "send_userid"])) {
    return false;
  }
  try {
    await QUERY`
        INSERT INTO ${TABLE(TABLE_NAME)} ${VALUES(object)}`;
  } catch (err) {
    console.log(err);
  }
  return true;
};
