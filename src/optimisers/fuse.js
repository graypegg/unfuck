var fusible = ['SFT', 'MOV'];
var fuseTriggers = ['SFT', 'MOV'];

function fuseTemp (temp, causeMove) {
  if (temp.length > 0) {
    if (temp.filter((ins) => ins.is === 'MOV').length > 0) {
      let p = 0;
      let rel = temp.reduce(( acc, ins ) => {
        if (ins.is === 'MOV') {
          p += ins.body;
        } else if (ins.is === 'SFT') {
          acc.push({
            is: 'RELSFT',
            body: {
              value: ins.body,
              move: p
            }
          })
        }
        return acc;
      }, [])
      if (causeMove && (p !== 0)) {
        rel.push({
          is: 'MOV',
          body: p
        })
      }
      return rel;
    } else {
      return temp;
    }
  } else {
    return [];
  }
}

function fuse ( settings, ast, inIf ) {
  var temp = [];
  var out = ast.reduce(( acc, ins ) => {
    if (fusible.indexOf(ins.is) !== -1 && (temp.length === 0 ? fuseTriggers.indexOf(ins.is) !== -1 : true)) {
      temp.push(ins);
    } else if (ins.is === 'IF') {
      acc = acc.concat(fuseTemp(temp, true));
      temp = [];
      acc.push({
        is: 'IF',
        body: fuse(settings, ins.body, true)
      })
    } else {
      acc = acc.concat(fuseTemp(temp, true));
      temp = [];
      acc.push(ins);
    }
    return acc;
  }, []);
  out = out.concat(fuseTemp(temp, (inIf ? true : false)));
  temp = [];
  return out;
}

module.exports = fuse;
