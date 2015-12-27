/**
 * Vanilla JS slider plugin
 * Browser support IE10+
 * závislosti:
 *      classList
 *      querySelector
 *      Array.map
 */
(function (root, _pt_slider) {
    if ( typeof define === 'function' && define.amd ) {
        define(_pt_slider);
    } else if ( typeof exports === 'object' ) {
        module.exports = _pt_slider();
    } else {
        root._PT_Slider = _pt_slider();
    }
})(typeof global !== "undefined" ? global : this.window || this.global, function () {
    'use strict';

    function _PT_Slider( elem, opt) {
        var _ = this;

        // Slider properties
        _.slider = document.querySelector( elem );
        _.container = null;
        _.items = [];
        _.settings = {};

        // Options
        _.defaults = {
            randomFirstItem: false,
            numberOfItems: 1,
            itemMinWidth: 0,
            controls: true,
            bullets: false,
            bulletsEl: 'ul',
            prevText: 'Previous',
            nextText: 'Next'
        };

        // Extends _.defaults and user options in order to create _.settings
        if ( opt && typeof opt === "object" ) {
            extendObj( _.settings, _.defaults, opt );
        }

        _.init();
    }

    _PT_Slider.prototype.init = function(){
        var _ = this,
            $sliderParent;

        // create slider container
        _.container = document.createElement('div');
        _.container.classList.add('_pt_slider__container');
        $sliderParent = _.slider.parentElement;
        $sliderParent.insertBefore( _.container, _.slider );
        _.container.appendChild( _.slider );

        // add CSS class for slider container
        _.slider.classList.add( '_pt_slider' );

        // prepare slider items
        _.initItems();

        // add buttons and bullets
        _.createControls();

        // position slides correctly
        // bind events
    };

    _PT_Slider.prototype.initItems = function() {
        var _ = this,
            $itemsNodeList = _.settings.itemSelector ? document.querySelectorAll( _.settings.itemSelector ) : _.slider.children,
            $itemsArray,
            startIndex = 0;

        // Convert NodeList to Array and assign each item CSS class
        $itemsArray = Array.prototype.slice.call( $itemsNodeList );
        _.items = $itemsArray.map(function( item ){
            item.classList.add( '_pt_slider__item' );
            return item;
        });

        // generate StartIndex for randomFirstItem === true
        if ( _.settings.randomFirstItem ) {
            startIndex = Math.floor( Math.random() * _.items.length );
        }

        // Setup width and position of elements
        _.items.forEach( function( item, index ) {
            var interval = ( 100 / _.settings.numberOfItems );

            item.style.width = interval + '%';
            item.style.left = ( ( index - startIndex ) * interval ) + '%';
        });
    };

    _PT_Slider.prototype.createControls = function() {
        var _ = this;

        // FIXME - call as a proxy to pass 'this'
        if ( _.settings.controls ) {
            makeButton.call( _, 'prev' );
            makeButton.call( _, 'next' );
        }

        if ( _.settings.bullets ) {
            makeBullets.call( _ );
        }
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

    /*
     * @param direction - String
     */
    var makeButton = function( direction ) {
        var _ = this,
            $btn,
            $text = direction === 'prev' ? _.settings.prevText : _.settings.nextText;

        $btn = document.createElement( 'button' );
        $btn.classList.add( '_pt_slider__control' );
        $btn.classList.add( '_pt_slider__' + direction );
        $btn.setAttribute( 'data-pt-slider-direction', direction );
        $btn.innerHTML = $text;

        _.container.appendChild( $btn );
    };

    var makeBullets = function() {
        var _ = this,
            $label,
            $bullets,
            $bullet;

        $bullets = document.createElement( _.settings.bulletsEl );
        $bullets.classList.add( '_pt_slider__bullets' );

        for ( var i = 0; i < _.items.length; i++ ) {
            $bullet = document.createElement('li');
            // Add label to the list - check for custom label in data atribute or use number of item
            $label = document.createTextNode( _.items[i].getAttribute( 'data-pt-slider-label' ) || i + 1 );
            $bullet.appendChild( $label );
            $bullets.appendChild( $bullet );
        }

        _.container.appendChild( $bullets );
    };

    return _PT_Slider;
});