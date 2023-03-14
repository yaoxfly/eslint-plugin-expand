# This.$refs.xx need to judge null (`@yaoxfly/expand/refs-judage-null`)

💼 This rule is enabled in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

# Rule Details

Examples of incorrect code for this rule:

```
 true  &&  this.$refs.test.test()
```

```
 this.$refs.test.test()
```

Examples of correct code for this rule:


```
 true  && this.$refs.test  && this.$refs.test.test()
```

```
 this.$refs.test && this.$refs.test.test()
```