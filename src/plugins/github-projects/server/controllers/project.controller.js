'use strict';
const { sanitize } = require('@strapi/utils/lib/index');

module.exports = ({ strapi }) => ({
  async create(ctx) {
    const repo = ctx.request.body;
    const newProject = await strapi.plugin('github-projects').service('projectService').create(repo, ctx.state.user.id);
    const { auth } = ctx.state;
    const data = await sanitize.contentAPI.output(newProject, strapi.getModel('plugin::github-projects.project'), {
      auth,
    });

    return data;
  },
});
