"use strict";

/**
 * post controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const Errors = require("./../../../common/const/errors");

module.exports = createCoreController("api::post.post", ({ strapi }) => ({
  // Method 1: Creating an entirely custom action
  async getCustomPosts(ctx) {
    try {
      ctx.body = "ok";
    } catch (err) {
      ctx.body = err;
    }
  },

  // Method 2: Wrapping a core action (leaves core logic in place)
  async find(ctx) {
    if (ctx.state.user) return await super.find(ctx);

    const sanitizedQueryParams = await this.sanitizeQuery(ctx);

    const { results, pagination } = await strapi
      .service("api::post.post")
      .getPublicPosts(sanitizedQueryParams);
    const data = await this.sanitizeOutput(results, ctx);

    return this.transformResponse(data, { pagination });
  },

  // Method 3: Replacing a core action with proper sanitization
  async findOne(ctx) {
    const { id } = ctx.params;

    if (ctx.state.user) return await super.findOne(ctx);

    const sanitizedQueryParams = await this.sanitizeQuery(ctx);
    const { results, pagination } = await strapi
      .service("api::post.post")
      .findPublicPostById(id, sanitizedQueryParams);
    const data = await this.sanitizeOutput(results, ctx);

    return this.transformResponse(data, { pagination });
  },

  async likePost(ctx) {
    if (!ctx.state.user) return ctx.forbidden(Errors.Forbidden);

    const userId = ctx.state.user.id;
    const postId = ctx.params.id;
    const query = await this.sanitizeQuery(ctx);
    
    const updatedPost = await strapi
      .service("api::post.post")
      .likePost(userId, postId, query);

    const sanitizedResults = await this.sanitizeOutput(updatedPost, ctx);

    return this.transformResponse(sanitizedResults, {});
  },
}));
