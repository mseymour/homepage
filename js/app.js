
// Search widget

var SearchWidget = (function () {
  var s; // private alias to settings

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
      this.bindUIActions();
    },

    bindUIActions: function() {
      // Populate the "dropdown" with our items from the file set by s.jsonURL (./search.json by default)
      $.getJSON(s.jsonURL, function( data ) {
        var items = [];
        $.each( data, function( key, val ) {
          var selected = (key == 0) ? 'selected ' : '';
          items.push( '<li class="' + selected + '" data-url="' + val['url'] + '"><span>Search <b>' + val['name'] + '</b> for <b class="query"/></span></li>' );
        });

        s.searchSelectors.html(items.join( '' ));
      });
      
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
        s.searchSelectors.find('li .query').text(s.searchInput.val());
      
      }).on('keydown', function( event ) {
        if( !s.searchSelectors.filter('.hidden').hasClass('hidden') ) {
          var selected = s.searchSelectors.find('.selected');
          var items = s.searchSelectors.find('li');
      
          if ( event.keyCode == 38 || event.keyCode == 40 ) {
            // setting selection state on previous/next sibling on pressing arrow up/down
            var direction = event.keyCode == 38 ? 'prev' : 'next';
            selected.toggleClass('selected');
        
            if( selected.is('li:last') && direction == 'next' ) {
              items.first().toggleClass('selected');
            } else if ( selected.is('li:first') && direction == 'prev' ) {
              items.last().toggleClass('selected');
            } else {
              selected[direction]().toggleClass('selected');
            }
        
            event.preventDefault();
          }
        }
    
      }).on('blur', function() {
        setTimeout(function() {
          s.searchSelectors.addClass('hidden');
        }, s.blurDelay);
      });
      
      s.searchSelectors.on('click', 'li span', function( event ) {
        // On clicking, we switch the selection to the clicked item,
        // and then run the startSearch function.
        var parent = $(this).parent();
        if ( !parent.hasClass('.selected') ) {
          parent.siblings('.selected').removeClass('selected');
          parent.addClass('selected');
        }
        SearchWidget.startSearch();
      });
      
    },

    startSearch: function() {
      // Get selected item, and navigate.
      var selected = s.searchSelectors.find('.selected');
      window.location = selected.data('url').replace('%s',s.searchInput.val());
    }

  };
})();

// Initialize widgets, etc.

(function () {
  SearchWidget.init();
})();
