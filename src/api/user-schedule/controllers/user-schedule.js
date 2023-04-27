'use strict';

const Errors = require('../../../common/const/errors');
/**
 * user-schedule controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-schedule.user-schedule', ({ strapi }) => ({
  async find(ctx) {
    if (!ctx.state.user) return ctx.forbidden(Errors.Forbidden);

    const userId = ctx.state.user.id;

    const sanitizedQueryParams = await this.sanitizeQuery(ctx);

    const { results, pagination } = await strapi
      .service('api::user-schedule.user-schedule')
      .getUserSchedule(sanitizedQueryParams, userId);
    const data = await this.sanitizeOutput(results, ctx);

    return this.transformResponse(data, { pagination });
  },

  // async create(ctx) {
  //   console.log(ctx.request.body);
  //   return true;
  // },
}));
