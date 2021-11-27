const utils = require("../../utils/utils");
const { exception_handler } = require("../../utils/exception_handler");
const config = require("../../configuration/config");

// Database library
const User = require("../../models/User");
const Board = require("../../models/Board");

const { default: axios } = require("axios");

create_board = async (event) => {
  if (!utils.hasKeys(event.queryStringParameters, ["board_title", "author_id"]))
    return false;

  const columnElements = event.queryStringParameters;
  const result = await Board.createNewBoard(columnElements);

  if (result === false) {
    return {
      statusCode: 200,
      body: JSON.stringify(
        { message: "Some errors in createNewBoard()" },
        null,
        2
      ),
    };
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "ok" }, null, 2),
    };
  }
};

view_boards = async (event) => {
  const query = event.queryStringParameters;

  var record = undefined;
  if (typeof query === "object" && "board_id" in query) {
    // search board with id
    const { board_id, ...remainElements } = query;
    record = await Board.getBoardRecords({ board_id: board_id });
  } else {
    record = await Board.getBoardRecords(query);
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ message: record }, null, 2),
  };
};

delete_board = async (event) => {
  if (!utils.hasKeys(event.queryStringParameters, ["board_id"])) return false;

  const { board_id, ...remainElements } = event.queryStringParameters;
  const result = await Board.deleteBoardById(board_id);

  if (result === false) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "error" }, null, 2),
    };
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "ok" }, null, 2),
    };
  }
};

alarm = async (data) => {};

create_chat = async (event) => {};
view_chats = async (data) => {};
my_chats = async (data) => {};
send = async (data) => {};

/*
 * Board Database testing function is located below
 */
/*
      CREATE TABLE ${TABLE(TABLE_NAME)} (
        board_id int NOT NULL primary key,
        board_title text,
        board_contents text,
        author text,
        author_id text
        board_time timestamp
      );
*/
board_debug = async (event) => {
  await Board.initializer();
  const boardObject = {
    board_id: 1,
    board_title: "helloworld",
    board_contents: "board contents test",
    author: "admin",
    author_id: "admin_id",
    board_time: Date.now().toString(),
  };
  Board.createNewBoard(boardObject).then((result) => {
    console.log(result);
    if (result === false) {
      return {
        statusCode: 200,
        body: JSON.stringify(
          { message: "some errors in createNewBoard" },
          null,
          2
        ),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "ok " }, null, 2),
      };
    }
  });
  // render other page
};

delete_board_test = async (event) => {
  await Board.initializer();
  await Board.deleteBoardById(1);
};

get_board_test = async (event) => {
  await Board.initializer();
  var record = await Board.getBoardRecords(event.queryStringParameters, 10);

  return {
    statusCode: 200,
    body: JSON.stringify({ records: record }, null, 2),
  };
};

module.exports = {
  create_board: create_board,
  view_boards: view_boards,
  delete_board: delete_board,
  board_debug: board_debug,
  get_board_test: get_board_test,
  delete_board_test: delete_board_test,
};
