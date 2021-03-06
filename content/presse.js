// Generated by CoffeeScript 1.12.6
var Presse,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Presse = (function(superClass) {
  extend(Presse, superClass);

  function Presse() {
    this.adjustPos = bind(this.adjustPos, this);
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
    if (hash.lastIndexOf("/artikel/", 0) === 0) {
      id = parseInt(hash.substr(hash.lastIndexOf('/') + 1));
      if (window.ie) {
        return this.imageViewer.open({
          imagesource: "/data/presse/real/" + id,
          handleImageLoading: true,
          navigation: true,
          minImage: 1,
          maxImage: this.articleCount,
          arrowKeys: false,
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
          enableDragging: true,
          descriptionSetting: 1
        });
      } else {
        return img = $("<img>").bind("load", (function(_this) {
          return function() {
            return _this.imageViewer.open({
              image: img,
              navigation: true,
              minImage: 1,
              maxImage: _this.articleCount,
              arrowKeys: false,
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
              enableDragging: true,
              descriptionSetting: 1
            });
          };
        })(this)).attr("src", "/data/presse/real/" + id);
      }
    }
  };

  Presse.prototype.onDOMVisible = function() {
    this.adjustPos();
    return $(window).on("resize", this.adjustPos);
  };

  Presse.prototype.onUnloadChild = function() {
    window.core.revMetaDesc();
    $(window).off("resize", this.adjustPos);
    $(".image-viewer").addClass("nodisplay");
    return $("#image-viewer-exit-button").addClass("nodisplay");
  };

  Presse.prototype.onLoad = function() {
    window.core.setMetaDesc("Aktuelle News", "News");
    return $.ajax({
      url: "/data/json/presse.json"
    }).done((function(_this) {
      return function(tree) {
        var article, i, len, ref;
        ref = tree.presse;
        for (i = 0, len = ref.length; i < len; i++) {
          article = ref[i];
          _this.genArticle(article);
        }
        return _this.c.release();
      };
    })(this));
  };

  Presse.prototype.genArticle = function(article) {
    var urlseg;
    urlseg = article.url.substr(article.url.lastIndexOf('/') + 1);
    $(".presse-container").append($("<a>").addClass("img-presse").attr("href", "/#!/presse/artikel/" + urlseg).append($("<div>").addClass("presse-date").html(article.date)).append($("<img>").addClass("deadcenter").attr("src", "/data/presse/thumbs/" + urlseg)).append($("<span><h1>" + article.name + "</h1>" + article.caption + "</span>")));
    return this.articleCount++;
  };

  Presse.prototype.adjustPos = function() {
    var distanceFromLeft, selPress, totalWidth, vertAxis, width;
    width = $(window).width();
    selPress = $(".img-presse");
    vertAxis = width / 2;
    totalWidth = selPress.width();
    if (selPress.eq(0).offset().top === selPress.eq(1).offset().top) {
      totalWidth += selPress.width() + 10;
    }
    distanceFromLeft = vertAxis - (totalWidth / 2);
    return $(".presse-container").css({
      "padding-left": distanceFromLeft
    });
  };

  return Presse;

})(ChildPage);

window.core.insertChildPage(new Presse());
