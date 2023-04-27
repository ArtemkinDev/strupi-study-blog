'use strict';

/**
 * `time-validation` middleware
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const userId = ctx.state.user.id;
    const { startTime, endTime } = ctx.request.body.data;
    const query = {
      filters: {
        user: userId,
        $or: [
          {
            startTime: {
              $between: [startTime, endTime],
            },
          },
          {
            endTime: {
              $between: [startTime, endTime],
            },
          },
        ],
      },
    };

    const events = await strapi.entityService.findMany('api::user-schedule.user-schedule', query);

    if (events.length) {
      return ctx.badRequest('You have events at this time. Please choose other time period!', { events });
    } else await next();
  };
};
