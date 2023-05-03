module.exports = ({ env }) => ({
  // ...
  'github-projects': {
    enabled: true,
    resolve: './src/plugins/github-projects',
  },
  'users-permissions': {
    enabled: true,
    config: {
      jwt: {
        expiresIn: env('JWT_SECRET_EXPIRES', '360s'),
      },
    },
  },
});
