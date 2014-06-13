
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
      $.getJSON(s.jsonURL, function( data ) {
        var items = [];
        $.each( data, function( key, val ) {
          var selected = (key == 0) ? 'selected ' : '';
          items.push( '<li class="' + selected + '" data-url="' + val['url'] + '" data-param="' + val['param'] + '"><span>Search <b>' + val['name'] + '</b> for <b class="query"/></span></li>' );
        });

        s.searchSelectors.html(items.join( '' ));
        SearchWidget.setFormToSelected();
      });
  
      s.searchInput.focus().on('keyup focus', function() {
        if( s.searchInput.val() != '' ) {
          s.searchSelectors.filter('.hidden').removeClass('hidden'); 
        } else {
          s.searchSelectors.addClass('hidden');
        }
    
        s.searchSelectors.find('li .query').text(s.searchInput.val());
    
        SearchWidget.setFormToSelected();
      
      }).on('keydown', function( event ) {
        if( !s.searchSelectors.filter('.hidden').hasClass('hidden') ) {
          var selected = s.searchSelectors.find('.selected');
          var items = s.searchSelectors.find('li');
      
          if ( event.keyCode == 38 || event.keyCode == 40 ) { // arrow up/down
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
    
          SearchWidget.setFormToSelected();
        }
    
      }).on('blur', function() {
        setTimeout(function() {
          s.searchSelectors.addClass('hidden');
        }, s.blurDelay);
      });
      
      s.searchSelectors.on('click', 'li span', function( event ) {
        var parent = $(this).parent();
        if ( !parent.hasClass('.selected') ) {
          parent.siblings('.selected').removeClass('selected');
          parent.addClass('selected');
        }
        SearchWidget.setFormToSelected();
      });
      
    },

    setFormToSelected: function() {
      var selected = s.searchSelectors.find('.selected');
      s.searchForm.attr('action', selected.data('url'));
      s.searchInput.attr('name', selected.data('param'));
    }

  };
})();

// Initialize widgets, etc.

(function () {
  SearchWidget.init();
})();
