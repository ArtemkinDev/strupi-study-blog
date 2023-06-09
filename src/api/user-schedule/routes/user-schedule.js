'use strict';

/**
 * user-schedule router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::user-schedule.user-schedule', {
  config: {
    create: {
      middlewares: ['api::user-schedule.is-all-day-busy'],
    },
  },
});
