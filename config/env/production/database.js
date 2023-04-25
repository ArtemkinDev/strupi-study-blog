const { parse } = require('pg-connection-string');

module.exports = ({ env }) => {
  const { host, port, database, user, password } = parse(env('DATABASE_PRODUCTION_CONNECTION_STRING'));

  return {
    connection: {
      client: 'postgres',
      connection: {
        host,
        port,
        database,
        user,
        password,
        ssl: env.bool('DATABASE_SSL', false),
      },
      debug: false,
    },
  };
};
