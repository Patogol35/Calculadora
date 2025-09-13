export function formatExpression(raw) {
  if (!raw) return "";
  let s = raw.replace(/\s+/g, "");
  s = s.replace(/π/g, "pi");

  let prev = null;
  while (s.includes("√") && s !== prev) {
    prev = s;
    let out = "";
    let i = 0;
    const n = s.length;
    while (i < n) {
      const ch = s[i];
      if (ch === "√") {
        out += "sqrt(";
        i++;
        if (i >= n) {
          out += ")";
          break;
        }
        if (s[i] === "(") {
          let bal = 0;
          while (i < n) {
            out += s[i];
            if (s[i] === "(") bal++;
            else if (s[i] === ")") {
              bal--;
              if (bal === 0) {
                i++;
                break;
              }
            }
            i++;
          }
          out += ")";
          continue;
        }
        if (/[a-zA-Z]/.test(s[i])) {
          let name = "";
          while (i < n && /[a-zA-Z]/.test(s[i])) {
            name += s[i];
            i++;
          }
          if (i < n && s[i] === "(") {
            out += name + "(";
            i++;
            let bal = 1;
            while (i < n) {
              out += s[i];
              if (s[i] === "(") bal++;
              else if (s[i] === ")") {
                bal--;
                if (bal === 0) {
                  i++;
                  break;
                }
              }
              i++;
            }
            out += ")";
            continue;
          } else {
            out += name + ")";
            continue;
          }
        }
        let token = "";
        while (i < n && /[0-9.]/.test(s[i])) {
          token += s[i];
          i++;
        }
        if (token.length) {
          out += token + ")";
          continue;
        }
        out += ")";
      } else {
        out += ch;
        i++;
      }
    }
    s = out;
  }
  s = s.replace(/([0-9a-zA-Z\)])(?=sqrt\()/g, "$1*");
  return s;
}
