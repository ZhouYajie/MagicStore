
console.log('language : '+window.location.search.split('?')[1].split('=')[1])
var loadAndFetchSpine = {
  init: function () {
    this.language = window.location.search.split('?')[1].split('=')[1];
    this.itemInfo = JSON.parse(localStorage.getItem("itemInfo"));
    this.spineLoadedArr = [];
    this.spinesInfoArr = [];
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
        Ina: this.language
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
          that.createItemList(res.entities[0], res.imgBucket, res.endpoint);
        }
      }
    });
  },
  spineLoadedList: function (list) {
    //console.log(list);
    this.spineLoadedArr = JSON.parse(list);
  },
  createItemList: function (item, imgBucket, endpoint) {
    //console.log(item)
    var content = '';
    $('header span').html(this.itemInfo.itemName);
    TweenMax.to( $('header i'), .7, {marginLeft:'0', ease: Bounce.easeOut});
    TweenMax.to( $('header span'), 1, {opacity: 1, ease: Strong.easeOut});
    for (var i = 0; i < item.list.length; i++) {
      var list = $('<li class="item" data-source="' + item.list[i].source + '" data-page="' + item.currentPage + '" data-id="' + item.list[i].id + '"></li>');
      content = '<span class="download"></span>';
      for (var k = 0; k < this.spineLoadedArr.length; k++) {
        if (this.spineLoadedArr[k].id == item.list[i].id) {
          content = '';
          break;
        }
      }
      content += '<img class="magic" data-page="' + item.currentPage + '" src="http://' + imgBucket + '.' + endpoint + '/' + item.list[i].cover + '" onerror="this.src=`../img/MS_icon.png`"/>';
      list.html(content);
      $('ul.scrollWrap').append(list);

    }
    if (this.spineItem.hasNextPage && !this.spineItem.isLastPage) {

    } else {
      TweenMax.to($('article aside'), 0, {opacity: 0, ease: Strong.easeOut});
      $('article aside').html('已显示全部');
      $('section').off('scroll');

    }
    this.loadMore();
    this.spineAnimate(item.currentPage);
  },
  spineAnimate: function (index) {
    var spineItemArr = $('section .item[data-page="' + index + '"]');
    TweenMax.staggerFrom(spineItemArr, 1.5, {
      scale: 0.7,
      opacity: 0,
      ease: Elastic.easeOut,
      onComplete: function () {
        TweenMax.to($('article aside'), 1, {
          delay: 1, opacity: 1, ease: Strong.easeOut, onComplete: function () {
            TweenMax.to($('article aside'), 1, {opacity: 0, ease: Strong.easeOut})
          }
        });
      }
    }, 0.1);

    var magicSpineArr = spineItemArr.find('.magic[data-page="' + index + '"]');
    TweenMax.staggerFrom(magicSpineArr, 2, {scale: 2, opacity: 0, ease: Strong.easeOut}, 0.1);
  },
  loadMore: function () {
    console.log('loadMore')
    var that = this,
      asideTop = $('article').find('aside').position().top,
      ulHeight = $('section ul').height(),
      itemHeight = $('section ul').find('.item').height();
    $('section').on('scroll', function () {
      if ($('section').scrollTop() > ulHeight/2) {
        if (that.spineItem.hasNextPage && !that.spineItem.isLastPage) {
          console.log('itemListPage: '+that.itemListPage)
          that.itemListPage++;
          setTimeout(function () {
            that.fetchItemList();
          }, 300);
          $('article aside').html('正在加载...');
          TweenMax.to($('article aside'), 1, {opacity: 1, ease: Strong.easeOut});
          $('section').off('scroll');
        }
      }
    });
  },
  backAndDown: function () {
    var that = this;
    //返回
    $('.backStore').click(function () {
      window.location = 'index.html';
    });
    //下载
    $('section .scrollWrap').on('click', '.item', function () {
      var download = $(this).find('.download'),
        spineInfo = that.spinesInfoArr[$(this).index()],
        spineCover = $(this).find('.magic')[0].src;
      console.log('spineCover : '+spineCover)
      spineInfo.cover = spineCover;
      download.addClass('loading');
      TweenMax.to(download, .9, {
        rotation: 360,
        ease: Linear.easeOut,
        repeat: -1
      });
      console.log('listDown spineInfo: ' + JSON.stringify(spineInfo))
      window.MStore.spineWillDownload($(this).data('source'), $(this).data('id'), JSON.stringify(spineInfo));

			//that.spineDidDownload($(this).data('source'), 'urlurlurl');
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

