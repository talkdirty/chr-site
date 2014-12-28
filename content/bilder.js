// Generated by CoffeeScript 1.7.1
var Bilder,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Bilder = (function(_super) {
  __extends(Bilder, _super);

  function Bilder() {
    this.adjustPos = __bind(this.adjustPos, this);
    this.onLoad = __bind(this.onLoad, this);
    Bilder.__super__.constructor.call(this);
    this.catCount = 0;
    this.currentScrollPos = -1;
    this.core = window.core;
    this.contentViewer = null;
    this.core.requestFunction("ContentViewer.requestInstance", (function(_this) {
      return function(cView) {
        return _this.contentViewer = cView();
      };
    })(this));
    this.core.requestFunction("ImageViewer.requestInstance", (function(_this) {
      return function(imgView) {
        return _this.imageViewer = imgView();
      };
    })(this));
    this.timeout = null;
    this.minImage = 0;
    this.maxImage = -1;
  }

  Bilder.prototype.notifyHashChange = function(newHash) {
    var chapter, chapterID, el, elem, elems, firstChapt, id, image, rightElem, rightPt, _i, _len;
    if (newHash.indexOf("/element/") === 0) {
      id = parseInt(newHash.substr(9, newHash.length));
      elems = $("a");
      el = void 0;
      for (_i = 0, _len = elems.length; _i < _len; _i++) {
        elem = elems[_i];
        if (elem.getAttribute("href") === ("/#!/bilder" + newHash)) {
          el = $(elem);
          break;
        }
      }
      el.addClass("loading");
      if (window.ie) {
        this.imageViewer.open({
          imagesource: "/images/real/" + id,
          handleImageLoading: true,
          navigation: true,
          minImage: this.minImage,
          maxImage: this.maxImage,
          arrowKeys: true,
          getCurrentElement: function() {
            var h;
            h = location.hash;
            return parseInt(h.substr(h.lastIndexOf("/") + 1, h.length));
          },
          toLeftHash: function(currentEl) {
            return "#!/bilder/element/" + (currentEl - 1);
          },
          toRightHash: function(currentEl) {
            return "#!/bilder/element/" + (currentEl + 1);
          },
          escapeKey: true,
          lockScrolling: true,
          revertHash: "#!/bilder"
        });
      } else {
        image = $("<img>").attr("src", "/images/real/" + id).load((function(_this) {
          return function() {
            el.removeClass("loading");
            return _this.imageViewer.open({
              image: image,
              title: _this.id2title(id),
              positionInChapter: _this.posInChapter(id).toString(),
              chapterTotalLength: _this.chapterTotalLength(id).toString(),
              chapterName: _this.chapterInfo(id),
              navigation: true,
              minImage: _this.minImage,
              maxImage: _this.maxImage,
              arrowKeys: true,
              getCurrentElement: function() {
                var h;
                h = location.hash;
                return parseInt(h.substr(h.lastIndexOf("/") + 1, h.length));
              },
              toLeftHash: function(currentEl) {
                return "#!/bilder/element/" + (currentEl - 1);
              },
              toRightHash: function(currentEl) {
                return "#!/bilder/element/" + (currentEl + 1);
              },
              escapeKey: true,
              lockScrolling: true,
              revertHash: "#!/bilder"
            });
          };
        })(this));
      }
    }
    if (newHash.indexOf("/kategorie/") === 0) {
      rightElem = this.findRightMost();
      rightPt = rightElem.offset().left + rightElem.width();
      firstChapt = $(".image-container").children().eq(0).offset();
      chapterID = newHash.substr(11, newHash.length);
      chapter = $(".img-chapter").eq(chapterID);
      return this.contentViewer.open({
        left: function() {
          return firstChapt.left;
        },
        top: function() {
          return firstChapt.top;
        },
        right: function() {
          return $(window).width() - rightPt + 30;
        },
        height: function() {
          return "100%";
        },
        scrollTo: chapter,
        title: this.tree[chapterID].category.title,
        caption: this.tree[chapterID].category.caption,
        revertHash: "#!/bilder",
        content: this.tree[chapterID].category.content,
        animate: false
      });
    }
  };

  Bilder.prototype.id2title = function(id) {
    var category, imgpair, _i, _j, _len, _len1, _ref, _ref1;
    _ref = this.tree;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      category = _ref[_i];
      _ref1 = category.category.childs;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        imgpair = _ref1[_j];
        if (imgpair[0] === id) {
          console.log(imgpair[1]);
          return imgpair[1];
        }
      }
    }
  };

  Bilder.prototype.posInChapter = function(id) {
    var category, counter, imgpair, _i, _j, _len, _len1, _ref, _ref1;
    _ref = this.tree;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      category = _ref[_i];
      counter = 0;
      _ref1 = category.category.childs;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        imgpair = _ref1[_j];
        if (imgpair[0] === id) {
          return counter + 1;
        }
        counter++;
      }
    }
  };

  Bilder.prototype.chapterTotalLength = function(id) {
    var category, imgpair, _i, _j, _len, _len1, _ref, _ref1;
    _ref = this.tree;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      category = _ref[_i];
      _ref1 = category.category.childs;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        imgpair = _ref1[_j];
        if (imgpair[0] === id) {
          return category.category.childs.length;
        }
      }
    }
  };

  Bilder.prototype.chapterInfo = function(id) {
    var category, imgpair, _i, _j, _len, _len1, _ref, _ref1;
    _ref = this.tree;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      category = _ref[_i];
      _ref1 = category.category.childs;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        imgpair = _ref1[_j];
        if (imgpair[0] === id) {
          return [category.category.title, category.category.caption];
        }
      }
    }
  };

  Bilder.prototype.onLoad = function() {
    return $.ajax({
      url: "/data/json/bilder.json"
    }).done((function(_this) {
      return function(tree) {
        var c, imgptr, _i, _j, _len, _len1, _ref;
        _this.tree = tree;
        for (_i = 0, _len = tree.length; _i < _len; _i++) {
          c = tree[_i];
          _this.genCat(c.category.title, c.category.caption, c.category.content);
          _ref = c.category.childs;
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            imgptr = _ref[_j];
            _this.genImg(imgptr[0], imgptr[1]);
            _this.maxImage++;
          }
        }
        return _this.c.release();
      };
    })(this));
  };

  Bilder.prototype.acquireLoadingLock = function() {
    return true;
  };

  Bilder.prototype.onDOMVisible = function() {
    this.adjustPos();
    return $(window).on("resize", this.adjustPos);
  };

  Bilder.prototype.onUnloadChild = function() {
    $(window).off("resize", this.adjustPos);
    return $(".image-viewer").addClass("nodisplay");
  };

  Bilder.prototype.adjustPos = function() {
    var delta, rightElem, rightPoint, width;
    width = $(window).width();
    rightElem = this.findRightMost();
    rightPoint = rightElem.offset().left + rightElem.width();
    delta = (width * 0.94 - rightPoint) / 2;
    return $(".image-container").css({
      "margin-left": (width * 0.06) + delta
    });
  };

  Bilder.prototype.findRightMost = function() {
    var error, firstOffset, leftIndex;
    try {
      firstOffset = $(".img-image").first().offset().top;
      leftIndex = -1;
      $(".img-image").each((function(_this) {
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
        return $(".img-image").eq(leftIndex);
      }
      return false;
    } catch (_error) {
      error = _error;
      return false;
    }
  };

  Bilder.prototype.genCat = function(title, caption, content) {
    $(".image-container").append($("<a>").addClass("img-chapter").attr("href", "/#!/bilder/kategorie/" + this.catCount).append($("<h2>" + title + "</h2>").append($("<span>" + caption + "</span>"))));
    return this.catCount++;
  };

  Bilder.prototype.genImg = function(filePtr, caption) {
    return $(".image-container").append($("<a>").addClass("img-image").attr("href", "/#!/bilder/element/" + filePtr).append($("<img>").attr("src", "/images/thumbs/" + filePtr)).append($("<span>" + caption + "</span>")));
  };

  return Bilder;

})(ChildPage);

window.core.insertChildPage(new Bilder());
