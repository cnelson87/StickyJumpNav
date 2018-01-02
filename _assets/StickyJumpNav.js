/*
	TITLE: StickyJumpNav

	DESCRIPTION: Sticky Jump Nav

	VERSION: 0.1.0

	USAGE: var myStickyJumpNav = new StickyJumpNav('Element', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHOR: CN

	DEPENDENCIES:
		- jquery 2.2x+
		- greensock
		- Class.js

*/

var StickyJumpNav = Class.extend({
	init: function($nav, objOptions) {

		// defaults
		this.$window = $(window);
		this.$htmlBody = $('html, body');
		this.$nav = $nav;
		this.options = $.extend({
			selectorTabs: 'a',
			selectorPanels: '.content',
			activeClass: 'active',
			scrollSpeed: 400,
			//triggerPoint range is 0 to 100
			triggerPoint: 50,
			showTrigger: false
		}, objOptions || {});

		// element references
		this.$tabs = this.$nav.find(this.options.selectorTabs);
		this.$panels = $(this.options.selectorPanels);

		// setup & properties
		this._length = this.$panels.length;
		this.$tabs.attr({'role':'tab'});
		this.$panels.attr({'role':'tabpanel', 'tabindex':'-1'});
		// this.isAnimating = false;


		var urlHash = window.location.hash.replace('#/','').replace('#','') || null;
		var $initialTarget = urlHash ? $('#'+urlHash) : null;

		this.bindEvents();

		if ($initialTarget && $initialTarget.length) {
			this.pageJumpScroll($initialTarget);
		} else {
			this.$tabs.first().click();
			this.updateNavState();
		}

		if (this.options.showTrigger) {
			$('body').append('<span class="triggerPoint" style="top:' + this.options.triggerPoint + 'vh;">trigger</span>');
		}

	},


/**
*	Private Methods
**/

	bindEvents: function() {
		this.$window.on('resize scroll', this.__onWindowChange.bind(this));
		this.$tabs.on('click', this.__clickNavLink.bind(this));
	},

	unbindEvents: function() {
		this.$window.off('resize scroll', this.__onWindowChange.bind(this));
		this.$tabs.on('click', this.__clickNavLink.bind(this));
	},


/**
*	Event Handlers
**/

	__onWindowChange: function(event) {
		this.updateNavState();
	},

	__clickNavLink: function(event) {
		event.preventDefault();
		var $link = $(event.currentTarget);
		var targetID = $link.attr('href').replace('#/','').replace('#','') || null;
		var $target = targetID ? $('#'+targetID) : null;
		if ($target && $target.length) {
			this.pageJumpScroll($target);
		}
	},


/**
*	Public Methods
**/

	pageJumpScroll: function($target) {
		this.$htmlBody.animate({scrollTop: $target.offset().top}, this.options.scrollSpeed, function() {
			$target.focus();
		});
	},

	updateNavState: function() {
		var self = this;
		var scrollTop = this.$window.scrollTop();
		var triggerPoint = this.$window.height() * (this.options.triggerPoint / 100);

		this.$panels.each(function () {
			var $panel = $(this);
			var panelID = $panel.attr('id');
			var pnlTop = $panel.offset().top - scrollTop;

			if (pnlTop <= triggerPoint) {
				self.$tabs.removeClass(self.options.activeClass);
				self.$tabs.filter('[href="#/' + panelID + '"]').addClass(self.options.activeClass);
			}

		});

	},

	unInitialize: function() {
		this.$tabs.removeClass(this.options.activeClass);
		this.pageJumpScroll(this.$panels.first());
		this.unbindEvents();
		this.$nav = null;
		this.$tabs = null;
		this.$panels = null;
	}

});

//uncomment to use as a browserify module
//module.exports = StickyJumpNav;
