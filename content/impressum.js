// Generated by CoffeeScript 1.7.1
var Impressum,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Impressum = (function(_super) {
  __extends(Impressum, _super);

  function Impressum() {
    Impressum.__super__.constructor.call(this);
  }

  Impressum.prototype.onGenerateMarkup = function() {};

  Impressum.prototype.onLoad = function() {};

  Impressum.prototype.onScrollFinished = function() {};

  Impressum.prototype.onUnloadChild = function() {};

  return Impressum;

})(ChildPage);

window.core.insertChildPage(new Impressum());