/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea: () => width * height,
  };
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class MyCSSSelector {
  constructor() {
    this.selectorElm = '';
    this.selectorAtr = '';
    this.selectorPcl = '';
    this.selectorPel = '';
    this.selectorCls = '';
    this.selectorId = '';
    this.combineStr = '';
    this.throwDupleError = () => {
      const m = 'Element, id and pseudo-element should not ';
      const mm = `${m}occur more then one time inside the selector`;
      throw new Error(mm);
    };
    this.throwOrderError = () => {
      const m = 'Selector parts should be arranged in the following order: ';
      const mm = `${m}element, id, class, attribute, pseudo-class, pseudo-element`;
      throw new Error(mm);
    };
  }

  element(strSelector) {
    // prettier-ignore
    if (this.selectorAtr
      || this.selectorPcl
      || this.selectorPel
      || this.selectorCls
      || this.selectorId) {
      this.throwOrderError();
    }
    if (this.selectorElm) {
      this.throwDupleError();
    }
    this.selectorElm = `${strSelector}`;
    return this;
  }

  attr(strSelector) {
    if (this.selectorPcl || this.selectorPel) {
      this.throwOrderError();
    }
    this.selectorAtr = `${this.selectorAtr}[${strSelector}]`;
    return this;
  }

  pseudoClass(strSelector) {
    if (this.selectorPel) {
      this.throwOrderError();
    }
    this.selectorPcl = `${this.selectorPcl}:${strSelector}`;
    return this;
  }

  pseudoElement(strSelector) {
    if (this.selectorPel) {
      this.throwDupleError();
    }
    this.selectorPel = `::${strSelector}`;
    return this;
  }

  class(strSelector) {
    if (this.selectorAtr || this.selectorPcl || this.selectorPel) {
      this.throwOrderError();
    }
    this.selectorCls = `${this.selectorCls}.${strSelector}`;
    return this;
  }

  id(strSelector) {
    // prettier-ignore
    if (this.selectorAtr || this.selectorPcl || this.selectorPel || this.selectorCls) {
      this.throwOrderError();
    }
    if (this.selectorId) {
      this.throwDupleError();
    }
    this.selectorId = `#${strSelector}`;
    return this;
  }

  combine(arg) {
    this.combineStr = arg.reduce((acc, item, index) => {
      if (index % 2 === 0) return `${acc}${item.stringify()}`;
      return `${acc} ${item} `;
    }, '');
    return this;
  }

  stringify() {
    if (this.combineStr) return this.combineStr;
    return `${this.selectorElm}${this.selectorId}${this.selectorCls}${this.selectorAtr}${this.selectorPcl}${this.selectorPel}`;
  }
}

const cssSelectorBuilder = {
  element: (value) => {
    const mySelector = new MyCSSSelector();
    return mySelector.element(value);
  },

  id: (value) => {
    const mySelector = new MyCSSSelector();
    return mySelector.id(value);
  },

  class: (value) => {
    const mySelector = new MyCSSSelector();
    return mySelector.class(value);
  },

  attr: (value) => {
    const mySelector = new MyCSSSelector();
    return mySelector.attr(value);
  },

  pseudoClass: (value) => {
    const mySelector = new MyCSSSelector();
    return mySelector.pseudoClass(value);
  },

  pseudoElement: (value) => {
    const mySelector = new MyCSSSelector();
    return mySelector.pseudoElement(value);
  },

  combine: (...value) => {
    const mySelector = new MyCSSSelector();
    return mySelector.combine(value);
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
