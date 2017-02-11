var nullable = ['SFT', 'MOV'];

function nullify ( settings, ast ) {
  return ast.reduce(( acc, ins ) => {
    if (ins.is === 'IF') {
      acc.push({
        is: 'IF',
        body: nullify(settings, ins.body)
      });
    } else if (nullable.indexOf(ins.is) !== -1) {
      if (ins.body !== 0) {
        acc.push(ins);
      }
    } else {
      acc.push(ins);
    }
    return acc;
  }, []);
}

module.exports = nullify;
