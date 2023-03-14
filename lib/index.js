/**
 * @fileoverview
 * @author yaoxfly
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------
module.exports = {
  // 引入所有的规则
  rules: requireIndex(__dirname + "/rules"),
  environments: {
  },
  configs: {
    // 自定义配置 
    recommended: {
      plugins: ['@yaoxfly/eslint-plugin-expand'],
      rules: {
        '@yaoxfly/expand/refs-judage-null': 2
      }
    }
  },
}
