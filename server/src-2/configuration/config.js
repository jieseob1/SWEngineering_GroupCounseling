const DEBUG_MODE = true;

// Database initialize configuration
const database_config = {
  host: "groupcounseling-db.cun0dhxklfbi.us-east-1.rds.amazonaws.com",
  user: "gc_manager",
  password: "groupcounseling2021!",
  database: "postgres",
};

const server_info = {
  host: "localhost:3000",
};

module.exports = {
  DEBUG_MODE: DEBUG_MODE,
  db_config: database_config,
  server_info: server_info,
  server_url: `http://${server_info.host}`,
};
