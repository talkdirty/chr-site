// Generated by CoffeeScript 1.12.6
var Uberuns,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Uberuns = (function(superClass) {
  extend(Uberuns, superClass);

  function Uberuns() {
    this.core = window.core;
    window.core.requestFunction("ContentViewer.requestInstance", (function(_this) {
      return function(cView) {
        return _this.contentViewer = cView();
      };
    })(this));
  }

  Uberuns.prototype.onDOMVisible = function() {
    $(".reise-imgcontainer").css({
      display: "none"
    });
    $(".reise-sidebarcontainer").css({
      display: "none"
    });
    return $(".ie8-fallback-tile").css({
      display: "initial"
    });
  };

  Uberuns.prototype.notifyHashChange = function(newHash) {
    var h;
    h = $(".hiddentext");
    if (newHash === "/chorknabe-werden") {
      return this.contentViewer.open({
        left: function() {
          return h.offset().left;
        },
        top: function() {
          return h.offset().top;
        },
        width: function() {
          return h.width();
        },
        height: function() {
          return h.height();
        },
        minWidth: function() {
          return "500px";
        },
        chapter: false,
        bgColor: "#4b77be",
        title: "Chorknabe werden.",
        caption: "",
        revertHash: "#!/uberuns/",
        content: $("#chorknabe-werden").html()
      });
    }
  };

  Uberuns.prototype.getDimText = function() {
    var h;
    h = $(".hiddentext");
    return [h.height(), h.width(), h.offset()];
  };

  Uberuns.prototype.onLoad = function() {
    this.core.setMetaDesc("Gemeinschaft leben, Gemeinschaft geben, gemeinsam singen.", "&Uuml;ber uns");
    $(".hiddentext").addClass("visible");
    $(".icon-container").click(function(event) {
      if (!$(".content-viewer").hasClass("nodisplay")) {
        this.contentViewer.close(-1, true);
      }
      $("#uberuns").css({
        "margin-left": -($(window).width() * 0.06 + $(".deadcenter").width() - 50)
      });
      setTimeout((function(_this) {
        return function() {
          return location.hash = $(_this).attr("href");
        };
      })(this), 1000);
      event.stopPropagation();
      return event.preventDefault();
    });
    return window.core.release();
  };

  Uberuns.prototype.mouseEnter = function() {};

  Uberuns.prototype.unUnloadChild = function() {
    return this.core.revMetaDesc();
  };

  return Uberuns;

})(ChildPage);

window.core.insertChildPage(new Uberuns());
