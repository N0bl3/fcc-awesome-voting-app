const fs = require('fs-extra');
fs.emptyDirSync('dist');
fs.emptyDirSync('dist/config');
fs.emptyDirSync('dist/models');
fs.emptyDirSync('dist/public/js');
fs.emptyDirSync('dist/public/css');
fs.emptyDirSync('dist/routes');
fs.emptyDirSync('dist/tests');
fs.emptyDirSync('dist/views');

fs.copySync('config', 'dist/config');
fs.copySync('models', 'dist/models');
