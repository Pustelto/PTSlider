/**
 * Vanilla JS slider plugin
 * Browser support IE9+
 * závislosti:
 *      classList
 *      querySelector
 *      Array.map
 */

(function() {
    'use strict';

    function _PT_Slider( elem, opt) {
        var _ = this;

        // Slider properties
        _.container = document.querySelector( elem );
        _.items = [];
        _.settings = {};

        // Options
        _.defaults = {
            randomFirstItem: true,
            numberOfItems: 1,
            itemMinWidth: 0
        };

        // Extends _.defaults and user options in order to create _.settings
        if ( opt && typeof opt === "object" ) {
            extendObj( _.settings, _.defaults, opt );
        }

        // Initialization of plugin
        _.init();
    }

    _PT_Slider.prototype.init = function(){
        var _ = this;

        // add CSS class for slider container
        _.container.classList.add( '_pt_slider' );

        // prepare slider items
        _.initItems();

        // add buttons
        // add bullets
        // position slides correctly
        // bind events
    };

    _PT_Slider.prototype.initItems = function() {
        var _ = this,
            $itemsNodeList = _.settings.itemSelector ? document.querySelectorAll( _.settings.itemSelector ) : _.container.children,
            $itemsArray;

        // Convert NodeList to Array and assign each item CSS class
        $itemsArray = Array.prototype.slice.call( $itemsNodeList );
        _.items = $itemsArray.map(function( item ){
            item.classList.add( '_pt_slider__item' );
            return item;
        });

        // Setup width and position of elements
        _.items.forEach( function( item, index ) {
            var interval = ( 100 / _.settings.numberOfItems );
            item.style.width = interval + '%';
            item.style.left = ( index * interval ) + '%'
        });




    };

    // Private methods
    var extendObj = function ( result ) {
        result = result || {};

        for ( var i = 1; i < arguments.length; i++ ) {
            if ( !arguments[i] ) {
                continue;
            }

            for ( var property in arguments[i] ) {
                if ( arguments[i].hasOwnProperty( property ) ) {
                    result[ property ] = arguments[i][ property ];
                }
            }
        }
        return result;
    };

    // FIXME
    // Calling instance of slider
    var slider = new _PT_Slider( '.slider', { numberOfItems: 2 } );
})();