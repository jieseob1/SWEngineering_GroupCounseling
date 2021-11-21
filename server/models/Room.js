const config = require("../configuration/config");

const { PostgreSQL } = require("fxsql");
const utils = require("../utils/utils");
const { CONNECT } = PostgreSQL;

const POOL = CONNECT(config.db_config);

const { QUERY, VALUES, TABLE, EQ } = POOL;

const TABLE_NAME = "room_list";

async function createRoomTable() {
  try {
    await QUERY`
      CREATE TABLE ${TABLE(TABLE_NAME)} (
        room_id int NOT NULL,
        room_title text,
        room_description text,
        create_time timestamp primary key,
        joined_users text[]
      );
    `;
    console.log("[DB Info] createRoomTable() Done");
  } catch (err) {}
}

async function deleteRoomTable() {
  try {
    await QUERY`
      DROP TABLE ${TABLE(TABLE_NAME)}
    `;
    console.log("[DB Info] deleteRoomTable() Done");
  } catch (err) {}
}

async function insertOne(object) {
  try {
    await QUERY`
        INSERT INTO ${TABLE(TABLE_NAME)} ${VALUES(object)};
      `;
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
}

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
    return false;
  }
  return true;
}

async function checkRoombyId(room_id) {
  try {
    var fetched = await QUERY`
        SELECT count(*) FROM ${TABLE(TABLE_NAME)} WHERE room_id=${room_id}`;
  } catch (err) {}
  if (fetched !== undefined && fetched != null) {
    if (fetched.length !== 0) return false;
    return true;
  } else {
    return false;
  }
}

module.exports.createNewRoom = async function createNewRoom(newroom_info) {
  const { room_id } = newroom_info;

  if (!utils.hasKeys(newroom_info, ["room_id"])) {
    return false;
  }
  try {
    if (await checkRoombyId(room_id)) {
      return await insertOne(newroom_info);
    }
  } catch (err) {
    console.log(err);
  }
  return false;
};

module.exports.deleteRoomById = async function deleteRoomById(room_id) {
  try {
    if (await checkRoombyId()) {
      return await deleteOne(room_id);
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};
