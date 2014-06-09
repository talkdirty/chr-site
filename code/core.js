// Generated by CoffeeScript 1.7.1
var ChildPage, Constants, ContentViewer, Core, ImageViewer, IndexPage, Navigation,
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
    this.ensureFooterDown();
    if (hash === "#!/") {
      this.raiseIndexPage();
      return;
    }
    if (hash === "#!/kalender") {
      this.delegateChildPage("", "#!/kalender");
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
      this.state["childPage"].closeCalendar();
      return debug("Already at Index Page");
    }
  };

  Core.prototype.ensureFooterDown = function() {
    return $("#footer").css({
      bottom: "0px"
    });
  };

  Core.prototype.ensureImageViewerClosed = function() {
    this.requestFunction("ImageViewer.forceClose", (function(_this) {
      return function(func) {
        return func(true);
      };
    })(this));
    return this.revokeFunction("ImageViewer.forceClose");
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
      console.log(failure);
      console.log($.noop);
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

IndexPage = (function(_super) {
  __extends(IndexPage, _super);

  function IndexPage() {
    this.leaveNavDropDown = __bind(this.leaveNavDropDown, this);
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
    this.contentViewer = this.c.requestFunction("ContentViewer.requestInstance", (function(_this) {
      return function(cView) {
        return _this.contentViewer = cView();
      };
    })(this));
  }

  IndexPage.prototype.onInsertion = function() {
    this.injectBackground();
    this.injectTileBackgrounds();
    this.preloadImage();
    this.footerLeftClick();
    this.initNavDropDown();
    this.initNewsRotator();
    this.initKalender();
    this.imgRotator(10000);
    return this.c.exportFunction("ImgRotator.pauseImgRotator", this.pauseImgRotator);
  };

  IndexPage.prototype.injectBackground = function() {
    return $("<img>", {
      src: this.bgSrc + "bg"
    }).load(function() {
      $(this).appendTo("#bg");
      return $("#bg").css({
        opacity: 1,
        background: "initial"
      });
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
    $(".footer-left").click((function(_this) {
      return function(event) {
        event.preventDefault();
        event.stopPropagation();
        return _this.toggleInfo();
      };
    })(this));
    $("#btnimpressum").click((function(_this) {
      return function(event) {
        event.preventDefault();
        event.stopPropagation();
        return _this.toggleImpressum();
      };
    })(this));
    return $("#startst").click((function(_this) {
      return function() {
        return $("#footer").css({
          bottom: "0px"
        });
      };
    })(this));
  };

  IndexPage.prototype.toggleInfo = function() {
    var bot;
    bot = $("#footer").css("bottom");
    if (bot !== "300px" && bot !== "0px") {
      this.toggleImpressum();
      setTimeout((function(_this) {
        return function() {
          return _this.toggleInfo();
        };
      })(this), 310);
    }
    if ($("#footer").css("bottom") === "0px") {
      $("#feedback").addClass("nodisplay");
      $("#infoarea").removeClass("nodisplay");
      return $("#footer").css({
        bottom: "300px"
      });
    } else {
      return $("#footer").css({
        bottom: "0px"
      });
    }
  };

  IndexPage.prototype.toggleImpressum = function() {
    var to;
    if ($("#footer").css("bottom") === "300px") {
      this.toggleInfo();
      setTimeout((function(_this) {
        return function() {
          return _this.toggleImpressum();
        };
      })(this), 320);
    }
    to = $(window).height() - 50 - 25;
    if ($("#footer").css("bottom") === "0px") {
      $("#feedback").removeClass("nodisplay");
      $("#feedback").css({
        height: to + 1
      });
      $("#infoarea").addClass("nodisplay");
      return $("#footer").css({
        bottom: to
      });
    } else {
      return $("#footer").css({
        bottom: "0px"
      });
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
    this.imgObj.onload = (function(_this) {
      return function() {
        return onload(_this.imgObj);
      };
    })(this);
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
          console.log("enter");
          nav.css({
            top: "50px"
          });
          _this.navDropDown = true;
          _this.ignoreFirstShot = true;
          return $(document).on("click.nav", _this.leaveNavDropDown);
        } else {
          console.log("leave");
          return _this.leaveNavDropDown();
        }
      };
    })(this));
  };

  IndexPage.prototype.leaveNavDropDown = function() {
    if (this.ignoreFirstShot) {
      this.ignoreFirstShot = false;
      return;
    }
    console.log("leave");
    $(".header-nav-dropdown").css({
      top: "-200px"
    });
    this.navDropDown = false;
    return $(document).off("click.nav");
  };

  IndexPage.prototype.notifyHashChange = function(newHash) {
    var minHgt, pos;
    console.log(newHash);
    if (newHash === "#!/kalender") {
      pos = $("#6").offset();
      minHgt = $(".bigtile-content").height() + 10 + 40 > 420;
      console.log(minHgt);
      this.template = _.template($("#calendar-template").html());
      this.contentViewer.open({
        left: function() {
          if (minHgt) {
            return $(window).width() * 0.06;
          } else {
            return 0;
          }
        },
        top: function() {
          if (minHgt) {
            return $(".smalltiles").children().first().offset().top;
          } else {
            return 50;
          }
        },
        right: function() {
          if (minHgt) {
            return $(window).width() * 0.06;
          } else {
            return 0;
          }
        },
        height: function() {
          if (minHgt) {
            return $(".bigtile-content").height() + 10 + 40;
          } else {
            return $(window).height() - 50 - 25;
          }
        },
        chapter: false,
        title: "Kalender",
        caption: "Konzerte, Gottesdienste, Grillparties",
        revertHash: "#!/",
        content: "<div id=\"calendar-full\"></div>",
        animate: true,
        onClose: (function(_this) {
          return function() {
            return _this.contentViewerOpen = false;
          };
        })(this),
        startingPos: {
          left: pos.left,
          top: pos.top,
          width: $("#6").width(),
          height: $("#6").height()
        }
      });
      this.contentViewerOpen = true;
      return $("#calendar-full").clndr({
        daysOfTheWeek: ['So', 'Mo', 'Di', "Mi", "Do", "Fr", "Sa"],
        render: (function(_this) {
          return function(data) {
            return _this.template(data);
          };
        })(this)
      });
    }
  };

  IndexPage.prototype.closeCalendar = function() {
    if (this.contentViewerOpen) {
      return this.contentViewer.close("#!/");
    }
  };

  IndexPage.prototype.initKalender = function() {};

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
    this.contentObj = null;
  }

  ContentViewer.prototype.open = function(contentObj) {
    var $cnt, pos;
    $cnt = $(".content-viewer");
    console.log("contentViewer: open");
    this.contentObj = contentObj;
    if (!this.contentObj.height) {
      this.contentObj.height = function() {
        return "initial";
      };
    }
    if (this.contentObj.scrollTo) {
      $.scrollTo(this.contentObj.scrollTo.offset().top - this.contentObj.top(), 500);
    }
    if (this.contentObj.animate) {
      pos = this.contentObj.startingPos;
      $cnt.removeClass("nodisplay");
      $cnt.css({
        left: pos.left,
        top: pos.top,
        width: pos.width,
        height: pos.height,
        "z-index": 6
      });
      $cnt.css({
        opacity: 1,
        width: $(window).width() - this.contentObj.right() - this.contentObj.left(),
        left: this.contentObj.left(),
        height: this.contentObj.height(),
        top: this.contentObj.top()
      });
      $(".content-viewer-padding").css({
        opacity: 1
      });
      return this["continue"]($cnt);
    } else {
      return this["continue"]($cnt);
    }
  };

  ContentViewer.prototype["continue"] = function($cnt) {
    var $content;
    $("html").css({
      cursor: "pointer"
    });
    $("html .content-viewer").css({
      cursor: "initial"
    });
    this.update();
    $content = $cnt.children("div");
    $content.children("h1").html(this.contentObj.title);
    $content.children("h2").html(this.contentObj.caption);
    $content.children("#ccnt").html(this.contentObj.content);
    $(document).bind("click.content", this.closeClickHandler);
    $(".content-viewer").bind("click.content", this.clickOnViewerHandler);
    return $(window).on("resize", this.update);
  };

  ContentViewer.prototype.update = function() {
    return $(".content-viewer").css({
      left: this.contentObj.left(),
      right: this.contentObj.right(),
      top: this.contentObj.top(),
      height: this.contentObj.height()
    });
  };

  ContentViewer.prototype.close = function(revertHash) {
    var $cnt;
    $cnt = $(".content-viewer");
    console.log("contentViewer: close");
    $(document).unbind("click.content", this.closeClickHandler);
    $(".content-viewer").unbind("click.content", this.clickOnViewerHandler);
    $("html").css({
      cursor: "default"
    });
    $cnt.css({
      cursor: "default"
    });
    this.core.registerTaker("dontHandle", true);
    window.location.hash = revertHash;
    if (this.contentObj.animate) {
      $cnt.css({
        left: this.contentObj.startingPos.left,
        width: this.contentObj.startingPos.width,
        top: this.contentObj.startingPos.top,
        height: this.contentObj.startingPos.height
      });
      $cnt.children("div").addClass("nodisplay");
      setTimeout((function(_this) {
        return function() {
          $cnt.css({
            opacity: 0
          });
          return setTimeout(function() {
            $cnt.addClass("nodisplay");
            $cnt.children("div").removeClass("nodisplay");
            return $(".content-viewer-padding").css({
              opacity: 0
            });
          }, 400);
        };
      })(this), 600);
    } else {
      $cnt.addClass("nodisplay");
    }
    $(window).off("resize", this.update);
    this.clear();
    if (this.contentObj.onClose) {
      return this.contentObj.onClose();
    }
  };

  ContentViewer.prototype.clear = function() {
    $(".content-viewer-padding h1").empty();
    $(".content-viewer-padding h2").empty();
    return $("#ccnt").empty();
  };

  ContentViewer.prototype.closeClickHandler = function() {
    return this.close(this.contentObj.revertHash);
  };

  ContentViewer.prototype.clickOnViewerHandler = function(event) {
    return event.stopPropagation();
  };

  return ContentViewer;

})();

ImageViewer = (function() {
  function ImageViewer() {
    this.imageViewerKeyPress = __bind(this.imageViewerKeyPress, this);
    this.fadeOutInfo = __bind(this.fadeOutInfo, this);
    this.close = __bind(this.close, this);
    this.open = __bind(this.open, this);
    window.core.exportFunction("ImageViewer.forceClose", this.close);
  }

  ImageViewer.prototype.open = function(conf) {
    var image, viewer;
    this.conf = conf;
    image = this.conf.image;
    if (!$(".image-viewer").hasClass("nodisplay")) {
      $(".image-viewer img").remove();
    }
    $(".bar").removeClass("fade");
    if (this.conf.navigation) {
      this.currentEl = this.conf.getCurrentElement();
      if (!(this.currentEl - 1 < this.minImage)) {
        $(".arrleft").attr("href", this.conf.toLeftHash(this.currentEl));
      }
      if (!(this.currentEl + 1 > this.maxImage)) {
        $(".arrright").attr("href", this.conf.toRightHash(this.currentEl));
      }
    }
    if (this.conf.arrowKeys && this.conf.navigation) {
      $(window).on("keydown", this.imageViewerKeyPress);
    }
    if (this.conf.lockScrolling) {
      this.currentScrollPos = $(window).scrollTop();
      $(".scrolled").css({
        overflow: "hidden"
      });
    }
    viewer = $(".image-viewer");
    viewer.children("img").remove();
    $(image).addClass("link-cursor");
    $(image).prependTo($(".image-viewer"));
    if (this.conf.enableDragging) {
      $(image).click((function(_this) {
        return function() {
          return _this.close();
        };
      })(this));
      console.log("imageViewer.enableDragging: stub");
    } else {
      $(image).click((function(_this) {
        return function() {
          return _this.close();
        };
      })(this));
    }
    viewer.removeClass("nodisplay");
    $(".cross").removeClass("nodisplay");
    if ($(".image-viewer img").height() > $(window).height() - 300) {
      this.fadeOutInfo();
      return $(".image-viewer img").on("mousemove", this.fadeOutInfo);
    }
  };

  ImageViewer.prototype.close = function(forceNoHash) {
    if (forceNoHash == null) {
      forceNoHash = false;
    }
    if (this.conf.lockScrolling) {
      $(".scrolled").css({
        overflow: "initial"
      });
      $(window).scrollTop(this.currentScrollPos);
    }
    if (this.conf.revertHash && !forceNoHash) {
      window.core.registerTaker("dontHandle", true);
      window.location.hash = this.conf.revertHash;
    }
    if (this.conf.arrowKeys) {
      $(window).off("keydown", this.imageViewerKeyPress);
    }
    $(".image-viewer img").off("mousemove", this.fadeOutInfo);
    clearTimeout(this.timeout);
    $(".bar").removeClass("fade");
    $(".image-viewer").addClass("nodisplay");
    return $(".image-viewer").children("img").remove();
  };

  ImageViewer.prototype.fadeOutInfo = function() {
    clearTimeout(this.timeout);
    $(".bar").removeClass("fade");
    $("body").css;
    return this.timeout = setTimeout((function(_this) {
      return function() {
        return $(".bar").addClass("fade");
      };
    })(this), 2000);
  };

  ImageViewer.prototype.imageViewerKeyPress = function(ev) {
    var keyCode;
    keyCode = ev.keyCode;
    if (keyCode === 37 && this.currentEl > this.conf.minImage) {
      location.hash = this.conf.toLeftHash(this.currentEl);
    }
    if (keyCode === 39 && this.currentEl < this.conf.maxImage) {
      return location.hash = this.conf.toRightHash(this.currentEl);
    }
  };

  return ImageViewer;

})();

window.core = new Core;

window.constants = Constants;

new Tile(Constants);

window.core.exportFunction("ContentViewer.requestInstance", function() {
  return new ContentViewer();
});

window.core.exportFunction("ImageViewer.requestInstance", function() {
  return new ImageViewer();
});

$(function() {
  var c;
  window.nav = new Navigation(".header-nav");
  c = window.core;
  c.initializeHashNavigation();
  c.insertChildPage(new IndexPage());
  c.handleHash();
  $(window).scroll(c.getScrollHandler);
  return window.onhashchange = c.handleHash;
});
