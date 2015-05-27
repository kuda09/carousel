(function ($, window, document, undefined) {

    "use strict";


    var pluginName = 'bCarousel',
        defaults = {
            arrows: true,
            autoplay: false,
            nextArrow: '<a class="carousel-next" data-role="none" aria-label="next"> Next </a> ',
            previousArrow: '<a class="carousel-previous" data-role="none" aria-label="previous"> Previous </a> ',
            autoPlay: 3000,
            easing: 'linear',
            rtl: false,
            touchMove: true,
            useCss: true,
            swipe: true,
            swipeToSlide: true,
            slidesToScroll: 1,
            slidesToShow: 3,
            centerMode: false,
            slideWidth: 200,
            initialSlide: 0,
            currentLeft: null,
            swipeLeft: null,
            cssEase: 'ease',
            speed: 500,
            slide: '',
            infinite: false,
            fade: false

        },
        self;


    function Plugin(element, options) {


        self = this;

        self.$carousel = $(element);

        self.options = $.extend( defaults, options);

        self.currentSlide = self.options.initialSlide;
        self.init();
    }

    Plugin.prototype.init = function () {
        if (!(self.$carousel.hasClass('carousel-initialised'))) {

            $(self.$carousel).addClass('carousel-initialised');

            //all the methods that will be applied here
            self.buildOut();
            self.initializeEvents();



            self.$carousel.trigger('init', [self]);
        }

    };

    Plugin.prototype.buildOut = function (){

        self.$slides = self.$carousel.children().addClass('carousel-slide');

        self.slideCount = self.$slides.length;

        self.$slideTrack = self.$slides.wrapAll('<div class="carousel-track"/>').parent();

        self.$list = self.$slideTrack.wrap('<div class="carousel-list" aria-live="polite"/>').parent();

        self.$slides.each(function(index, element){
            $(element).attr('data-carousel-index', index);
        });

        self.buildArrows();
        self.setSlideClasses(self.currentSlide);
        self.setDimensions();
    }

    Plugin.prototype.setDimensions = function (){

        self.$slideTrack.width(self.slideCount * self.options.slideWidth);
        self.$list.width(self.options.slidesToShow * self.options.slideWidth);

    }

    Plugin.prototype.buildArrows = function (index){

        if(self.options.arrows === true && self.slideCount > self.options.slidesToShow){

            self.$prevArrow = self.options.prevArrow;
            self.$nextArrow = self.options.nextArrow;


            self.$prevArrow = $(self.options.previousArrow);
            self.$nextArrow = $(self.options.nextArrow);

            self.$prevArrow.appendTo(self.$carousel);
            self.$nextArrow.appendTo(self.$carousel);

        }
    }

    Plugin.prototype.setSlideClasses = function (index){

        if (index >= 0 && index <= (self.slideCount - self.options.slidesToShow)) {
            self.$slides.slice(index, index + self.options.slidesToShow).addClass('carousel-active').attr('aria-hidden', 'false');
        }

    }

    Plugin.prototype.initializeEvents = function (){

        self.$prevArrow.on('click', {message: 'previous'}, self.changeSlide);
        self.$nextArrow.on('click', {message: 'next'}, self.changeSlide);

    }

    Plugin.prototype.changeSlide = function (event){

        var $target = $(event.target),
            slideOffset,
            indexOffset;



        indexOffset = self.options.slidesToScroll;



        if ($target.is('a')) {
            event.preventDefault();
        }
        switch (event.data.message) {

            case 'previous':

                slideOffset = self.options.slidesToScroll;

                if (self.slideCount > self.options.slidesToShow) {
                    self.slideHandler(self.currentSlide - slideOffset); //minus the slideOffset
                }
                break;
            case 'next':

                slideOffset = self.options.slidesToScroll;

                if (self.slideCount > self.options.slidesToShow) {
                    self.slideHandler(self.currentSlide + slideOffset); //add the slideOffset
                }
                break;
            default:
                return;
        }
    }

    Plugin.prototype.slideHandler = function (index){
        var targetSlide,
            animSlide,
            slideLeft,
            targetLeft = null;

        if(self.currentSlide === index) { // donot animate anything if he index is equal to the slidesToScroll;
            return;
        }

        if(self.slideCount <= self.slidesToShow){ //donot animate when the slideCount is less than slidesToShow;
            return;
        }

        targetSlide = index //make the targetSlide the index
        targetLeft = self.getLeft(targetSlide); //200
        slideLeft = self.getLeft(self.currentSlide); //

        self.currentLeft = slideLeft;


        if(index < 0){
            targetSlide = self.currentSlide;
            self.animateSlide(slideLeft);
        } else if (index < 0 || index < (self.slideCount - self.options.slidesToScroll)){
            targetSlide = self.currentSlide;
            self.animateSlide(slideLeft);
        }


    }


    Plugin.prototype.getLeft = function (slideIndex){

        var targetLeft;

        self.slideOffset = 0;

        if(slideIndex + self.options.slideToShow > self.slideCount){ //if the index and slidesToShow is greater than slideCount
            self.slideOffset = ((slideIndex + self.options.slidesToShow) - self.slideCount) * self.slideWidth
            //
        }

        if (self.slideCount <= self.options.slidesToShow) {
            self.slideOffset = 0;
        }


        targetLeft = ((slideIndex * self.options.slideWidth * -1)) + self.slideOffset;

        return targetLeft; //200
    }


    Plugin.prototype.animateSlide = function (targetLeft) {

        if (self.options.rtl === true) {
            targetLeft = -targetLeft;
        }

        self.$slideTrack.animate({
            left: targetLeft
        }, self.options.speed, self.options.easing);
    };





    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new Plugin(this, options));
            }
        });
    };

})
(jQuery, window, document);