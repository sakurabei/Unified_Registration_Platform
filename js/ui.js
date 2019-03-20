/*
* @Author: Beibei
* @Date:   2019-02-27 22:55:06
* @Last Modified by:   Beibei
* @Last Modified time: 2019-03-19 22:38:56
*/

'use strict';
// ui-search 定义
$.fn.UiSearch = function(){
	var ui = $(this);
	$('.ui-search-selected',ui).on('click',function(){
		$('.ui-search-select-list').show();
		// 不能向上冒泡传递
		return false;
	});
	$('.ui-search-select-list a',ui).on('click',function(){
		$('.ui-search-selected').text($(this).text());
		$('.ui-search-select-list').hide();
		return false;
	});
	$('body').on('click',function(){
		$('.ui-search-select-list').hide();
	})
}
// ui-tab 定规
/*
 *@param{string} header TAB组件,所有选项卡 所有.item
 **@param{string} header TAB组件，内容区域，所有.item
 *@param {string} focus_prefix 选项卡高亮样式前缀，可选
 */
$.fn.UiTab = function(header,content,focus_prefix){
	var ui = $(this);
	var tabs = $(header,ui);
	var cons = $(content,ui);
	var focus_prefix = focus_prefix || '';
	tabs.on('click',function(){
		var index = $(this).index();
		tabs.removeClass(focus_prefix +'item_focus').eq(index).addClass(focus_prefix+'item_focus');
		cons.hide().eq(index).show();
		// return false 才会使我们点击的时候不向上跑；
		return false;
	})


}
// 

$.fn.UiBackTop = function(){
	var ui = $(this);
	var el = $('<a class="ui-backTop" href="#0"></a>');
	// ui.append( el );
    ui.append(el);
	var windowHeight = $(window).height();

	$(window).on('scroll',function(){
		// 获得滚动条的高度
		var top = $('html,body').scrollTop();
		// console.log(top);
		if(top+11 == windowHeight){
			el.show();
			console.log("展示");
		}else{
			el.hide();
			console.log("消失");
			console.log(top);
			console.log(windowHeight);
		}
	});
	el.on('click',function(){
		$(window).scrollTop(0);
	});
}
// ui-slider
// 左右箭头控制翻页
// 翻页的时候进度点要联动，focus
// 翻到第三页，下一页是第一页，翻到第一页，上一页第三页
// 进度点再点击的时候，需要切换到对应的界面
// 没有（进度点点击的时候，翻页操作的时候）需要自动滚动
// 滚动过程中，屏蔽其他操作，包括自动滚动，左右翻页进度点点击
$.fn.UiSlider = function(){
	var ui =$(this);
	var wrap = $('.ui-slider-wrap'); 
	var items = $('.ui-slider-wrap .item',ui);
	var btn_prev = $('.ui-slider-arrow .left',ui);
	var btn_next = $('.ui-slider-arrow .right',ui);
	var tips = $('.ui-slider-process .item',ui);
	// 预定义
	// var index= 0；
	var current = 0;
	var size = items.size();
	var width = items.eq(0).width();

	// 具体操作
	wrap
	.on('move_prev',function(){

	})
	.on('move_next',function(){

	})
	.on('move_to',function(evt,index){
		wrap.css('left',index*width*-1)
	});
	// 事件操作
	btn_prev.on('click',function(){
		wrap.triggerHandler('move_prev');

	});
	btn_next.on('click',function(){
		wrap.triggerHandler('move_next');

	});
	tips.on('click',function(){
		var index = $(this).index();
		wrap.triggerHandler('move_to',index);
	})
}

// 页面的脚本逻辑
$(function(){
	$('.ui-search').UiSearch();
	$('.content-tab').UiTab('.caption >.item','.block >.item');
	$('.content-tab .block .item').UiTab('.block-caption > a','.block-content >.block-wrap',"block-caption-");
	$('body').UiBackTop();
	$('.ui-slider').UiSlider();
});




