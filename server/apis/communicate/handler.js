const utils = require("../../utils/utils");
const { exception_handler } = require("../../utils/exception_handler");
const config = require("../../configuration/config");

// Database library
const User = require("../../models/User");
const Board = require("../../models/Board");
const Room = require("../../models/Room");

const { default: axios } = require("axios");
const querystring = require("querystring");

create_board = async (event) => {
  if (!utils.hasKeys(event.queryStringParameters, ["board_title", "author_id"]))
    return false;

  const columnElements = event.queryStringParameters;
  // const columnElements = querystring.stringify(event.body);
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
  // const query = querystring.stringify(event.body);

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
  const query = event.queryStringParameters;
  // const query = querystring.stringify(event.body);
  if (!utils.hasKeys(query, ["board_id"])) return false;

  const { board_id, ...remainElements } = query;
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

/*
 * @ Room Database Schema
 */
/*
        room_id int generated always as identity primary key,
        room_title text,
        room_description text,
        create_time timestamp,
        joined_users text[]
*/

create_chat_room = async (event) => {
  const room_info = event.queryStringParameters;
  // const room_info = querystring.stringify(event.body);
  const result = await Room.createNewRoom(room_info);

  var message = undefined;
  if (result === false) {
    message = "Some errors in creating chat room";
  } else {
    message = "ok";
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ message: message }, null, 2),
  };
};
delete_chat_room = async (event) => {
  const { room_id, ...remains } = event.queryStringParameters;
  // const { room_id, ...remains } = querystring.stringify(event.body);
  const delete_status = await Room.deleteRoomById(room_id);

  var message = undefined;
  if (delete_status === false) {
    message = "Some errors in deleting chat room";
  } else message = "ok";

  return {
    statusCode: 200,
    body: JSON.stringify({ message: message }, null, 2),
  };
};
join_chat_room = async (event) => {
  // 지금은 username이라고 되어있지만, 이후에 토큰 기능 활성화 되면, 토큰 복호화 한 결과에서
  // username 항목 추출해서 사용하도록 변경할 필요가 있음
  const { userid, room_id } = event.queryStringParameters;
  // const { userid, room_id } = querystring.stringify(event.body);

  const status = await Room.appendUserToRoom(userid, room_id);

  var message = undefined;
  if (status === false) {
    message = "Some errors in joining chat room";
  } else message = "ok";

  return {
    statusCode: 200,
    body: JSON.stringify({ message: message }, null, 2),
  };
};
leave_chat_room = async (event) => {
  // 해당 함수는 특정 사용자가 룸을 떠나고 싶을 때 쓰는 함수
};

/*
 * Room Database testing function is located below
 */

room_join_test = async (event) => {
  await Room.initializer();
  const obj = {
    room_title: "This is test room",
    room_description: "this is test description",
    // joined_users: "{admin}"
  };

  const result = await Room.createNewRoom(obj);
  if (result === false) {
    console.log("there is some errors in createNewRoom");
  }
  const room_fetched = await Room.findRoomByInfo(obj);
  const room_id = room_fetched[0].room_id;

  const testObj = {
    room_id: room_id,
    userid: "admin",
  };
  var message = undefined;
  switch (await Room.isUserJoined(testObj)) {
    case true:
      message = "Already joined";
      break;
    case false:
      message = "You can join this room";
      break;
    case undefined:
      message = "You cannot join this room";
      break;
    default:
      message = "Something errors..";
      break;
  }
  console.log("here");
  return {
    statusCode: 200,
    message: JSON.stringify({ message: message }, null, 2),
  };
};

room_debug = async (event) => {
  await Room.initializer();

  const obj = {
    room_title: "this is test room",
    room_description: "this is test description",
    joined_users: "{aaa}",
  };

  const result = await Room.createNewRoom(obj);
  if (result === false) {
    console.log("there is some errors in createNewRoom");
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "ok" }, null, 2),
  };
};

get_room_test = async (event) => {
  const obj = event.queryStringParameters;
  const result = await Room.findRoomByInfo(obj);
  if (result !== false) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: result }, null, 2),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "error" }, null, 2),
  };
};

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

  room_debug: room_debug,
  get_room_test: get_room_test,
  room_join_test: room_join_test,

  create_chat_room: create_chat_room,
  delete_chat_room: delete_chat_room,
  join_chat_room: join_chat_room,

  board_debug: board_debug,
  get_board_test: get_board_test,
  delete_board_test: delete_board_test,
};
