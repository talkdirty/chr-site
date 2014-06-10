// Generated by CoffeeScript 1.7.1
var Musik,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Musik = (function(_super) {
  __extends(Musik, _super);

  function Musik() {
    Musik.__super__.constructor.call(this);
    this.core = window.core;
    this.core.requestFunction("ContentViewer.requestInstance", (function(_this) {
      return function(cView) {
        return _this.contentViewer = cView();
      };
    })(this));
    console.log(this.contentViewer);
  }

  Musik.prototype.notifyHashChange = function(newHash) {
    var elem, offs;
    console.log(newHash);
    if (newHash === "/programm") {
      elem = $(".main-area");
      offs = elem.offset();
      return this.contentViewer.open({
        left: function() {
          return elem.left;
        },
        top: function() {
          return $(".main-area").offset().top - 100;
        },
        height: function() {
          return $(".offsetwrapper").height() + 250;
        },
        width: function() {
          return 1000;
        },
        chapter: false,
        title: "Was singen die Chorknaben?",
        caption: "Eine grobe &Uuml;bersicht unseres Repertoires.",
        revertHash: "#!/musik",
        content: "<p>Prosciutto sirloin filet mignon pancetta. Rump frankfurter tail, fatback cow tenderloin ham hock. Strip steak meatball beef shank doner jowl turducken bacon t-bone biltong salami. Prosciutto meatball pancetta filet mignon brisket ham jowl sirloin. Biltong ground round brisket, sirloin tail corned beef pig pork chop ball tip shoulder beef ribs frankfurter beef pork salami.</p><ul class=\"musik-werke\"><li>Dieses Werk</li><li>Dieses Werk</li><li>Dieses Werk</li><li>Dieses Werk</li><li>Dieses Werk</li></ul>",
        animate: true,
        startingPos: {
          left: offs.left,
          top: offs.top,
          width: elem.width(),
          height: elem.height()
        }
      });
    }
  };

  return Musik;

})(ChildPage);

window.core.insertChildPage(new Musik());
