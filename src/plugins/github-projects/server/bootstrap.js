'use strict';

const RBAC_ACTIONS = [
  {
    section: 'plugins',
    displayName: 'View and access the plugin',
    uid: 'use',
    pluginName: 'github-projects',
  },
  {
    section: 'plugins',
    subCategory: 'Repositories',
    displayName: 'Read github repositories',
    uid: 'repos.read',
    pluginName: 'github-projects',
  },
];

module.exports = async ({ strapi }) => {
  await strapi.admin.services.permission.actionProvider.registerMany(RBAC_ACTIONS);
};
