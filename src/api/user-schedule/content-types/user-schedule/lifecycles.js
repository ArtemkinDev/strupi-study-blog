const { ForbiddenError } = require('@strapi/utils/lib').errors;

module.exports = {
  async beforeCreate(event) {
    const { data, where, select, populate } = event.params;
    let userId = data.user.connect && data.user.connect[0]?.id ? data.user.connect[0].id : null;
    console.log(data);
    userId = data.user && !userId ? data.user : null;
    console.log(userId);
    if (!userId) throw new ForbiddenError('Please choose user!');

    const { startTime, endTime } = data;
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
      throw new ForbiddenError('You have events at this time. Please choose other time period!');
    }

    throw new ForbiddenError('Test error');
  },
};
