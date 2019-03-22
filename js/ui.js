/*
* @Author: Beibei
* @Date:   2019-02-27 22:55:06
* @Last Modified by:   sakurabei
* @Last Modified time: 2019-03-22 23:54:29
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
			// console.log("展示");
		}else{
			el.hide();
			// console.log("消失");
			// console.log(top);
			// console.log(windowHeight);
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
// 
// 留了一个无缝滚动的疑问
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
	var enableAuto = true;

	// 设置自动滚动感应，如果鼠标在wrap中，不要自动滚动
	wrap.on('mouseover',function(){
		enableAuto = false;
	})
	wrap.on('mouseout',function(){
		enableAuto = true;
	})
	
	// 具体操作
	wrap
	.on('move_prev',function(){
		if(current<=0){
			current = size;
		}
		current = current -1;
		wrap.triggerHandler('move_to',current);
	})
	.on('move_next',function(){
		if(current>=size-1){
			current = -1;
		}
		current = current+1;
		wrap.triggerHandler('move_to',current);

	})
	.on('move_to',function(evt,index){
		wrap.css('left',index*width*-1);
		tips.removeClass('item_focus').eq(index).addClass('item_focus');
	})
	.on('auto_move',function(){
		setInterval(function(){
			enableAuto && wrap.triggerHandler('move_next');

		},2000);

	})
	.triggerHandler('auto_move');
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
// ui-cascading
// 当前菜单变动时，会重置或者初始化当前菜单以下的所有内容，并且更新下一级菜单的内容
$.fn.UiCascading = function(){
	var ui =$(this);
	// 这个$('select',ui);是指从ui 中选择select元素
	var selects = $('select',ui);
	// 当元素的值改变时，会触发change事件
	selects
	.on('change',function(){
		// val（）获取值的文本域
		// 获取当前值
		var val = $(this).val();
		// 获取位置
		// 选中的是哪个下拉框
		var index = selects.index(this);

		// debugger
		// 触发下一个select的更新，根据当前的值
		//  attr（) 方法设置或返回被选元素的属性值
		//  triggerHandler() 方法触发被选元素上指定的事件。
		//  .on('reloadOptions',function() 下列数据更新
		var where = $(this).attr('data-where');
		where = where ? where.split(','):[];
		where.push($(this).val());
		selects.eq(index+1)
			.attr('data-where',where.join(','))
			.triggerHandler('reloadOptions');
		// 触发下一个之后的select的初始化（清除不该有的数据项）
		// 这一步不是很明白
		ui.find('select:gt('+(index+1)+')').each(function(){
			$(this)
			.attr('data-where','')
			.triggerHandler('reloadOptions');
		})
			

	})
	.on('reloadOptions',function(){
		var method = $(this).attr('data-search');
		var args = $(this).attr('data-where').split(',');
		
		var data = AjaxRemoteGetData[method].apply(this,args);

		var select =$(this);
		select.find('option').remove();

		$.each(data,function(i,item){
			 var el = $('<option value = "'+item+'">'+ item +'</option>');
			select.append(el);
			 
		})
		// debugger

	});

	selects.eq(0).triggerHandler('reloadOptions');

}
// 页面的脚本逻辑
$(function(){
	$('.ui-search').UiSearch();
	$('.content-tab').UiTab('.caption >.item','.block >.item');
	$('.content-tab .block .item').UiTab('.block-caption > a','.block-content >.block-wrap',"block-caption-");
	$('body').UiBackTop();
	$('.ui-slider').UiSlider();
	$('.ui-cascading').UiCascading();
});




