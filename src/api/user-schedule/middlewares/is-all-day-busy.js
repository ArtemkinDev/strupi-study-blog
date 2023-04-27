'use strict';

/**
 * `is-all-day-busy.middleware` middleware
 */

const moment = require('moment');

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const { startTime, endTime, isAllDay } = ctx.request.body.data;

    if (isAllDay) {
      const startDay = moment(startTime).startOf('day').format('YYYY-MM-DD HH:mm');
      const lastDay = moment(endTime).endOf('day').format('YYYY-MM-DD HH:mm');

      ctx.request.body.data.startTime = startDay;
      ctx.request.body.data.endTime = lastDay;
    }

    await next();
  };
};
