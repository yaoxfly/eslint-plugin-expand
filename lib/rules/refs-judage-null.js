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
module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: 'this.$refs.xx need to judge null',
      category: 'Fill me in',
      recommended: false,
      url: ""
    },
    fixable: 'code', // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    // 报错信息描述
    messages: {
      avoidMethod: "this.$refs.{{name}} need to judge null"
    }
  },

  create (context) {
    return {
      'ExpressionStatement': (node) => {
        const { expression: { type, operator, callee } = {} } = node || {}

        //自定义迭代
        node[Symbol.iterator] = function* () {
          const root = this.valueOf()
          if (root === null) return
          const stack = [root] //栈，先进后出
          while (stack.length) {
            const item = stack.pop()
            yield item
            const { expression } = item || {}
            if (expression) {
              const { expression: { left, right } = {} } = item || {}
              if (right) stack.push(right)
              if (left) stack.push(left)
            } else {
              const { left, right } = item || {}
              if (right) stack.push(right)
              if (left) stack.push(left)
            }
          }
        }

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
    }
  },
};