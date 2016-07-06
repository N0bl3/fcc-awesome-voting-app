const fs = require('fs-extra');
fs.emptyDir('dist');
fs.ensureDir('dist/public/js');
fs.ensureDir('dist/public/css');
fs.ensureDir('dist/routes');
fs.ensureDir('dist/tests');
fs.ensureDir('dist/views');

fs.copy('config', 'dist/config', { clobber: true });
fs.copy('models', 'dist/models', { clobber: true });
