console.log("language : "+window.location.search.split("?")[1].split("=")[1]);var loadAndFetchSpine={init:function(){this.language=window.location.search.split("?")[1].split("=")[1],this.itemInfo=JSON.parse(localStorage.getItem("itemInfo")),this.spineLoadedArr=[],this.spinesInfoArr=[],this.itemListPage=1,this.spineItem,this.fetchItemList(),this.backAndDown()},fetchItemList:function(){var e=this;$.ajax({type:"GET",async:!0,data:{page:this.itemListPage,pageSize:29,sortField:"id",sortOrder:"desc",Ina:this.language},url:"https://mapi.magic-store.cn/mstore/spine/category/"+this.itemInfo.itemId,success:function(t){if(200==t.code){try{window.MStore.spineDomains(t.pkgBucket,t.imgBucket,t.endpoint)}catch(e){console.log(e.message)}e.spineItem=t.entities[0],e.spinesInfoArr=e.spinesInfoArr.concat(e.spineItem.list),console.log(e.spinesInfoArr),e.createItemList(t.entities[0],t.imgBucket,t.endpoint)}}})},spineLoadedList:function(e){this.spineLoadedArr=JSON.parse(e)},createItemList:function(e,t,i){var a="";$("header span").html(this.itemInfo.itemName),TweenMax.to($("header i"),.7,{marginLeft:"0",ease:Bounce.easeOut}),TweenMax.to($("header span"),1,{opacity:1,ease:Strong.easeOut});for(var s=0;s<e.list.length;s++){var n=$('<li class="item" data-source="'+e.list[s].source+'" data-page="'+e.currentPage+'" data-id="'+e.list[s].id+'"></li>');a='<span class="download"></span>';for(var o=0;o<this.spineLoadedArr.length;o++)if(this.spineLoadedArr[o].id==e.list[s].id){a="";break}a+='<img class="magic" data-page="'+e.currentPage+'" src="http://'+t+"."+i+"/"+e.list[s].cover+'" onerror="this.src=`../img/MS_icon.png`"/>',n.html(a),$("ul.scrollWrap").append(n)}this.spineItem.hasNextPage&&!this.spineItem.isLastPage||(TweenMax.to($("article aside"),0,{opacity:0,ease:Strong.easeOut}),$("article aside").html("已显示全部"),$("section").off("scroll")),this.loadMore(),this.spineAnimate(e.currentPage)},spineAnimate:function(e){var t=$('section .item[data-page="'+e+'"]');TweenMax.staggerFrom(t,1.5,{scale:.7,opacity:0,ease:Elastic.easeOut,onComplete:function(){TweenMax.to($("article aside"),1,{delay:1,opacity:1,ease:Strong.easeOut,onComplete:function(){TweenMax.to($("article aside"),1,{opacity:0,ease:Strong.easeOut})}})}},.1);var i=t.find('.magic[data-page="'+e+'"]');TweenMax.staggerFrom(i,2,{scale:2,opacity:0,ease:Strong.easeOut},.1)},loadMore:function(){console.log("loadMore");var e=this,t=($("article").find("aside").position().top,$("section ul").height());$("section ul").find(".item").height();$("section").on("scroll",function(){$("section").scrollTop()>t/2&&e.spineItem.hasNextPage&&!e.spineItem.isLastPage&&(console.log("itemListPage: "+e.itemListPage),e.itemListPage++,setTimeout(function(){e.fetchItemList()},300),$("article aside").html("正在加载..."),TweenMax.to($("article aside"),1,{opacity:1,ease:Strong.easeOut}),$("section").off("scroll"))})},backAndDown:function(){var e=this;$(".backStore").click(function(){window.location="index.html"}),$("section .scrollWrap").on("click",".item",function(){var t=$(this).find(".download"),i=e.spinesInfoArr[$(this).index()],a=$(this).find(".magic")[0].src;console.log("spineCover : "+a),i.cover=a,t.addClass("loading"),TweenMax.to(t,.9,{rotation:360,ease:Linear.easeOut,repeat:-1}),console.log("listDown spineInfo: "+JSON.stringify(i)),window.MStore.spineWillDownload($(this).data("source"),$(this).data("id"),JSON.stringify(i))})},spineDidDownload:function(e,t){if(console.log("list spineDidDownload"),e&&t){var i=$('section .scrollWrap .item[data-source="'+e+'"]'),a=i.find(".download");setTimeout(function(){TweenMax.to(a,.3,{scale:2,opacity:0,ease:Strong.easeOut,onComplete:function(){a.hide()}})},500)}}};loadAndFetchSpine.init();