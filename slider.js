// @FIXME - proper description and browser support
/**
 * Vanilla JS slider plugin
 * Browser support IE10+
 * dependecies:
 *      classList
 *      querySelector
 *      Array.map
 */
(function (root, ptslider) {
    if ( typeof define === 'function' && define.amd ) {
        define(ptslider);
    } else if ( typeof exports === 'object' ) {
        module.exports = ptslider();
    } else {
        root.ptslider = ptslider();
    }
})(typeof global !== "undefined" ? global : this.window || this.global, function () {
    'use strict';

    // PRIVATE HELPER METHODS
    /**
     * convert nodeList to Array
     * @param nlist {Node list} - node list to convert
     * @private
     */
    var listToArray = function ( nlist ) {
        return Array.prototype.slice.call( nlist );
    };

    /*
     * Equivalent of JQuery $.extend function to merge two objects
     * @private
     */
    var extendObj = function () {
        var result = {};

        for ( var i = 0; i < arguments.length; i++ ) {
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

    // SLIDER
    function Ptslider( elem, opt) {
        var _ = this;

        // Slider basic properties - slider components
        _.slider = elem;
        _.container = null;
        _.items = [];

        // Interval property for automatic sliding
        _.slideTimer = null;

        // Properties for sliding functionality
        _.isSliding = false;
        _.currentIndex = 0;
        _.currentItemsPerView = 1;
        _.currentItemsToSlide = 1;

        // Empty object for slider settings
        _.settings = {};

        // Default options
        _.defaults = {
            itemSelector: null,          // Custom selector for slider items - {String}
            randomFirstItem: false,      // Start slider from 1st item or at random item - {Bool}
            itemsPerView: 1,             // Number of slider items per view - {Integer}
            itemsToSlide: 1,             // Number of slider items to slide - {Integer}
            itemMinWidth: 300,           // Minimal width of item for responsive - {Integer}
            controls: true,              // Display slider controls - {Bool}
            bullets: false,              // Display bullet list to switch to specific slider item - {Bool}
            bulletsEl: 'ol',             // Type of element for bullet list - {String} [ 'ul' | 'ol' ]
            prevText: 'Previous',        // Text of prev button - {String}
            nextText: 'Next',            // Text of next button - {String}
            autoSlide: false,            // Slide automaticaly in given time interval - {Bool}
            slideInterval: 2500,         // Time interval for autoSlide in ms - {Integer}
            pauseOnHover: true,          // Pause autosliding on mouse hover over slider - {Bool}
            defaultDirection: 'next'     // Default direction of sliding for autoSlide - {String} [ 'prev' | 'next']
        };

        // Extends _.defaults and user options in order to create _.settings
        if ( opt && typeof opt === "object" ) {
            _.settings = extendObj( _.defaults, opt );
        }

        _.init();
    }

    // PUBLIC METHODS
    Ptslider.prototype.init = function(){
        var _ = this,
            b;

        // current number of items per view - necessary for proper responsivnes
        _.currentItemsPerView = _.settings.itemsPerView;
        _.currentItemsToSlide = _.settings.itemsToSlide;

        // Create slider container
        _.createSliderContainer();

        // Create slider items
        _.setupItems();

        // Add buttons and bullets
        _.createControls();

        // Initial setup
        _.setupSlider();

        // Bind events
        _.bindEvents();

        // Automatic sliding
        if ( _.settings.autoSlide ) {
            _.autoSliding();
        }

        _.slider.setAttribute( 'data-ptslider-initialized', true);

        b = _.detectBreakpoint();
        if ( b ) {
            _.respondToBreakpoint( b );
        }
    };

    Ptslider.prototype.createSliderContainer = function() {
        var _ = this,
            $sliderParent;

        // Add CSS class for slider
        _.slider.classList.add( 'ptslider__wrapper' );

        // Create slider container
        _.container = document.createElement('div');
        _.container.classList.add('ptslider');

        // Insert slider container
        $sliderParent = _.slider.parentElement;
        $sliderParent.insertBefore( _.container, _.slider );
        _.container.appendChild( _.slider );
    };

    Ptslider.prototype.setupItems = function() {
        var _ = this,
            $itemsNodeList = _.settings.itemSelector ? document.querySelectorAll( _.settings.itemSelector ) : _.slider.children,
            $itemsArray = listToArray( $itemsNodeList );

        // Assign each item CSS class
        _.items = $itemsArray.map( function( item ) {
            item.classList.add( 'ptslider__item' );
            return item;
        });
    };

    Ptslider.prototype.createControls = function() {
        var _ = this;

        if ( _.settings.controls ) {
            _.makeButton( 'prev' );
            _.makeButton( 'next' );
        }

        if ( _.settings.bullets ) {
            _.makeBullets();
        }
    };

    Ptslider.prototype.setupSlider = function() {
        var _ = this,
            ci,
            $bullets = _.container.querySelectorAll('.ptslider__bullet');

        // generate start index for randomFirstItem === true
        if ( _.settings.randomFirstItem && !_.slider.getAttribute( 'data-ptslider-initialized' ) ) {
            ci = Math.floor( Math.random() * _.items.length );
            _.currentIndex = ci - (ci % _.currentItemsToSlide );
        }

        // Setup width and position of elements
        _.items.forEach( function( item, index ) {
            var interval = ( 100 / _.currentItemsPerView );

            item.style.width = interval + '%';
            item.style.left = ( index * interval ) + '%';
            item.style.transform = ( 'translate3d( -' + _.currentIndex * 100 + '%, 0, 0 )' );
        });

        if ( _.settings.bullets ) {
            $bullets[ Math.ceil( _.currentIndex / _.currentItemsToSlide) ].classList.add('ptslider--active');
        }
    };

    Ptslider.prototype.bindEvents = function() {
        var _ = this,
            controls = listToArray( _.container.querySelectorAll( '.ptslider__control' ) );

        //@FIXME bindControlsEvents.call(_);
        if ( _.settings.controls ) {
            controls.forEach( function( item ) {
                item.addEventListener( 'click', function( e ) {
                    _.slideIt.call( _, e );
                } );
            });
        }

        if ( _.settings.bullets ) {
            _.bindBulletsEvents();
        }

        if ( _.settings.autoSlide ) {
            _.slider.addEventListener( 'mouseenter', function() {
                    clearInterval(_.slideTimer);
                });

            _.slider.addEventListener( 'mouseleave', function() {
                    _.autoSliding.call(_);
                });
        }

        window.addEventListener( 'resize', function() {
            var b = _.detectBreakpoint.call(_);

            if ( b ) {
                _.respondToBreakpoint.call(_, b);
            }
        });
    };

    /**
     * Function prepare data before sliding and call a sliding function
     */
    Ptslider.prototype.slideIt = function( e ) {
        var _ = this,
            direction = e.target.getAttribute( 'data-ptslider-direction'),
            directMove = false;

        if( !direction ) {
            direction = e.target.getAttribute( 'data-ptslider-item' );
            directMove = true;
        }

        _.moveItems.call(_, direction, _.currentItemsToSlide, directMove );
    };

    // @TODO
    // create destructor fce
    Ptslider.prototype.destroy = function() {
        console.log( 'destroy function - WIP' );
        // must refactor entire code - destroy function is not callable, it is not possible to unbind events
        // throw away all variables
        // deleted unnecessary elements

        // remove eventlisteners
        /*
        _.slider
        _.slider
        bullets
        controls
        window
        */
    };

    /*
     * Function to create controls for slider
     * @param direction {String}
     */
    Ptslider.prototype.makeButton = function( direction ) {
        var _ = this,
            $btn,
            $text = direction === 'prev' ? _.settings.prevText : _.settings.nextText;

        $btn = document.createElement( 'button' );
        $btn.classList.add( 'ptslider__control' );
        $btn.classList.add( 'ptslider__' + direction );
        $btn.setAttribute( 'data-ptslider-direction', direction );
        $btn.innerHTML = $text;

        _.container.appendChild( $btn );
    };

    /*
     * Function to create bullet list for slider
     */
    Ptslider.prototype.makeBullets = function() {
        var _ = this,
            $label,
            $bullets,
            $li,
            $bullet;

        // reset of bullets at breakpoint
        if ( !!_.slider.getAttribute( 'data-ptslider-initialized' ) ) {
            $bullets = _.container.querySelector( '.ptslider__bullets' );
            _.container.removeChild( $bullets );
        }

        $bullets = document.createElement( _.settings.bulletsEl );
        $bullets.classList.add( 'ptslider__bullets' );

        // Create single bullet
        for ( var i = 0; i < ( Math.ceil( _.items.length / _.currentItemsToSlide ) ); i++ ) {
            $li = document.createElement( 'li' );
            $bullet = document.createElement( 'button' );
            $li.appendChild( $bullet );

            $bullet.classList.add( 'ptslider__bullet' );
            $bullet.setAttribute( 'data-ptslider-item', i );

            // Add label to the list - check for custom label in data atribute or use number of item
            $label = document.createTextNode( _.items[i].getAttribute( 'data-ptslider-label' ) || i + 1 );

            $bullet.appendChild( $label );
            $bullets.appendChild( $li );
        }

        _.container.appendChild( $bullets );
    };

    /*
     * Handle binding of click event for bullets
     */
    Ptslider.prototype.bindBulletsEvents = function() {
        var _ = this,
            bullets = listToArray( _.container.querySelectorAll( '.ptslider__bullet' ) );

        bullets.forEach( function( item ) {
            item.addEventListener( 'click', function bulletEvent( e ) {
                _.slideIt.call(_, e );
            });
        });
    };

    /*
     * Function to move slider items by specific offset
     * @param direction {String} - direction in which items will move
     * @param offset {Integer} - how many sliders should move
     * @param directMove {Boolean} - directs whether movement is only by one step or to specific slider item
     */
    Ptslider.prototype.moveItems = function( direction, offset, directMove ) {
        var _ = this,
            dir = _.convertDirToNumber( direction ),
            workIndex,
            bulletIndex,
            position;

        if ( !_.isSliding ) {
            _.isSliding = true;

            if ( directMove ) {
                workIndex = dir * offset;
                _.currentIndex = _.setNewIndex.call( _, workIndex, dir );
            } else {
                workIndex = _.currentIndex + ( dir * offset );
                _.currentIndex = _.setNewIndex.call( _, workIndex, dir );
            }

            position = _.currentIndex * -100;

            _.items.forEach(function( item ) {
                item.style.transform = ( 'translate3d( ' + position + '%, 0, 0)' );
            });

            //swap active class on bullets
            if ( _.settings.bullets ) {
                if ( _.currentIndex + _.currentItemsToSlide === _.items.length ) {
                    bulletIndex = Math.ceil( _.currentIndex / _.currentItemsToSlide );
                } else {
                    bulletIndex = Math.floor( _.currentIndex / _.currentItemsToSlide );
                }
                _.container.querySelector( '.ptslider--active' ).classList.remove( 'ptslider--active' );
                _.container.querySelectorAll( '.ptslider__bullet' )[ bulletIndex ].classList.add( 'ptslider--active' );
            }

            //reset auto slide timer
            if ( _.settings.autoSlide ) {
                _.autoSliding.call(_);
            }

            _.isSliding = false;
        }
    };

    /*
     * Function converts String direction to Integer
     * @param direction {String} - direction to convert, can be prev, next or Number
     * @return Integer
     */
    Ptslider.prototype.convertDirToNumber = function( direction ) {
        var n;

        if( direction === 'prev' ) {
            n = -1;
        }
        if( direction === 'next' ) {
            n = 1;
        }
        if( !isNaN( parseInt( direction, 10 ) ) ) {
            n = parseInt( direction, 10 );
        }

        return n;
    };

    /*
     * Check if the slider items are off limit and slider should be returned to basic position
     * @param ci {Integer} - new current index
     * @return Integer
     */
    Ptslider.prototype.setNewIndex = function( workIndex, dir ) {
        var _ = this,
            newIndex = workIndex,
            corr = Math.max( _.currentItemsToSlide, _.currentItemsPerView );

        if ( _.currentIndex === 0 && dir < 0 ) {
                newIndex = _.items.length - corr;
        }

        if ( _.currentIndex === _.items.length - corr && dir > 0 ) {
                newIndex = 0;
        }

        if ( ( newIndex + corr ) > _.items.length ) {
            newIndex = _.items.length - corr;
        }

        if ( newIndex < 0 && ( (-1 * newIndex ) < corr ) ) {
            newIndex = 0;
        }

        return newIndex;
    };

    Ptslider.prototype.autoSliding = function() {
        var _ = this;

        clearInterval(_.slideTimer);

        _.slideTimer = window.setInterval( function() {
            _.moveItems.call(_, _.settings.defaultDirection, _.currentItemsToSlide, false );
        }, _.settings.slideInterval );
    };

    Ptslider.prototype.detectBreakpoint = function() {
        var _ = this,
            b = null;

        if ( ( _.items[0].offsetWidth < _.settings.itemMinWidth) && ( _.currentItemsPerView > 1 ) ) {
            b = -1;
        }

        if ( ( _.slider.offsetWidth >= ( _.settings.itemMinWidth * ( _.currentItemsPerView + 1 ) ) ) &&
             ( _.currentItemsPerView + 1 <= _.settings.itemsPerView ) ) {
            b = 1;
        }

        return b;
    };

    Ptslider.prototype.respondToBreakpoint = function( resize ) {
        var _ = this,
            npv = _.currentItemsPerView + resize,
            nts = _.currentItemsToSlide + resize;

        if ( npv >= 1 ) {
            _.currentItemsPerView = npv;
        }

        if ( nts >= 1 && nts <= _.settings.itemsToSlide ) {
            _.currentItemsToSlide = nts;
        }

        if ( _.settings.bullets ) {
            _.makeBullets.call(_);
            _.bindBulletsEvents.call(_);
        }

        _.setupSlider.call(_);
    };

    /**
     * Wrapper for constructor function.
     * Handles proper constructor call and initialization of multiple sliders
     */
    function callee( elem, opt) {
        var e = listToArray( document.querySelectorAll( elem ) );

        e.forEach( function( slider ) {
            return new Ptslider( slider, opt );
        } );
    }
    return callee;
});