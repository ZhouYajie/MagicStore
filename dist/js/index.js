var loadAndFetchSpine={init:function(){window.location.search?this.language=window.location.search.split("?")[1].split("=")[1]:this.language="en",console.log(this.language),this.spineItem,this.loadedSpineArr=[];for(var e=0;e<7;e++)$('<div class="loadItem"></div>').prependTo($("article #loading"));this.definedBack(),this.lanTitle(),this.loadingAnimate(),this.fetchSpineInfo(),this.showAllSpine(),this.downLoadSpine()},definedBack:function(){$("header i").click(function(){console.log("index definedBack"),window.MStore.definedBack()})},lanTitle:function(){switch(this.language){case"en":$("header span").html("Magic Store");break;case"zh":$("header span").html("魔法商店")}},loadingAnimate:function(){var e=$("article #loading").find(".loadItem");TweenMax.staggerTo(e,.2,{scaleY:1.6,repeat:-1,yoyo:!0,ease:Linear.easeInOut},.1)},loadedAnimate:function(){this.LoadTimeOut=setTimeout(function(){var e=$("#loading");TweenMax.to(e,1,{opacity:0,ease:Strong.easeOut,onComplete:function(){e.remove()}})},400)},fetchSpineInfo:function(){var e=this;$.ajax({type:"GET",async:!0,url:"https://mapi.magic-store.cn/mstore/spine/tree/details",data:{lan:this.language,limit:50},success:function(i){if(console.log(i),200==i.code){e.spineItem=i.entities;try{window.MStore.spineDomains(i.pkgBucket,i.imgBucket,i.endpoint)}catch(e){console.log(e.message)}e.createDetailSpines(e.spineItem,i.imgBucket,i.endpoint)}}})},spineLoadedList:function(e){console.log(e),this.loadedSpineArr=JSON.parse(e)},createDetailSpines:function(e,i,n){for(var s=0;s<e.length;s++){var a=$('<div class="classify swiper-container"></div>');a.attr("data-categoryid",e[s].id);var t='<p class="spineTitle"><i>'+e[s].name+'</i><span class="showAll"></span></p> <div class="swiper-wrapper">',o=10;e[s].spines.length<=o&&(o=e[s].spines.length);for(var c=0;c<e[s].spines.length;c++){t+=c<4?'<div class="swiper-slide TMspine" data-source="'+e[s].spines[c].source+'" data-id="'+e[s].spines[c].id+'"><img class="magic TMmagic" src="http://'+i+"."+n+"/"+e[s].spines[c].cover+'" onerror="this.src=`../img/MS_icon.png`" />':'<div class="swiper-slide" data-source="'+e[s].spines[c].source+'" data-id="'+e[s].spines[c].id+'"><img class="magic" src="http://'+i+"."+n+"/"+e[s].spines[c].cover+'" onerror="this.src=`../img/MS_icon.png`" />';try{for(var l=0;l<this.loadedSpineArr.length;l++){var d='<span class="download"></span></div>';if(e[s].spines[c].id==this.loadedSpineArr[l].id){d="</div>";break}}if(0==this.loadedSpineArr.length)var d='<span class="download"></span></div>'}catch(e){console.log(e.message)}t+=d}t+='<i>M</i></div><p class="btm"></p>',a.html(t),$("section").append(a)}this.loadedAnimate();var r=$("section .classify");TweenMax.staggerTo(r,1,{opacity:1,ease:Linear.easeInOut},.3);var p=$("section .swiper-slide.TMspine");TweenMax.staggerFrom(p,1.5,{scale:.7,opacity:0,ease:Elastic.easeOut},.1);var g=$("section .classify").find(".magic.TMmagic");TweenMax.staggerFrom(g,2,{scale:2,opacity:0,ease:Strong.easeOut},.1)},showAllSpine:function(){var e=this;$("section").on("click",".classify .showAll",function(){window.location="list.html?lan="+e.language;var i=$(this).parents(".classify").index(),n={itemId:e.spineItem[i].id,itemName:e.spineItem[i].name};localStorage.setItem("itemInfo",JSON.stringify(n))})},downLoadSpine:function(){var e=this;$("section").on("click",".classify .swiper-slide",function(){var i=$(this).find(".download");i.addClass("loading"),TweenMax.to(i,.9,{rotation:360,ease:Linear.easeOut,repeat:-1});var n=$(this).parents(".classify").index(),s=$(this).index(),a=e.spineItem[n].spines[s],t=$(this).find(".magic")[0].src;a.cover=t,console.log("indexDown spineInfo: "+JSON.stringify(a)),window.MStore.spineWillDownload($(this).data("source"),$(this).data("id"),JSON.stringify(a))})},spineDidDownload:function(e,i){if(console.log("spineDidDownload"),e&&i){var n=$('section .swiper-container .swiper-slide[data-source="'+e+'"]'),s=n.find(".download");setTimeout(function(){TweenMax.to(s,.3,{scale:2,opacity:0,ease:Strong.easeOut,onComplete:function(){s.hide()}})},500)}}};loadAndFetchSpine.init();