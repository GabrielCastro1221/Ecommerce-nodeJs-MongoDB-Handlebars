const { Command } = require("commander");
const program = new Command();

program.option("--mode <mode>", "Enviroment", "build").option("-p <port>", "Server port", 8080);
program.parse();

module.exports = program;
