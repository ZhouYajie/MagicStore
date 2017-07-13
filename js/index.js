//loading

var loadAndFetchSpine = {
	init: function() {

		if(window.location.search) {
			this.language = window.location.search.split('?')[1].split('=')[1];
		} else {
			this.language = 'en';
		}
		console.log(this.language)

		this.spineItem;

		this.loadedSpineArr = [];
		this.spineStorage = [];

		this.definedBack();
		this.lanTitle();
		this.fetchSpineInfo();
		this.showAllSpine();
		this.downLoadSpine();

		this.spineLoadedList();//debug
	},
	definedBack: function() {
		$('header').click(function() {
			console.log('index definedBack')
			window.MStore.definedBack();
		})
	},
	//多语言 title
	lanTitle: function() {
		switch (this.language) {
			case 'en':
				$('header span').html('Magic Store');
				break;
			case 'zh':
				$('header span').html('魔法商店');
				break;
		}
		TweenMax.to( $('header'), .5, {opacity: 1, ease: Strong.easeOut});
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
			data: {
				lan: this.language,
				limit: 50
			},
			success: function(res) {
				console.log(res)
				if(res.code == 200) {
					that.spineItem = res.entities;
					try {
						window.MStore.spineDomains(res.pkgBucket, res.imgBucket, res.endpoint);
					} catch(e) {
						console.log(e.message)
					}
					that.createDetailSpines(that.spineItem, res.imgBucket, res.endpoint);
				}
			}
		});
	},
	spineLoadedList: function(list) {
		//console.log(list);
		//if(list) {
		//	this.loadedSpineArr = JSON.parse(list);
    //
		//	//本地存储,方便list页调用
		//	for(var i=0;i<this.loadedSpineArr.length;i++) {
		//		this.spineStorage.push(this.loadedSpineArr[i].id);
		//	}
		//	localStorage.setItem("spineLoadedList", JSON.stringify(this.spineStorage));
		//}



		if(localStorage.getItem("spineLoadedList")) {
			console.log('localStorage')
			this.spineStorage = JSON.parse(localStorage.getItem("spineLoadedList"));
		} else {
			console.log("!localStorage")
			//if(list) {
			//	var spineList = JSON.parse(list);
			//	for(var i=0;i<spineList.length;i++) {
			//		this.spineStorage.push(spineList[i].id);
			//	}
			//	localStorage.setItem("spineLoadedList", JSON.stringify(this.spineStorage));
			//}

			//debug
			this.spineStorage = ["0x574d9c50de000000","0x574afe7d3c000000","0x574afe2526400000"];
			localStorage.setItem("spineLoadedList", JSON.stringify(this.spineStorage));
		}

		this.loadedSpineArr = this.spineStorage;
	},
	createDetailSpines: function(item, imgBucket, endpoint) {
		for(var i = 0; i < item.length; i++) {
			var spineItemsWrap = $('<div class="classify swiper-container"></div>');
			spineItemsWrap.attr('data-categoryid', item[i].id);
			var spineItemsWrapCon = '<p class="spineTitle"><i>' + item[i].name + '</i><span class="showAll"></span></p> <div class="swiper-wrapper">'

			var spineLength = 5;
			if(item[i].spines.length <= spineLength) {
				spineLength = item[i].spines.length;
			}

			for(var k = 0; k < item[i].spines.length; k++) {
				if(k < 4) {
					spineItemsWrapCon += '<div class="swiper-slide TMspine" data-source="' + item[i].spines[k].source + '" data-id="' + item[i].spines[k].id + '">' +
						'<img class="magic TMmagic" src="http://' + imgBucket + '.' + endpoint + '/' + item[i].spines[k].cover + '" onerror="this.src=`../img/MS_icon.png`" />'
				}else {
					spineItemsWrapCon += '<div class="swiper-slide" data-source="' + item[i].spines[k].source + '" data-id="' + item[i].spines[k].id + '">' +
						'<img class="magic" src="http://' + imgBucket + '.' + endpoint + '/' + item[i].spines[k].cover + '" onerror="this.src=`../img/MS_icon.png`" />'
				}

				try {
					for(var j = 0; j < this.loadedSpineArr.length; j++) {
						var spineDownCon = '<span class="download"></span>' + '</div>';
						if(item[i].spines[k].id == this.loadedSpineArr[j]) {
							spineDownCon = '</div>';
							break;
						}
					}
					if(this.loadedSpineArr.length == 0) {
						var spineDownCon = '<span class="download"></span>' + '</div>';
					}
				} catch(e) {
					console.log(e.message);
				}

				spineItemsWrapCon += spineDownCon;
			}
			spineItemsWrapCon += '<i>M</i></div><p class="btm"></p>';
			spineItemsWrap.html(spineItemsWrapCon);
			$('section').append(spineItemsWrap);
		}

		this.loadedAnimate();

		var classifyArr = $('section .classify');
		TweenMax.staggerTo(classifyArr, 1, { opacity: 1, ease: Linear.easeInOut }, 0.3);

		//初始页面每个分类里前四个spine动画
		var spineWrapArr = $('section .swiper-slide.TMspine');
		TweenMax.staggerFrom(spineWrapArr, 1.5, { scale: 0.7, opacity: 0, ease: Elastic.easeOut }, 0.1);

		//var magicSpineArr = $('section .classify').find('.magic.TMmagic');
		//TweenMax.staggerTo(magicSpineArr, 2, { scale: 1, opacity:1, ease: Strong.easeOutt }, 0.1);

	},
	showAllSpine: function() {
		var that = this;
		$('section').on('click', '.classify .showAll', function() {
			window.location = 'list.html?lan=' + that.language;
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

			//loading
			var download = $(this).find('.download');
			download.addClass('loading');
			TweenMax.to(download, .9, {
				rotation: 360,
				ease: Linear.easeOut,
				repeat: -1
			});

			//spineCover
			var x = $(this).parents('.classify').index(),
				y = $(this).index(),
				spineInfo = that.spineItem[x].spines[y],
				spineCover = $(this).find('.magic')[0].src;
			spineInfo.cover = spineCover;
			console.log('indexDown spineInfo: ' + JSON.stringify(spineInfo));

			//当前spine ——> storage
			that.spineStorage.push($(this).data('id'));
			localStorage.setItem("spineLoadedList", JSON.stringify(that.spineStorage));

			//js调安卓
			//window.MStore.spineWillDownload($(this).data('source'), $(this).data('id'), JSON.stringify(spineInfo));
			that.spineDidDownload($(this).data('source'), 'urlurlurl');
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
			//			this.loadedSpineArr.push(spineInfo);
			//			localStorage.setItem("spineInfo", JSON.stringify(this.loadedSpineArr));
		}
	}
};
loadAndFetchSpine.init();