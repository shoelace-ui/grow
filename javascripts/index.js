/**
 * Module dependencies
 */

var dimensions = require('dimensions');
var computedStyle = require('computedStyle');
var isNan = require('is-nan');
var domify = require('domify');
var event = require('event');
var camel = require('to-camel-case');

/**
 * Attributes that affect height
 */

var heightAttrs = [
  'width',
  'font',
  'font-size',
  'font-family',
  'font-weight',
  'line-height',
  'padding',
  'padding-top',
  'padding-bottom',
  'padding-left',
  'padding-right',
  'box-sizing'
];

/**
 * Filler text
 */

var filler = 'Some filler text';

/**
 * Template
 */

var template = '<div style="position: absolute; top: -9999px; left: -9999px; word-wrap: break-word;"></div>';

module.exports = Grow;

function Grow(elem) {
  if (!(this instanceof Grow)) return new Grow(elem)
  this.elem = elem;
  var sh = this.sh = domify(template);
  var del = this.del = dimensions(elem);
  var dsh = this.dsh = dimensions(this.sh);

  var grow = elem.getAttribute('grow') || elem.getAttribute('data-grow');
  var buffer = this.buffer = parseInt(grow || '-', 10);
  if (isNan(buffer)) buffer = 0;

  elem.style.resize = 'none';

  // this.initHeight = del.outerHeight();
  // this.initWidth = del.outerWidth();
  this.initHeight = del.innerHeight() - del.height();
  this.initWidth = del.innerWidth() - del.width();

  for (var i = 0, l = heightAttrs.length; i < l; i++) {
    var attribute = heightAttrs[i];
    var ccase = camel(attribute);
    var computed = computedStyle(elem, attribute);
    sh.style[ccase] = computed;
    elem.style[ccase] = computed;
  }

  event.bind(elem, 'input', this.update.bind(this));
  document.body.appendChild(sh);

  this.update();
}

Grow.prototype.update = function(val) {
  val = entities(this.elem.value);
  var sh = this.sh;

  if (val) sh.innerHTML = val;
  else sh.innerHTML = filler;

  var width = this.del.outerWidth();
  if (width) sh.style.width = width + 'px';
  else sh.style.width = this.initWidth + 'px';

  var height = Math.max(this.dsh.outerHeight() + this.buffer, this.initHeight);
  this.elem.style.height =  height + 'px';

  return this;
}


/**
 * Escape any entities
 *
 * @param {String} str
 * @return {String}
 */

function entities(str) {
  if (typeof str === 'undefined') return false;
  return (str)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;')
    .replace(/\n$/, '<br/>&nbsp;')
    .replace(/\n/g, '<br/>')
    .replace(/ {2,}/g, function(s){ return repeat('&nbsp;', s.length - 1) + ' '; });
}

/**
 * Replace a `str` `n` number of times
 *
 * @param {String} str
 * @param {Number} n
 * @api private
 */

function repeat(str, n) {
  var out = [];
  for (var i = 0; i < n; i++) out[out.length] = str;
  return out.join('');
}
