const fs = require('fs-extra');

fs.copy('views', 'dist/views', {clobber: true});
