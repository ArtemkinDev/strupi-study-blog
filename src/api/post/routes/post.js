'use strict';

/**
 * post router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;
const roles = require('./../../../common/const/roles')

module.exports = createCoreRouter('api::post.post', {
    // config: {
    //     find: {
    //         policies: [{name: 'global::check-role-for-access', config: {legalRole: roles.USER}}]
    //     }
    // }
});
