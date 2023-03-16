/**
 * @fileoverview this.$refs.{{name}} need to judge null
 * @author yaoxfly
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/refs-judage-null"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const ruleTester = new RuleTester();
ruleTester.run("refs-judage-null", rule, {
  // success
  valid: [
    // give me some code that won't trigger a warning
    `this.$refs.ff && this.$refs.ff.gg()`,
    `true && this.$refs.ff && this.$refs.ff.gg()`,
    ` if(true && this.$refs.aa && this.$refs.bb && true ) {
        this.$refs.aa.gg()
        this.$refs.bb.gg()
      }`
  ],

  // error
  invalid: [
    {
      code:
        ` if( true && this.$refs.aa && this.$refs.bb && true ) {
            this.$refs.aa.gg()
            this.$refs.bb.gg()
            this.$refs.bb.gg()
            this.$refs.cc.gg()
          }`,
      errors: [{ message: "Fill me in.", type: "Me too" }],
    },
    {
      code: `this.$refs.cc.gg()`,
      errors: [{ message: "Fill me in.", type: "Me too" }],
    },
    {
      code: `true && this.$refs.cc.gg()`,
      errors: [{ message: "Fill me in.", type: "Me too" }],
    },
  ],
});
