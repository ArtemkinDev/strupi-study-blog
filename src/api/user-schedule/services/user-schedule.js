'use strict';

/**
 * user-schedule service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::user-schedule.user-schedule', ({ strapi }) => ({
  async getUserSchedule(queryObj, userId) {
    let filters = queryObj.filters ? queryObj.filters : {};

    filters.user = userId;

    const query = {
      ...queryObj,
      filters: {
        ...filters,
      },
    };

    const { results, pagination } = await super.find(query);

    return { results, pagination };
  },
}));
