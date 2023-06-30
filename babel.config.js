module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo']
  };
}

// This can be added to hide the API-KEY changes
// };
// module.exports = function (api) {
//   api.cache(true);
//   return {
//   presets: ["babel-preset-expo"],
//   plugins: [
//     [
//       "module:react-native-dotenv",
//       {
//         moduleName: "@env",
//         path: ".env",
//       },
//     ],
//   ],
//   };
//   };