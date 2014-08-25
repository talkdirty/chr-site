// Generated by CoffeeScript 1.7.1
var Presse,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Presse = (function(_super) {
  __extends(Presse, _super);

  function Presse() {
    this.adjustPos = __bind(this.adjustPos, this);
    Presse.__super__.constructor.call(this);
    this.articleCount = 1;
    this.c.requestFunction("ImageViewer.requestInstance", (function(_this) {
      return function(imgView) {
        return _this.imageViewer = imgView();
      };
    })(this));
  }

  Presse.prototype.acquireLoadingLock = function() {
    return true;
  };

  Presse.prototype.notifyHashChange = function(hash) {
    var id, img;
    console.log("notifyHashChange");
    if (hash.lastIndexOf("/artikel/", 0) === 0) {
      id = parseInt(hash.substr(9, hash.length));
      console.log("notifyHashChange2");
      if (window.ie) {
        return this.imageViewer.open({
          imagesource: "/img/presse" + (id - 1) + ".jpg",
          handleImageLoading: true,
          navigation: true,
          minImage: 1,
          maxImage: this.articleCount,
          arrowKeys: true,
          getCurrentElement: function() {
            var h;
            h = location.hash;
            return parseInt(h.substr(h.lastIndexOf("/") + 1, h.length));
          },
          toLeftHash: function(currentEl) {
            return "#!/presse/artikel/" + (currentEl - 1);
          },
          toRightHash: function(currentEl) {
            return "#!/presse/artikel/" + (currentEl + 1);
          },
          escapeKey: true,
          lockScrolling: true,
          revertHash: "#!/presse",
          enableDragging: true
        });
      } else {
        return img = $("<img>").bind("load", (function(_this) {
          return function() {
            return _this.imageViewer.open({
              image: img,
              navigation: true,
              minImage: 1,
              maxImage: _this.articleCount,
              arrowKeys: true,
              getCurrentElement: function() {
                var h;
                h = location.hash;
                return parseInt(h.substr(h.lastIndexOf("/") + 1, h.length));
              },
              toLeftHash: function(currentEl) {
                return "#!/presse/artikel/" + (currentEl - 1);
              },
              toRightHash: function(currentEl) {
                return "#!/presse/artikel/" + (currentEl + 1);
              },
              escapeKey: true,
              lockScrolling: true,
              revertHash: "#!/presse",
              enableDragging: true
            });
          };
        })(this)).attr("src", "/img/presse" + (id - 1) + ".jpg");
      }
    }
  };

  Presse.prototype.onDOMVisible = function() {
    this.adjustPos();
    return $(window).on("resize", this.adjustPos);
  };

  Presse.prototype.onUnloadChild = function() {
    $(window).off("resize", this.adjustPos);
    return $(".image-viewer").addClass("nodisplay");
  };

  Presse.prototype.onLoad = function() {
    return $.ajax({
      url: "presse.json"
    }).done((function(_this) {
      return function(tree) {
        var article, _i, _len, _ref;
        console.log(tree);
        _ref = tree.presse;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          article = _ref[_i];
          _this.genArticle(article);
        }
        return _this.c.release();
      };
    })(this));
  };

  Presse.prototype.onScrollFinished = function() {};

  Presse.prototype.genArticle = function(article) {
    $(".presse-container").append($("<a>").addClass("img-presse").attr("href", "/#!/presse/artikel/" + this.articleCount).append($("<img>").addClass("deadcenter").attr("src", article.url)).append($("<span><h1>" + article.name + "</h1>" + article.caption + "</span>")));
    return this.articleCount++;
  };

  Presse.prototype.adjustPos = function() {
    var delta, rightElem, rightPoint, width;
    width = $(window).width();
    rightElem = this.findRightMost();
    rightPoint = rightElem.offset().left + rightElem.width();
    delta = (width * 0.94 - rightPoint) / 2;
    return $(".presse-container").css({
      "margin-left": (width * 0.06) + delta
    });
  };

  Presse.prototype.findRightMost = function() {
    var error, firstOffset, leftIndex;
    try {
      firstOffset = $(".img-presse").first().offset().top;
      leftIndex = -1;
      $(".img-presse").each((function(_this) {
        return function(index, obj) {
          var $obj;
          $obj = $(obj);
          if ($obj.offset().top !== firstOffset) {
            leftIndex = index - 1;
            return false;
          }
        };
      })(this));
      if (leftIndex !== -1) {
        return $(".img-presse").eq(leftIndex);
      }
      return false;
    } catch (_error) {
      error = _error;
      return false;
    }
  };

  return Presse;

})(ChildPage);

window.core.insertChildPage(new Presse());
