var loadAndFetchSpine={init:function(){window.location.search?this.language=window.location.search.split("?")[1].split("=")[1]:this.language="en",console.log(this.language),this.spineItem,this.spineStorage=[],localStorage.getItem("spineLoadedList")&&(this.spineStorage=JSON.parse(localStorage.getItem("spineLoadedList"))),this.loadedSpineArr=this.spineStorage,this.definedBack(),this.lanTitle(),this.fetchSpineInfo(),this.showAllSpine(),this.downLoadSpine()},definedBack:function(){$("header").click(function(){console.log("index definedBack"),window.MStore.definedBack()})},lanTitle:function(){switch(this.language){case"en":$("header span").html("Magic Store");break;case"zh":$("header span").html("魔法商店")}TweenMax.to($("header"),.5,{opacity:1,ease:Strong.easeOut})},loadedAnimate:function(){this.LoadTimeOut=setTimeout(function(){var e=$("#loading");TweenMax.to(e,1,{opacity:0,ease:Strong.easeOut,onComplete:function(){e.remove()}})},400)},fetchSpineInfo:function(){var e=this;$.ajax({type:"GET",async:!0,url:"https://mapi.magic-store.cn/mstore/spine/tree/details",data:{lan:this.language,limit:50},success:function(i){if(console.log(i),200==i.code){e.spineItem=i.entities;try{window.MStore.spineDomains(i.pkgBucket,i.imgBucket,i.endpoint)}catch(e){console.log(e.message)}e.createDetailSpines(e.spineItem,i.imgBucket,i.endpoint)}}})},spineLoadedList:function(e){if(e){for(var i=JSON.parse(e),s=0;s<i.length;s++)this.spineStorage.push(i[s].id);this.spineStorage!=JSON.parse(localStorage.getItem("spineLoadedList"))&&(localStorage.setItem("spineLoadedList",JSON.stringify(this.spineStorage)),this.loadedSpineArr=this.spineStorage)}},createDetailSpines:function(e,i,s){for(var n=0;n<e.length;n++){var t=$('<div class="classify swiper-container"></div>');t.attr("data-categoryid",e[n].id);var a='<p class="spineTitle"><i>'+e[n].name+'</i><span class="showAll"></span></p> <div class="swiper-wrapper">',o=5;e[n].spines.length<=o&&(o=e[n].spines.length);for(var c=0;c<e[n].spines.length;c++){a+=c<4?'<div class="swiper-slide TMspine" data-source="'+e[n].spines[c].source+'" data-id="'+e[n].spines[c].id+'"><img class="magic TMmagic" src="http://'+i+"."+s+"/"+e[n].spines[c].cover+'" onerror="this.src=`../img/MS_icon.png`" />':'<div class="swiper-slide" data-source="'+e[n].spines[c].source+'" data-id="'+e[n].spines[c].id+'"><img class="magic" src="http://'+i+"."+s+"/"+e[n].spines[c].cover+'" onerror="this.src=`../img/MS_icon.png`" />';try{for(var r=0;r<this.loadedSpineArr.length;r++){var d='<span class="download"></span></div>';if(e[n].spines[c].id==this.loadedSpineArr[r]){d="</div>";break}}if(0==this.loadedSpineArr.length)var d='<span class="download"></span></div>'}catch(e){console.log(e.message)}a+=d}a+='<i>M</i></div><p class="btm"></p>',t.html(a),$("section").append(t)}this.loadedAnimate();var l=$("section .classify");TweenMax.staggerTo(l,1,{opacity:1,ease:Linear.easeInOut},.3);var p=$("section .swiper-slide.TMspine");TweenMax.staggerFrom(p,1.5,{scale:.7,opacity:0,ease:Elastic.easeOut},.1)},showAllSpine:function(){var e=this;$("section").on("click",".classify .showAll",function(){window.location="list.html?lan="+e.language;var i=$(this).parents(".classify").index(),s={itemId:e.spineItem[i].id,itemName:e.spineItem[i].name};localStorage.setItem("itemInfo",JSON.stringify(s))})},downLoadSpine:function(){var e=this;$("section").on("click",".classify .swiper-slide",function(){var i=$(this).find(".download");i.addClass("loading"),TweenMax.to(i,.9,{rotation:360,ease:Linear.easeOut,repeat:-1});var s=$(this).parents(".classify").index(),n=$(this).index(),t=e.spineItem[s].spines[n],a=$(this).find(".magic")[0].src;t.cover=a,console.log("indexDown spineInfo: "+JSON.stringify(t)),window.MStore.spineWillDownload($(this).data("source"),$(this).data("id"),JSON.stringify(t)),e.spineStorage.push($(this).data("id")),localStorage.setItem("spineLoadedList",JSON.stringify(e.spineStorage))})},spineDidDownload:function(e,i){if(console.log("spineDidDownload"),e&&i){var s=$('section .swiper-container .swiper-slide[data-source="'+e+'"]'),n=s.find(".download");setTimeout(function(){TweenMax.to(n,.3,{scale:2,opacity:0,ease:Strong.easeOut,onComplete:function(){n.hide()}})},500)}}};loadAndFetchSpine.init();