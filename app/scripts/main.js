// Search widget

var SearchWidget = (function () {
  var s; // private alias to settings
  
  function populateSearchSelector(data) {
    var el = [];
    jQuery.each( data, function( grouptitle, sites ) {
      // Groups
      var group = jQuery( '<li class="group"><span class="title" /><ul class="sites" /></li>' );
      jQuery('.title', group).text(grouptitle);
      var sitelist = [];
      jQuery.each ( sites, function( id, siteitem ) {
        var site = jQuery( '<li class="item"><span>Search <b class="title" /> for <b class="query" /></span></li>' );
        site.data('url', siteitem['url']);
        jQuery('.title', site).text(siteitem['name']);
        jQuery('.query', site).text(s.searchInput.val());
        sitelist.push(site);
      });
      jQuery('.sites', group).append(sitelist);
      el.push(group);
    });
    s.searchSelectors.append(el);
    jQuery('.item:first', s.searchSelectors).addClass('selected');
  }

  return {
    settings: {
      searchForm: jQuery("#search"),
      searchInput: jQuery(".autosearch"),
      searchSelectors: jQuery(".searchselectors"),
      jsonURL: 'search.json', // where we store our websites for searching
      blurDelay: 200 // Allows for clicking directly on the search list
    },

    init: function() {
      s = this.settings;
      
      // Populate the "dropdown" with our items from the file set by s.jsonURL (./search.json by default)
      jQuery.getJSON(s.jsonURL, function( data ) {
        populateSearchSelector( data );
      });
      
      this.bindUIActions();
    },

    bindUIActions: function() {
      var jQuerymenu = s.searchSelectors,
          jQueryitems,
          jQueryselectedItem,
          selectedIndex = 0;
      
      s.searchForm.on('submit', function ( event ) {
        event.preventDefault();
        SearchWidget.startSearch();
      });
  
      s.searchInput.focus().on('keyup focus', function() {
        // Unhide the search item list.
        if( s.searchInput.val() != '' ) {
          s.searchSelectors.filter('.hidden').removeClass('hidden');
        } else {
          s.searchSelectors.addClass('hidden');
        }
        
        // Set the (by default empty) b.query element for each selection to our query from the textbox.
        s.searchSelectors.find('.item .query').text(s.searchInput.val());
      
      }).on('keydown', function( event ) {
        jQueryitems = jQuerymenu.find(".item");
        jQueryselectedItem = jQuerymenu.find(".selected");
        switch(event.keyCode) {
            case 40:  // down arrow
                jQueryselectedItem.removeClass("selected");
                selectedIndex = (selectedIndex + 1) % jQueryitems.length;
                jQueryselectedItem = jQueryitems.eq(selectedIndex).addClass("selected");
                break;
            case 38:  // up arrow
                jQueryselectedItem.removeClass("selected");
                selectedIndex = (selectedIndex - 1) % jQueryitems.length;
                jQueryselectedItem = jQueryitems.eq(selectedIndex).addClass("selected");
                break;
        }
      });
      
      jQuery(document).on('click', function(event) {
        if(!jQuery(event.target).closest(s.searchSelectors).length && !!jQuery(event.target).not(s.searchInput).length) {
          if(s.searchSelectors.not('.hidden')) {
            s.searchSelectors.addClass('hidden');
          }
        }
      });
      
      s.searchSelectors.on('click', '.item span', function( event ) {
        s.searchSelectors.find('.selected').removeClass('selected');
        jQuery(this).parent().addClass('selected');
        SearchWidget.startSearch();
      });
      
    },

    startSearch: function() {
      // Get selected item, and navigate.
      var selected = jQuery('.selected', s.searchSelectors);
      window.location = selected.data('url').replace('%s',s.searchInput.val());
    }

  };
})();

// Initialize widgets, etc.

(function () {
  SearchWidget.init();
})();
