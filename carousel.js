;(function(factory){

    factory(jQuery);

})(function($){

    /*
     * We define Zippy as a variable of type ‘function’.
     * Here, we use an anonymous function to ensure
     * that the logic inside the function is executed immediately.
     *
     */
    var Zippy = (function(element, settings){

        var instanceUid = 0;

        /*
         * The constructor function for Zippy
         *
         */
        function _Zippy(element, settings){
            this.defaults = {};

            // We create a new property to hold our default settings after they
            // have been merged with user supplied settings
            this.settings = $.extend({},this,this.defaults,settings);

            // This object holds values that will change as the plugin operates
            this.initials = {};

            // Attaches the properties of this.initials as direct properties of Zippy
            $.extend(this,this.initials);

            // Here we'll hold a reference to the DOM element passed in
            // by the $.each function when this plugin was instantiated
            this.$el = $(element);

            // Ensure that the the value of 'this' always references Zippy
            this.changeSlide = $.proxy(this.changeSlide,this);

            // We'll call our initiator function to get things rolling!
            this.init();

            // A little bit of metadata about the instantiated object
            // This property will be incremented everytime a new Zippy carousel is created
            // It provides each carousel with a unique ID
            this.instanceUid = instanceUid++;
        }

        return _Zippy;

    })();

    /**
     * Called once per instance
     * Calls starter methods and associates classes
     */
    Zippy.prototype.init = function(){};

    /**
     * Test to see if CSSTransitions are available
     *
     */
    Zippy.prototype.csstransitionsTest = function(){};

    /**
     * Build out any necessary DOM elements like slide indicators
     *
     */
    Zippy.prototype.build = function(){};

    /**
     * Activate the first slide
     */
    Zippy.prototype.activate = function(){};

    /**
     * Associate event handlers to events
     *
     */
    Zippy.prototype.events = function(){};

    /**
     * Clear timer
     *
     */
    Zippy.prototype.clearTimer = function(){};

    /**
     * Initialize the timer
     *
     */
    Zippy.prototype.initTimer = function(){};

    /**
     * Start the timer
     *
     */
    Zippy.prototype.startTimer = function(){};

    /**
     * Control the logic behind transitioning to the next slide
     * - Determine in what direction we need to animate
     * - Determine which slide will be active next
     *
     */
    Zippy.prototype.changeSlide = function(event){

        /**
         * Control the CSS animations
         *
         */
        Zippy.prototype._cssAnimation = function(nextSlide,direction){};

        /**
         * Control the JS animations
         *
         */
        Zippy.prototype._jsAnimation = function(nextSlide,direction){};

        /**
         * Update the slide indicators once each slide animation has ended
         *
         */
        Zippy.prototype._updateIndicators = function(){};

        /**
         * Initialize the plugin once for each DOM object passed to jQuery
         * @params   object  options object
         * @returns void
         *
         */
        $.fn.Zippy = function(options){

            return this.each(function(index,el){

                el.Zippy = new Zippy(el,options);

            });

        };

    });