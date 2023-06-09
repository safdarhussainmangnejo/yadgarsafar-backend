'use strict';

const app = require('./functions/index');

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Local app listening on port 8080!'));