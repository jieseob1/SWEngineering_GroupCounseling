const config = require("../configuration/config");

const { PostgreSQL } = require("fxsql");
const utils = require("../utils/utils");
const { CONNECT } = PostgreSQL;

const POOL = CONNECT(config.db_config);

const { QUERY, VALUES, TABLE, EQ } = POOL;

const TABLE_NAME = "room_list";

module.exports.initializer = async () => {
  await deleteRoomTable();
  await createRoomTable();
};

async function createRoomTable() {
  try {
    await QUERY`
      CREATE TABLE ${TABLE(TABLE_NAME)} (
        room_id int generated always as identity primary key,
        room_title text,
        room_description text,
        create_time timestamptz not null default now(),
        joined_users text[]
      );
    `;
    console.log("[DB Info] createRoomTable() Done");
  } catch (err) {
    if (err.code === "42P07") {
      console.log("Room Database Already Exists");
    } else {
      console.log(err);
    }
  }
}

async function deleteRoomTable() {
  try {
    await QUERY`
      DROP TABLE ${TABLE(TABLE_NAME)}
    `;
    console.log("[DB Info] deleteRoomTable() Done");
  } catch (err) {
    console.log(err);
  }
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

async function findRoomByInfo_internal(informations) {
  try {
    var fetched = await QUERY`
    SELECT * FROM ${TABLE(TABLE_NAME)} WHERE ${EQ(informations)}`;
  } catch (err) {
    console.log(err);
    return undefined;
  }
  return fetched || [];
}

async function checkRoombyId(room_id) {
  try {
    var fetched = await QUERY`
        SELECT count(*) FROM ${TABLE(TABLE_NAME)} WHERE room_id=${room_id}`;
  } catch (err) {
    console.log(err);
    return false;
  }
  if (fetched !== undefined && fetched != null) {
    if (fetched.length !== 0) return false;
    return true;
  } else {
    return false;
  }
}

module.exports.createNewRoom = async function createNewRoom(newroom_info) {
  try {
    return await insertOne(newroom_info);
  } catch (err) {
    console.log(err);
  }
  return false;
};

module.exports.deleteRoomById = async function deleteRoomById(room_id) {
  try {
    if (await checkRoombyId()) {
      return await deleteOne({ room_id: room_id });
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports.modifyRoomInfo = async ({ room_id, changedObject }) => {};

module.exports.findRoomByInfo = async (elements) => {
  try {
    const fetched = await findRoomByInfo_internal(elements);
    if (fetched === undefined) {
      console.log("something exceptions in internal function");
      return false;
    }
    return fetched;
  } catch (err) {
    console.log(err);
  }
  return false;
};
