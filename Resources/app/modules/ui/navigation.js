/*global define:true, App:true*/
define(['jquery'], function($){
	var Navigation = function(){};

	Navigation.prototype.templates = {};

	Navigation.prototype.events = {
		'click a:not([data-ignore])' : 'gotoPage'
	};

	Navigation.prototype.routes = {
		'*' : 'render'
	};

	Navigation.prototype.render = function(){
		$('a[href="#/'+ App.activeRoute +'"]', '#main-menu').closest('li').addClass('active');
		App.render(this);
	};

	Navigation.prototype.gotoPage = function(e){
		var href = e.target.href;
		var divider = href.indexOf('#!/') !== -1 ? '#!/' : '#/';
		href = href.split(divider).pop();
		console.log('>>We have new page :) ', href);

		$('li.active','#main-menu').removeClass('active');
		App.navigate(href);
		$('a[href="#/'+ href +'"]', '#main-menu').closest('li').addClass('active');

	};

	return new Navigation();
});