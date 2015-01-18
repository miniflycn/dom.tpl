# dom.tpl

> DOM模版通用翻译器，用于将DOM模版翻译成其他模版语言，接口类似[Q.js](https://github.com/miniflycn/Q.js)。

### 模版简史

jQuery作者John Resig的著名文章[JavaScript Micro-Templating](http://ejohn.org/blog/javascript-micro-templating/)，开启了前端模版引擎的序章。

之后，模版引擎走向了两个方向：

* 强大的自定义语法，代表有著名的[handlebars](https://github.com/wycats/handlebars.js/)
* 性能优先，追求极速体验，支持Javascript语法，代表有[doT](https://github.com/olado/doT)

但随着`MVVM`和`Web Component`的崛起，模版引擎又有了一些有趣的新成员：

* DOM Base Template
* Markup Template，代表有[plates](https://github.com/flatiron/plates)

为了解决什么需求？

*  `DSLs` (Domain Specific Languages) ，例如`<%=foo%>`和`{{foo}}`的可移植性较差
*  逻辑和模版真正分离，模版本身就是一个标准`HTML`片段
*  `DOM`结构不依赖于数据，使得`DOM`在没有数据时是可分析的

当然`DOM Base Template`也有一些很难逾越的问题，比如性能，由于基于`DOM树`的建立以及对`DOM树`的遍历，所以对性能并不友好，这也正是`Markup Template`出现的原因。

### dom.tpl

实际上是一个`DOM Base Template`翻译器，我们的思想是既然`DOM Base Template`有性能问题，那么我们通过一次编译将其翻译成性能更好的模版，例如：

```html
<p q-text="message"></p>
```

翻译成：

```html
<p q-text="message"><%=it.message%></p>
```

例子可见`Qtpl.js`。

### 使用

> 语法上和[Q.js](https://github.com/miniflycn/Q.js)，在元素上通过自定义属性来映射指令。

##### directive

告知翻译器如何对节点进行操作，遵循Vuejs写法：

```html
<element
  prefix-directiveId="[argument:] value [| filters...]">
</element>
```

例如模版：

```html
<p q-text="message"></p>
```

引擎会找到对应的`text`指令来对该p元素进行操作，例如`velocity.js`：

```javascript
var domTpl = new DOMTpl({
  directives: {
    // text指令是发现q-text后在其内插入${value}
    'text': function (value) {
      value = postFix(value);
      var dom = htmlparser.parseDOM('${' + value + '}');
      DomUtils.appendChild(this.el, dom[0]);
    }
  }
});
```

再例如`Qtpl.js`的例子：

```javascript
var domTpl = new DOMTpl({
  // 所有value都会经过get方法预处理，例如message预处理后变成it.message
  get: function (value) {
    return 'it.' + value;
  },
  // 所有filter的组装方法
  // filters是字符串数组，value是上面prefix的结果
  applyFilters: function (filters, value) {
    var args, foo;
    if (filters.length) {
      filters.forEach(function (filter) {
        args = filter.split(/ +/);
        foo = args.shift()
        value = [
          value
        ];
        args = args.map(function (arg) {
          return "\'" + arg + "\'";
        });
        args.unshift(1, 0);
        value.splice.apply(value, args);
        // 我们可以看到这个方法输入如果是filters = ['filter1 arg', 'filter2'], value = message，则输出为：opt.filters.filter2(opt.filters.filter1(value, 'arg'))
        value = 'opt.filters.' + foo + '(' + value.join(', ') + ')';
      })
    }
    return value;
  },
  directives: {
    // 最后到directive，输出结构
    'text': function (value) {
      var dom = htmlparser.parseDOM('{{=' + value + '}}');
      DomUtils.appendChild(this.el, dom[0]);
    }
  }
});
```



