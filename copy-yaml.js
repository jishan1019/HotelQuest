const shell = require("shelljs");

// Copy the swagger.yaml file to the dist directory
shell.cp("src/swagger.yaml", "dist/");
