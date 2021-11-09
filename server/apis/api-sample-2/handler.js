const config = {
  host: 'groupcounseling-db.cun0dhxklfbi.us-east-1.rds.amazonaws.com',
  user: 'gc_manager',
  password: 'groupcounseling2021!',
  database: 'postgres'
}

const { PostgreSQL } = require('fxsql');
const { CONNECT } = PostgreSQL;

const POOL = CONNECT(config);

const { QUERY } = POOL;

module.exports.hello_2 = async (event) => {
  let error = 0;
  try {
    const list = await QUERY`SELECT * FROM sample`;
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: list,
          input: event,
        },
        null,
        2
      ),
    };
  } catch (err) {
    error = 1;
  }
};
