var collapsable = ['SFT', 'MOV'];

function collapse ( settings, ast ) {
  return ast.reduce(( acc, ins ) => {
    if (ins.is === 'IF') {
      acc.push({
        is: 'IF',
        body: collapse(settings, ins.body)
      });
    } else {
      let last = acc.pop();
      if (last) {
        if ((collapsable.indexOf(last.is) !== -1) && (last.is === ins.is)) {
          acc.push({
            is: ins.is,
            body: (last.body + ins.body)
          });
        } else {
          acc = acc.concat([last, ins]);
        }
      } else {
        acc.push(ins);
      }
    }
    return acc;
  }, []);
}

module.exports = collapse;
