//loading
var loadAndFetchSpine = {
	init: function() {
		this.spineItem;
		this.spineInfoArr = [];
		$('<div id="loading"></div>').prependTo($("section"));
		for(var i = 0; i < 7; i++) {
			$('<div class="loadItem"></div>').prependTo($("section").find('#loading'));
		}

		this.loadingAndBanner();
		this.fetchSpineInfo();
		this.showAllSpine();
		this.downLoadSpine();
	},
	loadingAndBanner: function() {
		var banner = $('.swiper-container.banner');
		TweenMax.to(banner, 1, {
			opacity: 1,
			ease: Strong.easeOut,
			onComplete: function() {
				var bannerSwiper = new Swiper($('.swiper-container.banner'), {
					autoplay: 3500,
					loop: true,
				});
			}
		});
		var load = $('section').find(' #loading .loadItem');
		TweenMax.staggerTo(load, .2, { scaleY: 1.6, repeat: -1, yoyo: true, ease: Linear.easeInOut }, 0.1);
	},
	loadedAnimate: function() {
		this.LoadTimeOut = setTimeout(function() {
			var loading = $('#loading');
			TweenMax.to(loading, 1, {
				opacity: 0,
				ease: Strong.easeOut,
				onComplete: function() {
					loading.remove();
				}
			});

		}, 400);
	},
	fetchSpineInfo: function() {
		var that = this;
		$.ajax({
			type: "GET",
			async: true,
			url: "https://mapi.magic-store.cn/mstore/spine/tree/details",
			success: function(res) {
				console.log(res)
				if(res.code == 200) {
					that.spineItem = res.entities;
					try {
						window.MStore.spineDomains(res.pkgBucket, res.imgBucket, res.endpoint);
					} catch(e) {
						console.log(e.message)
					}
					that.item = res.entities;
					that.imgBucket = res.imgBucket;
					that.endpoint = res.endpoint;
					that.createSpineItems(res.entities, res.imgBucket, res.endpoint);
				}
			}
		});
	},
	spineLoadedList: function(list) {
		console.log(list);
		this.spineInfoArr = JSON.parse(list);
	},
	createSpineItems: function(item, imgBucket, endpoint) {
		for(var i = 0; i < item.length; i++) {
			var spineItemsWrap = $('<div class="classify swiper-container"></div>');
			spineItemsWrap.attr('data-categoryid', item[i].id);
			var spineItemsWrapCon = '<p><i>' + item[i].name + '</i><span class="showAll">显示全部</span></p> <div class="swiper-wrapper">'

			var spineLength = 5;
			if(item[i].spines.length <= spineLength) {
				spineLength = item[i].spines.length;
			}

			for(var k = 0; k < spineLength; k++) {
				spineItemsWrapCon += '<div class="swiper-slide" data-source="' + item[i].spines[k].source + '" data-id="' + item[i].spines[k].id + '">' +
					'<img class="border" src="img/MS_icon_asset_02.png"  alt="" />' +
					'<img class="magic" src="http://' + imgBucket + '.' + endpoint + '/' + item[i].spines[k].cover + '" />'
				try {
					for(var j = 0; j < this.spineInfoArr.length; j++) {
						var spineDownCon = '<span class="download"></span>' + '</div>';
						if(item[i].spines[k].id == this.spineInfoArr[j].id) {
							spineDownCon = '</div>';
							break;
						}
					}
					if(this.spineInfoArr.length == 0) {
						var spineDownCon = '<span class="download"></span>' + '</div>';
					}
				} catch(e) {
					console.log(e.message);
				}

				spineItemsWrapCon += spineDownCon;
			}
			spineItemsWrapCon += '</div>';
			spineItemsWrap.html(spineItemsWrapCon);
			$('section').append(spineItemsWrap);
		}

		this.loadedAnimate();

		var classifyArr = $('section .classify');
		TweenMax.staggerTo(classifyArr, 1, { opacity: 1, ease: Linear.easeInOut }, 0.3);

		var spineWrapArr = $('section .swiper-slide');
		TweenMax.staggerFrom(spineWrapArr, 1.5, { scale: 0.7, opacity: 0, ease: Elastic.easeOut }, 0.1);

		var magicSpineArr = $('section .classify').find('.magic');
		TweenMax.staggerFrom(magicSpineArr, 2, { scale: 2, opacity: 0, ease: Strong.easeOut }, 0.1);
	},
	showAllSpine: function() {
		var that = this;
		$('section').on('click', '.classify .showAll', function() {
			window.location = 'list.html';
			var itemIndex = $(this).parents('.classify').index();
			var itemInfo = {
				itemId: that.spineItem[itemIndex].id,
				itemName: that.spineItem[itemIndex].name
			};
			localStorage.setItem("itemInfo", JSON.stringify(itemInfo));

		});
	},
	downLoadSpine: function() {
		var that = this;
		$('section').on('click', '.classify .swiper-slide', function() {
			var download = $(this).find('.download');
			download.addClass('loading');
			TweenMax.to(download, .9, {
				rotation: 360,
				ease: Linear.easeOut,
				repeat: -1
			});
			var x = $(this).parents('.classify').index(),
				y = $(this).index();
			//js调安卓
			window.MStore.spineWillDownload($(this).data('source'), $(this).data('id'), JSON.stringify(that.spineItem[x].spines[y]));

			//that.spineDidDownload($(this).data('source'), 'urlurlurl');

		});
	},
	spineDidDownload: function(source, url) {
		//安卓调js 
		console.log('spineDidDownload');
		if(source && url) {
			var downSpine = $('section .swiper-container .swiper-slide[data-source="' + source + '"]'),
				download = downSpine.find('.download');

			setTimeout(function() {
				TweenMax.to(download, .3, {
					scale: 2,
					opacity: 0,
					ease: Strong.easeOut,
					onComplete: function() {
						download.hide();
					}
				});
			}, 500);

//			var itemArr = [];
//			var spineInfo = {
//				id: downSpine.data('id'),
//				source: source,
//				url: url
//			}
//			this.spineInfoArr.push(spineInfo);
//			localStorage.setItem("spineInfo", JSON.stringify(this.spineInfoArr));
		}
	}
};
loadAndFetchSpine.init();