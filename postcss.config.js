module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*', '!border-radius'],
      selectorBlackList: [/ignore$/, /bb1$/],
    },
  },
};
