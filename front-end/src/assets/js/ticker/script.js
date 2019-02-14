$ = jQuery;
(function($, Drupal, window, document, undefined) {
	Drupal.behaviors.my_custom_behavior = {
		attach : function(context, settings) {
			jQuery('.view-id-home_page_banner ul').fadeSlideShow({
				NextElementText : '>', 
				PrevElementText : '<',
			}).css('width', '100%');
			jQuery(".ticker2").modernTicker({
				effect : "scroll",
				scrollInterval : 20,
				transitionTime : 500,
				autoplay : true
			});
			jQuery('#fssPrev, #fssNext').fadeOut();

			jQuery('#block-views-home-page-banner-block').hover(function() {
				jQuery('#fssPrev, #fssNext').fadeIn();
			}, function() {
				jQuery('#fssPrev, #fssNext').fadeOut();
			});

			jQuery('ul#nice-menu-1').addClass('nav navbar-nav');
			jQuery('ul#nice-menu-1 li.menuparent ul').addClass('dropdown-menu');
			jQuery('.quicktabs-tabs.quicktabs-style-basic').addClass(
					'nav nav-tabs');

			jQuery('#quicktabs-container-front_page_tabs').addClass(
					'tab-content tab-style');
			$('.view-home-page-banner').height(($(window).width()-10)/3.475);
		}
	};
})(jQuery, Drupal, this, this.document);