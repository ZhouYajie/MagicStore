var loadAndFetchSpine={init:function(){this.language=window.location.search.split("?")[1].split("=")[1],this.itemInfo=JSON.parse(localStorage.getItem("itemInfo")),this.spineStorage=[],localStorage.getItem("spineLoadedList")&&(this.spineStorage=JSON.parse(localStorage.getItem("spineLoadedList"))),this.loadedSpineArr=this.spineStorage,this.spinesInfoArr=[],this.itemListPage=1,this.spineItem,this.fetchItemList(),this.backAndDown()},fetchItemList:function(){var e=this;$.ajax({type:"GET",async:!0,data:{page:this.itemListPage,pageSize:29,sortField:"id",sortOrder:"desc",lan:this.language},url:"https://mapi.magic-store.cn/mstore/spine/category/"+this.itemInfo.itemId,success:function(t){if(200==t.code){try{window.MStore.spineDomains(t.pkgBucket,t.imgBucket,t.endpoint)}catch(e){console.log(e.message)}e.spineItem=t.entities[0],e.spinesInfoArr=e.spinesInfoArr.concat(e.spineItem.list),console.log(e.spinesInfoArr),e.createItemList(e.spineItem,t.imgBucket,t.endpoint)}}})},createItemList:function(e,t,i){var s="";$("header span").html(this.itemInfo.itemName),TweenMax.to($("header"),.5,{opacity:1,ease:Strong.easeOut}),console.log(this.loadedSpineArr);for(var a=0;a<e.list.length;a++){var n=$('<li class="item" data-source="'+e.list[a].source+'" data-page="'+e.currentPage+'" data-id="'+e.list[a].id+'"></li>');s='<span class="download"></span>';for(var o=0;o<this.loadedSpineArr.length;o++)if(this.loadedSpineArr[o]==e.list[a].id){s="";break}s+='<img class="magic" data-page="'+e.currentPage+'" src="http://'+t+"."+i+"/"+e.list[a].cover+'" onerror="this.src=`../img/MS_icon.png`"/>',n.html(s),$("ul.scrollWrap").append(n)}this.loadMore(),this.spineAnimate(e.currentPage)},spineAnimate:function(e){var t=$('section .item[data-page="'+e+'"]');TweenMax.staggerFrom(t,1.5,{scale:.7,opacity:0,ease:Elastic.easeOut},.1)},loadMore:function(){var e=this,t=($("article").find("aside").position().top,$("section ul").height());$("section ul").find(".item").height();$("section").on("scroll",function(){$("section").scrollTop()>t/2.5&&(e.spineItem.hasNextPage&&!e.spineItem.isLastPage?(console.log("itemListPage: "+e.itemListPage),e.itemListPage++,setTimeout(function(){e.fetchItemList()},300),TweenMax.to($("article aside"),.5,{opacity:1,ease:Strong.easeOut}),$("section").off("scroll")):(TweenMax.to($("article aside"),1,{opacity:0,ease:Strong.easeOut}),$("article aside").html(""),$("section").off("scroll")))})},backAndDown:function(){var e=this;$("header").click(function(){window.location="index.html?lan="+e.language}),$("article section .scrollWrap").on("click",".item",function(){var t=$(this).find(".download"),i=e.spinesInfoArr[$(this).index()],s=$(this).find(".magic")[0].src;i.cover=s,t.addClass("loading"),TweenMax.to(t,.9,{rotation:360,ease:Linear.easeOut,repeat:-1}),console.log("listDown spineInfo: "+JSON.stringify(i)),e.spineStorage.push($(this).data("id")),localStorage.setItem("spineLoadedList",JSON.stringify(e.spineStorage)),e.spineDidDownload($(this).data("source"),"urlurlurl")})},spineDidDownload:function(e,t){if(console.log("list spineDidDownload"),e&&t){var i=$('section .scrollWrap .item[data-source="'+e+'"]'),s=i.find(".download");setTimeout(function(){TweenMax.to(s,.3,{scale:2,opacity:0,ease:Strong.easeOut,onComplete:function(){s.hide()}})},500)}}};loadAndFetchSpine.init();