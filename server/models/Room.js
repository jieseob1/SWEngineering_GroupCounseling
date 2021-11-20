const config = require("../configuration/config");

const { PostgreSQL } = require("fxsql");
const { CONNECT } = PostgreSQL;

const POOL = CONNECT(config.db_config);
const { QUERY, VALUES, TABLE, EQ } = POOL;

const TABLE_NAME = "room_info";

async function createRoomTable() {
    try {
        /*
         * room_id : 방번호, Primary Key로 등록되어 방번호 순서가 기준
         * owner_name : 해당 방을 개설한 사람의 이름 (이름 말고 토큰을 넣을까?)
         * category : 해당 방의 카테고리 종류
         * is_multiple : 여러명이 들어올 수 있는 방인가 아닌가
         * user_list : 현재 해당 방에 소속된 유저의 명단 (토큰을 기록해야하나?)
        */
        await QUERY`
        CREATE TABLE ${TABLE(TABLE_NAME)} (
            room_id SERIAL PRIMARY_KEY,
            owner_name text,
            category text,
            is_multiple integer,
            user_list text[],

        )
        `
    }
}