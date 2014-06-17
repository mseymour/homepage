// Search widget

var SearchWidget = (function () {
  var s; // private alias to settings
  
  function populateSearchSelector(data) {
    var el = [];
    $.each( data, function( grouptitle, sites ) {
      // Groups
      var group = $( '<li class="group"><span class="title" /><ul class="sites" /></li>' );
      $('.title', group).text(grouptitle);
      var sitelist = [];
      $.each ( sites, function( id, siteitem ) {
        var site = $( '<li class="item"><span>Search <b class="title" /> for <b class="query" /></span></li>' );
        site.data('url', siteitem['url']);
        $('.title', site).text(siteitem['name']);
        $('.query', site).text(s.searchInput.val());
        sitelist.push(site);
      });
      $('.sites', group).append(sitelist);
      el.push(group);
    });
    s.searchSelectors.append(el);
    $('.item:first', s.searchSelectors).addClass('selected');
    console.log($('.item:first', s.searchSelectors));
  }

  return {
    settings: {
      searchForm: $("#search"),
      searchInput: $(".autosearch"),
      searchSelectors: $(".searchselectors"),
      jsonURL: 'search.json', // where we store our websites for searching
      blurDelay: 200 // Allows for clicking directly on the search list
    },

    init: function() {
      s = this.settings;
      
      // Populate the "dropdown" with our items from the file set by s.jsonURL (./search.json by default)
      $.getJSON(s.jsonURL, function( data ) {
        populateSearchSelector( data );
      });
      
      this.bindUIActions();
    },

    bindUIActions: function() {
      var $menu = s.searchSelectors,
          $items,
          $selectedItem,
          selectedIndex = 0;
          
      console.log($menu, $items, $selectedItem, selectedIndex);
      
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
        $items = $menu.find(".item");
        $selectedItem = $menu.find(".selected");
        switch(event.keyCode) {
            case 40:  // down arrow
                $selectedItem.removeClass("selected");
                selectedIndex = (selectedIndex + 1) % $items.length;
                $selectedItem = $items.eq(selectedIndex).addClass("selected");
                break;
            case 38:  // up arrow
                $selectedItem.removeClass("selected");
                selectedIndex = (selectedIndex - 1) % $items.length;
                $selectedItem = $items.eq(selectedIndex).addClass("selected");
                break;
        }
      }).on('blur', function() {
        setTimeout(function() {
          s.searchSelectors.addClass('hidden');
        }, s.blurDelay);
      });
      
      s.searchSelectors.on('click', '.item span', function( event ) {
        s.searchSelectors.find('.selected').removeClass('selected');
        $(this).parent().addClass('selected');
        SearchWidget.startSearch();
      });
      
    },

    startSearch: function() {
      // Get selected item, and navigate.
      var selected = $('.selected', s.searchSelectors);
      window.location = selected.data('url').replace('%s',s.searchInput.val());
    }

  };
})();

// Initialize widgets, etc.

(function () {
  SearchWidget.init();
})();
