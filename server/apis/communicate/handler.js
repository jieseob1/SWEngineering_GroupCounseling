const utils = require("../../utils/utils");
const { exception_handler } = require("../../utils/exception_handler");
const { success, error } = require("../../utils/exception_handler");
const config = require("../../configuration/config");

// Database library
const User = require("../../models/User");
const Board = require("../../models/Board");
const Room = require("../../models/Room");
const Chat = require("../../models/Chat");

const { default: axios } = require("axios");
const querystring = require("querystring");
const jwt = require("jsonwebtoken");

create_board = async (event) => {
  const parameters = event.queryStringParameters;
  if (!utils.hasKeys(parameters, ["board_title", "author_id"])) {
    return error("access error");
  }
  // const parameters = querystring.stringify(event.body);
  const result = await Board.createNewBoard(parameters);

  if (result === false) {
    return error("Some errors in create_board handler");
  } else {
    return success("ok");
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
  return success({ message: record });
};

delete_board = async (event) => {
  const query = event.queryStringParameters;
  // const query = querystring.stringify(event.body);
  if (!utils.hasKeys(query, ["board_id"])) {
    return error("access error");
  }

  const { board_id, ...remainElements } = query;
  const result = await Board.deleteBoardById(board_id);

  if (result === false) {
    return error("error");
  } else {
    return success("ok");
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

  if (result === false) {
    return error("Some errors in create_chat_room handler");
  }
  return success("ok");
};

delete_chat_room = async (event) => {
  const { room_id, ...remains } = event.queryStringParameters;
  // const { room_id, ...remains } = querystring.stringify(event.body);
  const delete_status = await Room.deleteRoomById(room_id);

  var message = undefined;
  if (delete_status === false) {
    return error("Some errors in delete_chat_room handler");
  }
  return success("ok");
};

join_chat_room = async (event) => {
  // 지금은 username이라고 되어있지만, 이후에 토큰 기능 활성화 되면, 토큰 복호화 한 결과에서
  // username 항목 추출해서 사용하도록 변경할 필요가 있음
  const { userid, room_id } = event.queryStringParameters;
  // const { userid, room_id } = querystring.stringify(event.body);

  const status = await Room.appendUserToRoom(room_id, userid);

  if (status === false) {
    return error("Some errors in join_chat_room handler");
  }
  return success("ok");
};

leave_chat_room = async (event) => {
  // 해당 함수는 특정 사용자가 룸을 떠나고 싶을 때 쓰는 함수
};

// Chat log functions

save_chat_log = async (event) => {
  const { userid, room_id, contents } = event.queryStringParameters;
  const joined = await Room.isUserJoined({
    userid: userid,
    room_id: parseInt(room_id),
  });

  if (joined) {
    const save_info = {
      userid: userid,
      room_id: parseInt(room_id),
      contents: contents,
    };
    const status = await Chat.sendMessage(save_info);

    if (!status) {
      return error("Some errors in save_chat_log handler");
    }
  } else {
    return error("You are not joined this room");
  }
  return success("ok");
};

get_chat_log = async (event) => {
  const { userid, room_id, rows } = event.queryStringParameters;

  const joined = await Room.isUserJoined({
    userid: userid,
    room_id: parseInt(room_id),
  });

  if (joined) {
    const fetched = await Chat.receiveMessage(
      { room_id: room_id },
      parseInt(rows)
    );
    return success({ message: fetched });
  } else {
    return error("You are not joined this room");
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////

/*
 * Room Database testing function is located below
 */

room_join_test = async (event) => {
  // await Room.initializer();
  const obj = {
    room_title: "This is test room",
    room_description: "this is test description",
    // joined_users: "{admin}"
  };

  const result = await Room.createNewRoom(obj);
  if (result === false) {
    return error("You cannot join this room");
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
  if ((await Room.isUserJoined(testObj)) === false) {
    // Can join
    const join_result = await Room.appendUserToRoom(testObj);
    if (join_result === false) {
      console.log("Something errors in appendUserToRoom");
    } else {
      console.log("Join test");
      console.log(await Room.isUserJoined(testObj));
      console.log(await Room.findRoomByInfo(obj));
    }
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "ok" }, null, 2),
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

/*
 * Chat Logging debug functions are below
 */
/*
async function createChatTable() {
  try {
    await QUERY`
      CREATE TABLE ${TABLE(TABLE_NAME)} (
        room_id int NOT NULL,
        index int NOT NULL primary key,
        userid text NOT NULL,
        receive_time timestamp default now(),
        contents text
      );
    `;
    console.log("[DB Info] createChatTable() Done");
  } catch (err) {}
}
*/
sendmessage_test = async (event) => {
  await Chat.initialize();

  const obj = {
    room_id: 1,
    userid: "admin",
    contents: "hello?",
  };

  const result = await Chat.sendMessage(obj);
  if (result === false) {
    console.log("Something errors in sendMessage");
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "ok" }, null, 2),
  };
};

receivemessage_test = async (event) => {
  const obj = {
    room_id: 1,
  };

  const result = await Chat.receiveMessage(obj, 10);
  if (result === undefined) {
    console.log("Something errors in receiveMessage");
  }
  console.log(result);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "ok" }, null, 2),
  };
};

module.exports = {
  create_board: create_board,
  view_boards: view_boards,
  delete_board: delete_board,

  create_chat_room: create_chat_room,
  delete_chat_room: delete_chat_room,
  join_chat_room: join_chat_room,

  save_chat_log: save_chat_log,
  get_chat_log: get_chat_log,
};
