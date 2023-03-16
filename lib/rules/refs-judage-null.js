/**
 * @fileoverview this.$refs.{{name}} need to judge null
 * @author yaoxfly
 */
"use strict";
/**
 * fixer 对象有一下几个方法：
    *
     * insertTextAfter(nodeOrToken, text) - 在给定的节点或记号之后插入文本
     * insertTextAfterRange(range, text) - 在给定的范围之后插入文本
     * insertTextBefore(nodeOrToken, text) - 在给定的节点或记号之前插入文本
     * insertTextBeforeRange(range, text) - 在给定的范围之前插入文本
     * remove(nodeOrToken) - 删除给定的节点或记号
     * removeRange(range) - 删除给定范围内的文本
     * replaceText(nodeOrToken, text) - 替换给定的节点或记号内的文本
     * replaceTextRange(range, text) - 替换给定范围内的文本
   */
//------------------------------------------------------------------------------
/** @type {import('eslint').Rule.RuleModule} */
const config = require('../utils/config')
const tool = require('../utils/tool')
module.exports = {
  meta: {
    hasSuggestions: true, type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: 'this.$refs.xx need to judge null',
      category: 'Fill me in',
      recommended: false,
      url: `${config.url}${tool.getFileName(__filename)}.md`
    },
    fixable: 'code', // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    // 报错信息描述
    messages: {
      avoidMethod: "this.$refs.{{name}} need to judge null",
      AddAmpersand: 'Add conditional statements and ampersand to null',
      AddCondition: 'Add a judgment to the if condition judgment',
    }
  },

  create (context) {
    return {
      'ExpressionStatement': (node) => {
        const { expression: { type, operator, callee } = {}, parent: { parent } = {} } = node || {}
        if (parent && parent.type === 'IfStatement') return
        node = tool.addIterator(node)
        if (type === 'LogicalExpression' && operator === '&&') {
          const obj = {}
          for (let item of node) {
            const { callee, range } = item || {}
            if (callee) {
              const { object: { object: { object: { type: rightThisType } = {}, property: { name: rightAttribute } = {} } = {}, property: { name: rightRefsName } = {} } = {} } = callee || {}
              Object.assign(obj, { rightThisType, rightAttribute, rightRefsName, range })
            } else {
              const { object: { object: { type: leftThisType } = {}, property: { name: leftAttribute } = {} } = {}, property: { name: leftRefsName } = {} } = item || {}
              Object.assign(obj, { leftThisType, leftAttribute, leftRefsName })
            }
          }
          // eslint-disable-next-line no-unused-vars
          const { rightThisType, rightAttribute, leftThisType, leftAttribute, leftRefsName, rightRefsName, range } = obj || {}
          if (rightThisType === 'ThisExpression' && rightAttribute === '$refs' && leftThisType !== 'ThisExpression' && leftAttribute !== '$refs' && leftRefsName !== rightRefsName) {
            return context.report({
              node,
              messageId: 'avoidMethod',
              data: {
                name: rightRefsName,
              },
              fix: (fixer) => {
                return fixer.insertTextBeforeRange(range, `this.${rightAttribute}.${rightRefsName}&&`)
              }
            })
          }
        }

        if (type === 'CallExpression') {
          const { object: { object: { object: { type: thisType } = {}, property: { name: attribute } = {} } = {}, property: { name: refsName } = {} } = {} } = callee || {}
          if (thisType === 'ThisExpression' && attribute === '$refs')
            context.report({
              node,
              messageId: 'avoidMethod',
              data: {
                name: refsName,
              },
              fix: (fixer) => {
                return fixer.insertTextBefore(node, `this.${attribute}.${refsName}&&`)
              }
            })
        }
      },

      'IfStatement': (node) => {
        const { test, consequent: { body } = {} } = node || {}
        //自定义迭代
        const IteratorTest = tool.addIterator(test)
        const IteratorConsequent = tool.addIterator(body)
        const arr = []
        for (let item of IteratorTest) {
          const { object: { object: { type: thisType } = {}, property: { name: attribute } = {} } = {}, property: { name: refsName } = {} } = item || {}
          attribute === '$refs' && arr.push(`${thisType}${attribute}${refsName}`)
        }

        const consequentArr = []
        IteratorConsequent.forEach(item => {
          const { expression: { callee, range } = {} } = item || {}
          const { object: { object: { object: { type: thisType } = {}, property: { name: attribute } = {} } = {}, property: { name: refsName } = {} } = {} } = callee || {}
          attribute === '$refs' && consequentArr.push({ range: range, value: `${thisType}${attribute}${refsName}`, fix: `this.${attribute}.${refsName}&&` })
          // console.log(range, item.expression, 11)
        })

        consequentArr.forEach(item => {
          if (!arr.includes(item.value)) {
            context.report({
              node,
              messageId: 'avoidMethod',
              data: {
                name: item.value.split('$ref')[2],
              },
              suggest: [
                {
                  messageId: 'AddAmpersand',
                  fix: function (fixer) {
                    return fixer.insertTextBeforeRange(item.range, item.fix);
                  }
                },
                {
                  messageId: 'AddCondition',
                  fix: function (fixer) {
                    const { range } = test || {}
                    return fixer.insertTextBeforeRange(range, item.fix);
                  }
                },
              ]
            })
          }
        })
      },
    }
  },
};