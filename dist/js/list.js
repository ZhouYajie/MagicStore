var loadAndFetchSpine={init:function(){this.itemInfo=JSON.parse(localStorage.getItem("itemInfo")),this.spineInfoArr=[],this.itemListPage=1,this.spineItem,this.fetchItemList(),this.backAndDown()},fetchItemList:function(){var e=this;$.ajax({type:"GET",async:!0,data:{page:this.itemListPage,pageSize:29,sortField:"id",sortOrder:"desc"},url:"https://mapi.magic-store.cn/mstore/spine/category/"+this.itemInfo.itemId,success:function(t){if(200==t.code){try{window.MStore.spineDomains(t.pkgBucket,t.imgBucket,t.endpoint)}catch(e){console.log(e.message)}e.spineItem=t.entities[0],e.createItemList(t.entities[0],t.imgBucket,t.endpoint)}}})},spineLoadedList:function(e){console.log(e),this.spineInfoArr=JSON.parse(e)},createItemList:function(e,t,i){console.log(e);var s="";$("section ul.scrollWrap").find(".itemName i").html(this.itemInfo.itemName);for(var n=0;n<e.list.length;n++){var a=$('<li class="item" data-src="http://magic-resource.oss-cn-shanghai.aliyuncs.com/'+e.list[n].cover+'" data-source="'+e.list[n].source+'" data-page="'+e.currentPage+'" data-id="'+e.list[n].id+'"></li>');s='<img class="border" src="img/MS_icon_asset_02.png" alt="" /><span class="download"></span>';for(var o=0;o<this.spineInfoArr.length;o++)if(this.spineInfoArr[o].id==e.list[n].id){s='<img class="border" src="img/MS_icon_asset_02.png" alt="" />';break}s+='<img class="magic" data-page="'+e.currentPage+'" src="http://'+t+"."+i+"/"+e.list[n].cover+'"/>',a.html(s),$("ul.scrollWrap").append(a)}this.spineItem.hasNextPage&&!this.spineItem.isLastPage?$("section aside").html("正在加载..."):$("section aside").html("已显示全部"),this.loadMore(),this.spineAnimate(e.currentPage)},spineAnimate:function(e){var t=$('section .item[data-page="'+e+'"]');TweenMax.staggerFrom(t,1.5,{scale:.7,opacity:0,ease:Elastic.easeOut,onComplete:function(){TweenMax.to($("section aside"),1,{opacity:1,ease:Strong.easeOut})}},.1);var i=t.find('.magic[data-page="'+e+'"]');TweenMax.staggerFrom(i,2,{scale:2,opacity:0,ease:Strong.easeOut},.1)},loadMore:function(){var e=this,t=$("section").find("aside").position().top;$("section").on("scroll",function(){t-$("section").scrollTop()<document.documentElement.clientHeight&&e.spineItem.hasNextPage&&!e.spineItem.isLastPage&&(e.itemListPage++,setTimeout(function(){e.fetchItemList()},300),$("section").off("scroll"))})},backAndDown:function(){var e=this;$(".backStore").click(function(){window.location="index.html"}),$("section .scrollWrap").on("click",".item",function(){var t=$(this).find(".download");t.addClass("loading"),TweenMax.to(t,.9,{rotation:360,ease:Linear.easeOut,repeat:-1}),window.MStore.spineWillDownload($(this).data("source"),$(this).data("id"),JSON.stringify(e.spineItem.list[$(this).index()-1]))})},spineDidDownload:function(e,t){if(console.log("list spineDidDownload"),e&&t){var i=$('section .scrollWrap .item[data-source="'+e+'"]'),s=i.find(".download");setTimeout(function(){TweenMax.to(s,.3,{scale:2,opacity:0,ease:Strong.easeOut,onComplete:function(){s.hide()}})},500)}}};loadAndFetchSpine.init();