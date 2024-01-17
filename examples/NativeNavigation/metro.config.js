const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const dxaPath =
    '/Users/davidvigaraarmenteros/development/projects/reactnative-projects/dxa-react-native-sdk';


/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
    resolver:{
        nodeModulesPaths: [dxaPath],
    },
    watchFolders: [dxaPath],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
