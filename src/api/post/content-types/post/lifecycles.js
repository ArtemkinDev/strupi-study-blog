module.exports = {
    beforeCreate(event) {
        const { data, where, select, populate } = event.params;

        console.log(event)
    },

    afterCreate(event) {
        const { result, params } = event;

        console.log(event)
    },
};
