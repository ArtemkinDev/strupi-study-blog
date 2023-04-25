module.exports = [
  {
    method: 'GET',
    path: '/repos',
    handler: 'getReposController.index',
    config: {
      policies: [
        'admin::isAuthenticatedAdmin',
        {
          name: 'admin::hasPermissions',
          config: {
            actions: ['plugin::github-projects.repos.read'],
          },
        },
      ],
    },
  },
  {
    method: 'POST',
    path: '/project',
    handler: 'projectController.create',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
];
