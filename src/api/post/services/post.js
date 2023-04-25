"use strict";

/**
 * post service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::post.post", ({ strapi }) => ({
  // Method 1: Creating an entirely new custom service
  async exampleService(...args) {
    let response = { okay: true };

    if (response.okay === false) {
      return { response, error: true };
    }

    return response;
  },

  // Method 2: Wrapping a core service (leaves core logic in place)
  async find(...args) {
    // Calling the default core controller
    const { results, pagination } = await super.find(...args);

    // some custom logic
    results.forEach((result) => {
      result.counter = 1;
    });

    return { results, pagination };
  },

  async getPublicPosts(queryObj) {
    const filters = queryObj.filters ? queryObj.filters : {};

    if (filters && filters.premium) delete filters.premium;

    const query = {
      ...queryObj,
      filters: {
        ...filters,
        $or: [
          {
            premium: false,
          },
          {
            premium: {
              $null: true,
            },
          },
        ],
      },
    };

    return strapi.entityService.findPage(
      "api::post.post",
      this.getFetchParams(this._createQueryParamsForPublicUsers(queryObj))
    );
  },

  async findPublicPostById(entityId, params = {}) {
    return strapi.entityService.findOne(
      "api::post.post",
      entityId,
      this.getFetchParams(this._createQueryParamsForPublicUsers(params))
    );
  },

  async likePost(userId, postId, query) {
    const post = await strapi.entityService.findOne("api::post.post", postId, {
      populate: ["likedBy"],
    });
    let likedBy = post && post.likedBy ? post.likedBy : [];

    if (likedBy.length && likedBy.find((user) => user.id === userId)) {
      const index = likedBy.findIndex((user) => user.id === userId);
      likedBy.splice(index, 1);
    } else {
      likedBy = [...likedBy, userId];
    }

    const updatedPost = await strapi.entityService.update(
      "api::post.post",
      postId,
      {
        data: {
          likedBy,
        },
        ...query,
      }
    );

    return updatedPost;
  },

  _createQueryParamsForPublicUsers(queryObj) {
    const filters = queryObj.filters ? queryObj.filters : {};

    if (filters && filters.premium) delete filters.premium;

    const query = {
      ...queryObj,
      filters: {
        ...filters,
        $or: [
          {
            premium: false,
          },
          {
            premium: {
              $null: true,
            },
          },
        ],
      },
    };

    return query;
  },
}));
