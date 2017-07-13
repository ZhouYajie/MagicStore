
var loadAndFetchSpine = {
  init: function () {
    this.language = window.location.search.split('?')[1].split('=')[1];
    this.itemInfo = JSON.parse(localStorage.getItem("itemInfo"));

    this.spineStorage = [];
    if(localStorage.getItem("spineLoadedList")) {
      this.spineStorage = JSON.parse(localStorage.getItem("spineLoadedList"));
    }
    this.loadedSpineArr = this.spineStorage;

      this.spinesInfoArr = []; //记录分页里所有的spine
    this.itemListPage = 1;
    this.spineItem;

    this.fetchItemList();
    this.backAndDown();

  },
  fetchItemList: function () {
    var that = this;
    $.ajax({
      type: "GET",
      async: true,
      data: {
        page: this.itemListPage,
        pageSize: 29,
        sortField: "id",
        sortOrder: "desc",
        lan: this.language
      },
      url: "https://mapi.magic-store.cn/mstore/spine/category/" + this.itemInfo.itemId,
      success: function (res) {
        if (res.code == 200) {
          try {
            window.MStore.spineDomains(res.pkgBucket, res.imgBucket, res.endpoint);
          } catch (e) {
            console.log(e.message)
          }
          that.spineItem = res.entities[0];
          that.spinesInfoArr = that.spinesInfoArr.concat(that.spineItem.list);
          console.log(that.spinesInfoArr)
          that.createItemList(that.spineItem, res.imgBucket, res.endpoint);
        }
      }
    });
  },
  createItemList: function (item, imgBucket, endpoint) {
    var content = '';
    $('header span').html(this.itemInfo.itemName);
    TweenMax.to( $('header'), .5, {opacity: 1, ease: Strong.easeOut});

    console.log(this.loadedSpineArr)

    for (var i = 0; i < item.list.length; i++) {
      var list = $('<li class="item" data-source="' + item.list[i].source + '" data-page="' + item.currentPage + '" data-id="' + item.list[i].id + '"></li>');
      content = '<span class="download"></span>';
      for (var k = 0; k < this.loadedSpineArr.length; k++) {
        if (this.loadedSpineArr[k] == item.list[i].id) {
          content = '';
          break;
        }
      }
      content += '<img class="magic" data-page="' + item.currentPage + '" src="http://' + imgBucket + '.' + endpoint + '/' + item.list[i].cover + '" onerror="this.src=`../img/MS_icon.png`"/>';
      list.html(content);
      $('ul.scrollWrap').append(list);

    }
    this.loadMore();
    this.spineAnimate(item.currentPage);
  },
  spineAnimate: function (index) {
    var spineItemArr = $('section .item[data-page="' + index + '"]');
    TweenMax.staggerFrom(spineItemArr, 1.5, {
      scale: 0.7,
      opacity: 0,
      ease: Elastic.easeOut
    }, 0.1);
  },
  loadMore: function () {
    var that = this,
      asideTop = $('article').find('aside').position().top,
      ulHeight = $('section ul').height(),
      itemHeight = $('section ul').find('.item').height();
    $('section').on('scroll', function () {
      if ($('section').scrollTop() > ulHeight/2.5) {
        if (that.spineItem.hasNextPage && !that.spineItem.isLastPage) {
          console.log('itemListPage: '+that.itemListPage)
          that.itemListPage++;
          setTimeout(function () {
            that.fetchItemList();
          }, 300);
          TweenMax.to($('article aside'), .5, {opacity: 1, ease: Strong.easeOut});
          $('section').off('scroll');
        }else {
          TweenMax.to($('article aside'), 1, {opacity: 0, ease: Strong.easeOut});
          $('article aside').html('');
          $('section').off('scroll');
        }
      }
    });
  },
  backAndDown: function () {
    var that = this;
    //返回
    $('header').click(function () {
      window.location = 'index.html?lan=' + that.language;
    });
    //下载
    $('article section .scrollWrap').on('click', '.item', function () {

      var download = $(this).find('.download'),
        spineInfo = that.spinesInfoArr[$(this).index()],
        spineCover = $(this).find('.magic')[0].src;
      spineInfo.cover = spineCover;
      download.addClass('loading');

      TweenMax.to(download, .9, {
        rotation: 360,
        ease: Linear.easeOut,
        repeat: -1
      });
      console.log('listDown spineInfo: ' + JSON.stringify(spineInfo))

      that.spineStorage.push($(this).data('id'));
      localStorage.setItem("spineLoadedList", JSON.stringify(that.spineStorage));
      //window.MStore.spineWillDownload($(this).data('source'), $(this).data('id'), JSON.stringify(spineInfo));

			that.spineDidDownload($(this).data('source'), 'urlurlurl');
    })
  },
  spineDidDownload: function (source, url) {
    console.log('list spineDidDownload');

    if (source && url) {
      var downSpine = $('section .scrollWrap .item[data-source="' + source + '"]'),
        download = downSpine.find('.download');
      setTimeout(function () {
        TweenMax.to(download, .3, {
          scale: 2,
          opacity: 0,
          ease: Strong.easeOut,
          onComplete: function () {
            download.hide();
          }
        });
      }, 500);
    }


  }
};
loadAndFetchSpine.init();

