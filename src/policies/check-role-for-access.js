'use strict';

/**
 * `check-role-for-access` policy
 * Check if user has necessary role for current route
 */

module.exports = (policyContext, config, { strapi }) => {
    const legalRole = config.legalRole;
    const isEligible = policyContext.state.user && policyContext.state.user.role.id === legalRole;
    //console.log( policyContext.state.user)

    if (isEligible) {
        return true;
    }

    return false;
};
