import it from './extensions/translations/it.json';

const config = {
  locales: ['it', 'fr'],
  translations: {
    it: {
      ...it,
    },
  },
};

const bootstrap = (app) => {
  console.log(app);
};

export default {
  config,
  bootstrap,
};
