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
  //验证通过的
  valid: [
    // give me some code that won't trigger a warning
    `this.$refs.ff && this.$refs.ff`,
    `true && this.$refs.ff && this.$refs.ff`
  ],

  //验证失败的
  invalid: [
    {
      code: "true && true && this.$refs.ggg && this.$refs.ggg.aa()",
      errors: [{ message: "Fill me in.", type: "Me too" }],
    },
  ],
});
