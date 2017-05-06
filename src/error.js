const contextExtend = 15

function highlight (inp) {
  return '\x1b[46m\x1b[30m ' + inp + ' \x1b[0m'
}

function heading (inp) {
  return '\x1b[41m\x1b[37m ' + inp + ' \x1b[0m'
}

class BrainfuckError {
  constructor (program, section, message, type) {
    let start = (section.start - contextExtend) < 0 ? 0 : (section.start - contextExtend)
    let end = (section.start + contextExtend) >= program.length ? program.length : (section.start + contextExtend)

    this.message = message
    this.section = section
    this.type = type || 'Syntax'
    this.highlight = program.slice(section.start, section.end)
    this.context = {
      start: program.slice(start, section.start),
      end: program.slice(section.end, end)
    }


    let out = '\n\n' + heading(this.type) + ' ' + highlight(this.message) + '\n'
    out += 'character: ' + this.section.start + '\n'
    out += this.context.start
    out += '↳  ' + highlight(this.highlight)
    out += this.context.end + '\n'

    return {
      name: 'Unfuck Error',
      message: out
    }
  }
}

module.exports = BrainfuckError
