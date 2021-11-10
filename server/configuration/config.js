const DEBUG_MODE = true;

// Database initialize configuration
const config = {
  host: "groupcounseling-db.cun0dhxklfbi.us-east-1.rds.amazonaws.com",
  user: "gc_manager",
  password: "groupcounseling2021!",
  database: "postgres",
};

module.exports = {
  DEBUG_MODE: DEBUG_MODE,
  config: config,
};
