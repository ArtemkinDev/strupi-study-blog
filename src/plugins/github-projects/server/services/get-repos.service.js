'use strict';
const { request } = require("@octokit/request");
const axios = require('axios');

const gitHubToken = process.env.GITHUB_PLUGIN_TOKEN;

module.exports = ({ strapi }) => ({
  async getRepos() {
    const repos = (await request("GET /user/repos", {
      headers: {
        authorization: `Bearer ${gitHubToken}`,
      },
      type: "public"
    }));

    const reposArray = repos.data.filter(repo => !!repo)

    return Promise.all(reposArray.map(r => this._createRepoResponseData(r)));
  },

  async getProjectByRepoId(repoId) {
    const project = await strapi.entityService.findMany('plugin::github-projects.project', {
      filters: {
        repositoryId: repoId,
      }
    });

    return project.length ? project[0].id : null;
  },

  async _createRepoResponseData(repo) {
    const {id, name, html_url, description} = repo;
    const readMeUrl = `https://raw.githubusercontent.com/${repo.owner.login}/${name}/${repo.default_branch}/README.md`;
    let longDescription = '';
    const projectId = await this.getProjectByRepoId(id);

    try {
      longDescription = (await axios.get(readMeUrl)).data;
    } catch (e) {
      longDescription = '';
    }

    return {
      id,
      name,
      url: html_url,
      longDescription,
      shortDescription: description,
      projectId
    }
  }
});
