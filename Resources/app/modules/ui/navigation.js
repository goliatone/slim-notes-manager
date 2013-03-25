/*global define:true, App:true*/
define(function(){
	var Navigation = function(){};

	Navigation.prototype.events = {
		'click a:not([data-ignore])' : 'gotoPage'
	};

	Navigation.prototype.routes = {
		'*' : 'renderNavigation'
	};

	Navigation.prototype.renderNavigation = function(){
		App.render(this);
	};

	Navigation.prototype.gotoPage = function(e){
		var href = e.target.href;
		var divider = href.indexOf('#!/') !== -1 ? '#!/' : '#/';
		href = href.split(divider).pop();
		console.log('We have new page :) ', href);
		App.navigate(href);
	};

	return new Navigation();
});