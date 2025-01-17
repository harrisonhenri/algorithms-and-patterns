/**
 * This pattern is used to avoid the client classes to know so much of internal classes of the system.
 *
 * @date 21/06/2023 - 00:00:00
 *
 */

class Scanner {
  constructor(private archive: string) {}

  run() {
    console.log(`Scanning ${this.archive}`);
  }
}

class Parser {
  constructor(private s: Scanner) {}

  parse() {
    this.s.run();
    console.log("Parsing");
    return new AST();
  }
}

class AST {
  run() {
    console.log("AST");
  }
}

class CodeGenerator {
  constructor(private ast: AST) {}

  eval() {
    this.ast.run();
  }
}

class InterpreterX {
  constructor(private archive: string) {}

  eval(): void {
    const s = new Scanner(this.archive);
    const p = new Parser(s);
    const ast = p.parse();
    const code = new CodeGenerator(ast);
    code.eval();
  }
}

(() => {
  new InterpreterX("prog1.x").eval();
})();
