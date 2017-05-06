const contextExtend = 15

function highlight (inp) {
  return '\x1b[46m\x1b[30m' + inp + '\x1b[0m'
}

function heading (inp) {
  return '\x1b[41m\x1b[37m' + inp + '\x1b[0m'
}

class BrainfuckError {
  constructor (program, section, message) {
    let start = (section.start - contextExtend) < 0 ? 0 : (section.start - contextExtend)
    let end = (section.start + contextExtend) >= program.length ? program.length - 1 : (section.start + contextExtend)

    this.message = message
    this.section = section
    this.highlight = program.slice(section.start, section.end)
    this.context = {
      start: program.slice(start, section.start),
      end: program.slice(section.end, end)
    }
  }

  throw () {
    let out = heading(' BRAINFUCK ERROR ') + '\n'
    out += 'chr: ' + this.section.start + '\n'
    out += this.context.start
    out += highlight(this.highlight)
    out += this.context.end + '\n'
    out += 'Unfuck: ' + this.message
    console.log(out)
  }
}

module.exports = BrainfuckError
