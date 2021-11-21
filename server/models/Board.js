const config = require("../configuration/config");

const { PostgreSQL } = require("fxsql");
const utils = require("../utils/utils");
const { CONNECT } = PostgreSQL;

const POOL = CONNECT(config.db_config);

const { QUERY, VALUES, TABLE, EQ, SET, ROLLBACK } = POOL;

const TABLE_NAME = "board_list";

async function createBoardTable() {
  try {
    await QUERY`
      CREATE TABLE ${TABLE(TABLE_NAME)} (
        board_id int NOT NULL primary key,
        board_title text,
        board_contents text,
        author text,
        author_id text
        board_time timestamp
      );
    `;
    console.log("[DB Info] createBoardTable() Done");
  } catch (err) {}
}

async function deleteBoardTable() {
  try {
    await QUERY`
      DROP TABLE ${TABLE(TABLE_NAME)}
    `;
    console.log("[DB Info] deleteBoardTable() Done");
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

async function checkBoardbyId(board_id) {
  try {
    var fetched = await QUERY`
          SELECT count(*) FROM ${TABLE(TABLE_NAME)} WHERE board_id=${board_id}`;
  } catch (err) {}
  if (fetched !== undefined && fetched != null) {
    if (fetched.length === 0) return false;
    return true;
  } else {
    return false;
  }
}

module.exports.createNewBoard = async function createNewBoard(board_info) {
  if (
    !utils.hasKeys(board_info, ["board_title", "board_contents", "author_id"])
  ) {
    console.log("createNewBoard() key error..");
    return false;
  }
  try {
    // need to append board_id generation logic
    return await insertOne(board_info);
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports.deleteBoardById = async function deleteBoardById(board_id) {
  try {
    if (await checkBoardbyId(board_id)) {
      return await deleteOne(board_id);
    }
  } catch (err) {
    console.log(err);
  }
  return false;
};

module.exports.modifyBoardById = async function modifyBoardById(
  board_id,
  modified_obj
) {
  try {
    if (await checkBoardbyId(board_id)) {
      await QUERY`
            UPDATE ${TABLE(TABLE_NAME)} ${SET(
        modified_obj
      )} WHERE board_id=${board_id}
            `;
      await ROLLBACK();
      return true;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};
