const util = require('util')
const chalk = require('chalk')

module.exports = (tag = 'app') => {
  const format = (fmt, ...args) => util.format(`[${tag}] ${fmt}`, ...args)
  return {
    info() {
      console.info(chalk.cyanBright(format(...arguments)))
    },
    log() {
      console.log(chalk.whiteBright(format(...arguments)))
    },
    error() {
      console.error(chalk.redBright(format(...arguments)))
    },
    warn() {
      console.warn(chalk.yellowBright(format(...arguments)))
    },
  }
}
