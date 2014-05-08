// Generated by CoffeeScript 1.7.1
var ChildPage, Constants, ContentViewer, Context, Core, IndexPage, Navigation,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Constants = (function() {
  function Constants() {}

  Constants.SELECTOR_TILE = ".tile-content";

  Constants.SELECTOR_NAV = ".navitem nav";

  Constants.METHODS = {
    "NAME": 0x00001,
    "NAME_USER": 0x00010,
    "ID": 0x00100
  };

  Constants.ApplicationRoutes = [["uberuns/reise", "uberuns-reise"], ["uberuns/team", "uberuns-team"], ["uberuns/timeline", "uberuns-timeline"], ["uberuns", "uberuns"], ["stiftung", "stiftung"], ["presse", "presse"], ["musik", "musik"], ["shop", "shop"], ["kalender", "kalender"], ["bilder", "bilder"], ["impressum", "impressum"], ["unterstutzen", "unterstutzen"]];

  return Constants;

})();

Core = (function() {
  var debug;

  function Core() {
    this.resolveLocator = __bind(this.resolveLocator, this);
    this.handleHash = __bind(this.handleHash, this);
  }

  Core.prototype.scrollHandlers = {};

  Core.prototype.state = {
    scrolledDown: false,
    currentURL: "null",
    currentPage: "null"
  };

  debug = function(msg) {
    return console.log("Core: " + msg);
  };

  Core.prototype.construct = function() {};

  Core.prototype.withAPICall = function(url, callback) {
    return $.ajax({
      url: url
    }).done(function(data) {
      return callback(JSON.parse(data));
    });
  };

  Core.prototype.initializeHashNavigation = function() {
    if (window.location.hash === "") {
      return window.location.hash = "#!/";
    }
  };

  Core.prototype.handleHash = function() {
    var hash, matching;
    if (this.state["globalHashResponseDisabled"]) {
      return;
    }
    hash = window.location.hash;
    if (hash === "#!/") {
      this.raiseIndexPage();
      return;
    }
    matching = this.resolveLocator(hash);
    switch (matching.msg) {
      case "match":
        matching.handler();
        break;
      case "nomatch":
        matching.handler();
    }
  };

  Core.prototype.resolveLocator = function(hash) {
    var element, route, usefulHash, _i, _len, _ref;
    route = null;
    usefulHash = hash.substr(3, hash.length);
    _ref = Constants.ApplicationRoutes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      element = _ref[_i];
      if (usefulHash.lastIndexOf(element[0], 0) === 0) {
        route = element[1];
        break;
      }
    }
    if (route) {
      return {
        msg: "match",
        handler: (function(_this) {
          return function() {
            if ($(".scrolled").attr("id") === route) {
              return _this.delegateChildPage(route, usefulHash);
            } else {
              return _this.requestFunction("Tile.load", function(load) {
                return load(route, function() {
                  return _this.delegateChildPage(route, usefulHash);
                });
              });
            }
          };
        })(this)
      };
    } else {
      return {
        msg: "nomatch",
        handler: (function(_this) {
          return function() {
            return console.log("fixme: display 404");
          };
        })(this)
      };
    }
  };

  Core.prototype.delegateChildPage = function(route, hash) {
    var delegatePart;
    delegatePart = hash.substr(route.length, hash.length);
    return this.state["childPage"].notifyHashChange(delegatePart);
  };

  Core.prototype.raiseIndexPage = function() {
    if (window.location.hash === "#!/" && this.requestTaker("pageChanged")) {
      debug("Back to Index page");
      $(".tilecontainer").css({
        display: "initial"
      });
      $(".scrolled").css({
        display: "none"
      });
      $(".scrolled").attr("id", "");
      this.state["childPage"].onUnloadChild();
      this.state["childPage"] = new IndexPage();
      this.state["currentPage"] = void 0;
      this.state["currentURL"] = void 0;
      window.nav.reset();
      return this.requestFunction("ImgRotator.pauseImgRotator", function(func) {
        console.log("imgRotator: resume");
        return func(true);
      });
    } else {
      return debug("Already at Index Page");
    }
  };

  Core.prototype.executeOnce = function(name, func) {
    if (this.state["tmp" + name] === true) {

    } else {
      this.state["tmp" + name] = true;
      return func();
    }
  };

  Core.prototype.rearm = function(name) {
    return delete this.state["tmp" + name];
  };

  Core.prototype.registerTaker = function(name, obj) {
    return this.state["__taker" + name] = obj;
  };

  Core.prototype.requestTaker = function(name) {
    var s;
    s = this.state["__taker" + name];
    delete this.state["__taker" + name];
    return s;
  };

  Core.prototype.insertChildPage = function(pageObj) {
    if (this.state["childPage"]) {
      this.state["childPage"].onUnloadChild();
    }
    this.state["childPage"] = pageObj;
    this.requestFunction("ImgRotator.pauseImgRotator", function(func) {
      return func(false);
    });
    return pageObj.onInsertion();
  };

  Core.prototype.exportFunction = function(name, func) {
    return this.state[name] = func;
  };

  Core.prototype.requestFunction = function(name, success, failure) {
    var func;
    if (failure == null) {
      failure = $.noop;
    }
    func = this.state[name];
    if (func) {
      return success(func);
    } else {
      return failure();
    }
  };

  Core.prototype.revokeFunction = function(name) {
    return delete this.state[name];
  };

  Core.prototype.release = function() {
    var callback;
    this.requestFunction("Tile.finalizeLoading", function(func) {
      return func();
    });
    callback = this.requestTaker("pendingCallback");
    if (callback) {
      return callback();
    }
  };

  return Core;

})();

ChildPage = (function() {
  var notImplemented;

  function ChildPage() {
    this.c = window.core;
  }

  notImplemented = function(name) {
    return console.log("" + name + ": not implemented");
  };

  ChildPage.prototype.onDOMVisible = function() {
    return notImplemented("onDOMVisible");
  };

  ChildPage.prototype.onLoad = function() {
    return notImplemented("onLoad");
  };

  ChildPage.prototype.onScrollFinished = function() {
    return notImplemented("onScrollFinished");
  };

  ChildPage.prototype.onSoftReload = function() {
    return notImplemented("onSoftReload");
  };

  ChildPage.prototype.onScrollUpwards = function() {
    return notImplemented("onScrollUpwards");
  };

  ChildPage.prototype.onUnloadChild = function() {
    return notImplemented("onUnloadChild");
  };

  ChildPage.prototype.onInsertion = function() {
    return notImplemented("onInsertion");
  };

  ChildPage.prototype.acquireLoadingLock = function() {
    return false;
  };

  ChildPage.prototype.notifyHashChange = function(newHash) {};

  return ChildPage;

})();

Context = (function() {
  Context.internalState = {};

  function Context(pageName) {
    this.pageName = pageName;
    this.runDetection(this.pageName);
  }

  Context.prototype.getCorrelations = function() {
    return this.internalState;
  };

  Context.prototype.runDetection = function(pageName) {};

  return Context;

})();

IndexPage = (function(_super) {
  __extends(IndexPage, _super);

  function IndexPage() {
    this.pauseImgRotator = __bind(this.pauseImgRotator, this);
    var w;
    IndexPage.__super__.constructor.call(this);
    w = $(window).width();
    if (w > 1177) {
      this.bgSrc = "/" + ($(window).width()) + "/" + ($(window).height() - 90) + "/";
    } else {
      this.bgSrc = "/1610/" + ($(window).height() - 90) + "/";
    }
    this.currentRotatorImgID = 0;
    this.currentNewsID = 0;
    this.maxRotatorImgID = 100;
    this.imgObj = null;
    this.imgRotatorEnabled = true;
    this.navDropDown = false;
  }

  IndexPage.prototype.onInsertion = function() {
    this.injectBackground();
    this.injectTileBackgrounds();
    this.preloadImage();
    this.footerLeftClick();
    this.initNavDropDown();
    this.initNewsRotator();
    this.imgRotator(10000);
    return this.c.exportFunction("ImgRotator.pauseImgRotator", this.pauseImgRotator);
  };

  IndexPage.prototype.injectBackground = function() {
    return $("<img>", {
      src: this.bgSrc + "bg"
    }).load(function() {
      return $(this).appendTo("#bg");
    });
  };

  IndexPage.prototype.preloadImage = function() {
    var h, img, src, w;
    img = new Image();
    w = $(window).width();
    h = $(window).height();
    src = "" + w + "/" + h + "/bg/blurred";
    img.src = src;
    return this.c.state["blurredbg"] = img;
  };

  IndexPage.prototype.footerLeftClick = function() {
    return $(".footer-left").click((function(_this) {
      return function(event) {
        event.preventDefault();
        event.stopPropagation();
        return _this.toggleInfo();
      };
    })(this));
  };

  IndexPage.prototype.toggleInfo = function() {
    if ($("#footer").css("bottom") === "0px") {
      return $("#footer").animate({
        bottom: "300px"
      }, 100);
    } else {
      return $("#footer").animate({
        bottom: "0px"
      }, 100);
    }
  };

  IndexPage.prototype.imgRotator = function(waitFor) {
    if (this.currentRotatorImgID === 0) {
      console.log("imgRotator: init");
      this.makeImage(function() {
        return $("#link-bilder").append(this.imgObj);
      });
      return this.imgRotator(15000);
    } else {
      return setTimeout((function(_this) {
        return function() {
          $("#link-bilder img").addClass("luminanz");
          return setTimeout(function() {
            $("#link-bilder img").remove();
            if (_this.currentRotatorImgID > _this.maxRotatorImgID) {
              _this.currentRotatorImgID = 1;
            }
            return _this.makeImage(function(image) {
              $("#link-bilder").append(image);
              return _this.imgRotator(15000);
            }, false);
          }, 2000);
        };
      })(this), waitFor);
    }
  };

  IndexPage.prototype.initNewsRotator = function() {
    return $.getJSON("newsticker.json", (function(_this) {
      return function(data) {
        _this.news = data.news;
        return _this.newsRotator(7500);
      };
    })(this));
  };

  IndexPage.prototype.newsRotator = function(waitFor) {
    if (this.currentNewsID === 0) {
      console.log("newsRotator: init");
      $(".right").children("p").html("+++ " + this.news[0] + " +++");
      $(".right").children("p").css({
        opacity: 1
      });
      this.currentNewsID++;
      return this.newsRotator(waitFor);
    } else {
      return setTimeout((function(_this) {
        return function() {
          $(".right").children("p").css({
            opacity: 0
          });
          return setTimeout(function() {
            $(".right").children("p").html("+++ " + _this.news[_this.currentNewsID] + " +++");
            $(".right").children("p").css({
              opacity: 1
            });
            if (_this.currentNewsID >= _this.news.length) {
              _this.currentNewsID = 0;
            } else {
              _this.currentNewsID++;
            }
            return _this.newsRotator(waitFor);
          }, 1000);
        };
      })(this), waitFor);
    }
  };

  IndexPage.prototype.pauseImgRotator = function(state) {
    return this.imgRotatorEnabled = state;
  };

  IndexPage.prototype.makeImage = function(onload, lum) {
    this.imgObj = new Image();
    this.imgObj.onload = onload(this.imgObj);
    this.imgObj.src = "/images/real/" + this.currentRotatorImgID;
    if (lum) {
      this.imgObj.classList.add("luminanz");
    }
    if (this.imgRotatorEnabled) {
      return this.currentRotatorImgID++;
    }
  };

  IndexPage.prototype.injectTileBackgrounds = function() {
    var i, _i, _results;
    _results = [];
    for (i = _i = 12; _i >= 0; i = --_i) {
      _results.push($("#" + i).css({
        "background-image": "url(" + (this.bgSrc + i) + ")"
      }));
    }
    return _results;
  };

  IndexPage.prototype.initNavDropDown = function() {
    var nav;
    nav = $(".header-nav-dropdown");
    return $(".header-nav-dropdown-icon").click((function(_this) {
      return function() {
        if (!_this.navDropDown) {
          nav.css({
            top: "50px"
          });
          return _this.navDropDown = true;
        } else {
          nav.css({
            top: "-200px"
          });
          return _this.navDropDown = false;
        }
      };
    })(this));
  };

  return IndexPage;

})(ChildPage);

Navigation = (function() {
  Navigation.preState = null;

  function Navigation(element) {
    this.navigator = $(element);
    this.navigationChilds = this.navigator.children();
  }

  Navigation.prototype.by = function(method, name) {
    var element, h, result, _i, _len, _ref;
    if (method === Constants.METHODS.NAME) {
      result = null;
      this.navigationChilds.each(function(i, obj) {
        var href;
        href = obj.attributes["href"].value;
        if (href.substring(3, href.length) === name) {
          result = $(obj);
          return false;
        }
      });
      if (result === null) {
        throw new Error("No such name under method");
      }
      return this.internalToggle(result);
    } else if (method === Constants.METHODS.ID) {
      if ((0 > name && name > this.navigationChilds.length)) {
        throw new Error("No object with this ID");
      }
      result = $(this.navigationChilds[name]);
      return this.internalToggle(result);
    } else if (method === Constants.METHODS.NAME_USER) {
      result = null;
      _ref = this.navigationChilds;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        h = $(element).attr("href");
        if (name.lastIndexOf(h.substr(3, h.length), 0) === 0) {
          result = $(element);
          break;
        }
      }
      if (result === null) {
        result = this.inDropdown(name);
      }
      if (result === null) {
        throw new Error("No object with such a internal name");
      }
      return this.internalToggle(result);
    }
  };

  Navigation.prototype.inDropdown = function(name) {
    var el, element, nav, result, _i, _len;
    nav = $(".header-nav-dropdown").children();
    result = null;
    for (_i = 0, _len = nav.length; _i < _len; _i++) {
      element = nav[_i];
      el = $(element).children("a").attr("href");
      if (name.lastIndexOf(el.substr(3, el.length), 0) === 0) {
        result = $(element);
        break;
      }
    }
    return result;
  };

  Navigation.prototype.reset = function() {
    if (this.preState !== void 0) {
      return this.preState.css({
        "font-weight": "initial"
      });
    }
  };

  Navigation.prototype.internalToggle = function(toggleThis) {
    console.log(this.preState);
    if (this.preState !== void 0) {
      this.preState.css({
        "font-weight": "initial"
      });
    }
    toggleThis.css({
      "font-weight": "bold"
    });
    return this.preState = toggleThis;
  };

  return Navigation;

})();

ContentViewer = (function() {
  function ContentViewer() {
    this.clickOnViewerHandler = __bind(this.clickOnViewerHandler, this);
    this.closeClickHandler = __bind(this.closeClickHandler, this);
    this.close = __bind(this.close, this);
    this.update = __bind(this.update, this);
    this.open = __bind(this.open, this);
    this.core = window.core;
    this.revertHash = null;
    this.left = null;
    this.right = null;
    this.top = null;
    this.height = function() {
      return "initial";
    };
  }

  ContentViewer.prototype.open = function(contentObj) {
    var $cnt;
    $cnt = $(".content-viewer");
    console.log("contentViewer: open");
    this.revertHash = contentObj.revertHash;
    this.left = contentObj.left;
    this.right = contentObj.right;
    this.top = contentObj.top;
    if (contentObj.height) {
      this.height = contentObj.height;
    }
    if (contentObj.scrollTo) {
      $.scrollTo(contentObj.scrollTo.offset().top - contentObj.top(), 500);
    }
    $("html").css({
      cursor: "pointer"
    });
    this.update();
    $cnt.children("h1").html(contentObj.title);
    $cnt.children("h2").html(contentObj.caption);
    $cnt.children("#ccnt").html(contentObj.content);
    $(document).click(this.closeClickHandler);
    $(".content-viewer").click(this.clickOnViewerHandler);
    $cnt.removeClass("nodisplay");
    return $(window).on("resize", this.update);
  };

  ContentViewer.prototype.update = function() {
    return $(".content-viewer").css({
      left: this.left(),
      right: this.right(),
      top: this.top(),
      height: this.height()
    });
  };

  ContentViewer.prototype.close = function(revertHash) {
    var $cnt;
    $cnt = $(".content-viewer");
    console.log("contentViewer: close");
    $(document).unbind("click", this.closeClickHandler);
    $(".content-viewer").unbind("click", this.clickOnViewerHandler);
    $("html").css({
      cursor: "default"
    });
    $cnt.css({
      cursor: "default"
    });
    this.core.registerTaker("dontHandle", true);
    window.location.hash = revertHash;
    $cnt.addClass("nodisplay");
    return $(window).off("resize", this.update);
  };

  ContentViewer.prototype.closeClickHandler = function() {
    return this.close(this.revertHash);
  };

  ContentViewer.prototype.clickOnViewerHandler = function(event) {
    return event.stopPropagation();
  };

  return ContentViewer;

})();

window.core = new Core;

window.constants = Constants;

new Tile(Constants);

window.core.exportFunction("ContentViewer.requestInstance", function() {
  return new ContentViewer();
});

$(function() {
  var c;
  window.nav = new Navigation(".header-nav");
  c = window.core;
  c.initializeHashNavigation();
  c.handleHash();
  c.insertChildPage(new IndexPage());
  $(window).scroll(c.getScrollHandler);
  return window.onhashchange = c.handleHash;
});
