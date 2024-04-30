<template>
    <div>

        <div class=""
            :class="!hide_arrow && slider_arrows_indicators_position == 'arrows_outside_slide' ? 'flex' : 'relative block'"
            :id="'mainSliderContainer_' + Random_string">



            <div class="items-center hidden w-2/12 xl:flex xxl:flex md:flex sm:flex arrow_button"
                v-if="dotsNum > 0 && !hide_arrow && slider_arrows_indicators_position == 'arrows_outside_slider'">

                <div class="w-full">

                    <button class="p-3 mr-5 rounded-full shadow-lg arrow_button_styles" v-on:click="prev()">



                        <svg v-if="direction_property == 'ltr'" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                        </svg>

                        <svg v-if="direction_property == 'rtl'" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>


                    </button>
                </div>
            </div>





            <div class="overflow-hidden " :id="'sliderContainer_' + Random_string" :class="sliderContainerAction()">


                <ul class="flex" :id="'slider_' + Random_string">

                    <div class="items-center justify-center hidden arrow_button xl:flex xxl:flex md:flex sm:flex"
                        v-if=" dotsNum > 0 && !hide_arrow && slider_arrows_indicators_position == 'arrows_indicators_inside_slider'"  :class="direction_property == 'rtl' ? 'arrow_button_next':'arrow_button_prev'">

                        <div class="w-full">

                            <button class="p-3 rounded-full shadow-lg arrow_button_styles" v-on:click.stop="prev()">



                                <svg v-if="direction_property == 'ltr'" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                                </svg>

                                <svg v-if="direction_property == 'rtl'" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>


                            </button>
                        </div>
                    </div>


                    <slot />


                    <div class="items-center justify-center hidden xl:flex xxl:flex md:flex sm:flex arrow_button"
                        v-if="dotsNum > 0 && !hide_arrow && slider_arrows_indicators_position == 'arrows_indicators_inside_slider'" :class="direction_property == 'rtl' ? 'arrow_button_prev':'arrow_button_next'">
                        <div class="w-full">

                            <button class="p-3 rounded-full shadow-lg arrow_button_styles" v-on:click.stop="next()">

                                <svg v-if="direction_property == 'ltr'" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>

                                <svg v-if="direction_property == 'rtl'" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                                </svg>


                            </button>
                        </div>
                    </div>




                </ul>

                <div class="flex justify-center mb-1 space-x-1 " :class="sliderIndicatorsAction()"
                    v-if="slider_arrows_indicators_position != 'arrows_indicators_below_slider'">

                    <button role="button" class="gl-dot" v-for="i in dotsNum" :key="i" v-on:click="setDot(i)"
                        :class="{ 'active': currentDot == i }"><span></span></button>

                </div>


                <div class="flex justify-between pl-5 pr-5"
                    v-if="slider_arrows_indicators_position == 'arrows_indicators_below_slider'">

                    <div class="flex justify-center mb-1 space-x-1 " :class="sliderIndicatorsAction()">

                        <button role="button" class="gl-dot" v-for="i in dotsNum" :key="i" v-on:click="setDot(i)"
                            :class="{ 'active': currentDot == i }"><span></span></button>

                    </div>



                    <div class="flex" v-if="dotsNum > 0" >

                        <div class="flex items-center">

                            <div class="w-full">

                                <button class="p-3 rounded-full arrow_button_styles "
                                    :class="direction_property == 'rtl' ? 'ml-3' : 'mr-3'" v-on:click="prev()">



                                    <svg v-if="direction_property == 'ltr'" xmlns="http://www.w3.org/2000/svg"
                                        class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                        stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                                    </svg>

                                    <svg v-if="direction_property == 'rtl'" xmlns="http://www.w3.org/2000/svg"
                                        class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                        stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>


                                </button>
                            </div>
                        </div>

                        <div class="flex items-center">
                            <div class="w-full">

                                <button class="p-3 rounded-full arrow_button_styles" v-on:click="next()">

                                    <svg v-if="direction_property == 'ltr'" xmlns="http://www.w3.org/2000/svg"
                                        class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                        stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>

                                    <svg v-if="direction_property == 'rtl'" xmlns="http://www.w3.org/2000/svg"
                                        class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                        stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                                    </svg>


                                </button>
                            </div>
                        </div>


                    </div>

                </div>












            </div>



            <div class="items-center hidden w-2/12 xl:flex xxl:flex md:flex sm:flex arrow_button"
                v-if="dotsNum > 0 && !hide_arrow && slider_arrows_indicators_position == 'arrows_outside_slider'">
                <div class="w-full">

                    <button class="p-3 ml-5 rounded-full shadow-lg arrow_button_styles" v-on:click="next()">

                        <svg v-if="direction_property == 'ltr'" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>

                        <svg v-if="direction_property == 'rtl'" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                        </svg>


                    </button>
                </div>
            </div>
















        </div>


    </div>
</template>

<script>
export default {
    props: {
        elements_to_show_prop: {
            type: Number,
            default: 3
        },
        hide_arrow: {
            type: Boolean,
            default: false
        },

        disable_touch: {
            type: Boolean,
            default: false
        },



        direction_property: {
            type: String,
            default: "ltr", // Default to left-to-right
        },


        slider_arrows_indicators_position: {
            type: String,
            default: "arrows_outside_slider"  // arrows_outside_slide,arrows_indicators_inside_slider,arrows_indicators_below_slider
        }


    },

    data: function () {
        return {
            elementsToShow: 3,
            dotsNum: 0,
            currentDot: 1,
            dotsNavigation: [],
            touchStartX: 0,
            isMoving: false,
            initialX: 0,
            initialY: 0,
            Random_string: this.generateRandomString(6),

        };
    },
    mounted() {


        this.elementsToShow = this.elements_to_show_prop;



        this.initSlider();

        if (!this.disable_touch) {
            this.movingActions();
        }




    },
    methods: {



        sliderIndicatorsAction() {


            var class_string = "";


            if (this.direction_property == 'rtl') {


                class_string += " space-x-reverse ";
                class_string += " slider_indicators ";

            }
            else if (this.slider_arrows_indicators_position == 'arrows_indicators_inside_slider') {
                class_string += " slider_indicators ";
            }


            return class_string;

        },

        sliderContainerAction() {


            var class_string = "";


            if (!this.hide_arrow && this.slider_arrows_indicators_position == 'arrows_outside_slider') {


                class_string += " w-12/12 xl:w-8/12 xxl:w-8/12 md:w-8/12 sm:w-8/12";

            }
            else if (this.slider_arrows_indicators_position != 'arrows_outside_slider') {
                class_string += " w-12/12 ";
            }


            return class_string;




        },

        generateRandomString(stringLength) {
            let result = "";
            const alphaNumericCharacters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            const alphabetsLength = alphaNumericCharacters.length;
            for (let i = 0; i < stringLength; i++) {
                result += alphaNumericCharacters.charAt(Math.floor(Math.random() * alphabetsLength));
            }
            return result;
        },

        movingActions() {

            let main_this = this;
            let slider = document.getElementById("slider_" + this.Random_string);


            const handleStart = (e_main) => {
                //e_main.preventDefault();

                // Change the cursor style to "grab" when the mouse is down or touch is initiated
                // slider.style.cursor = "grab";
                slider.style.cursor = "grabbing";

                const handleMove = (e) => {
                    const currentX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
                    const currentY = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY);

                    // Calculate the horizontal and vertical deltas
                    const deltaX = currentX - main_this.initialX;
                    const deltaY = currentY - main_this.initialY;

                    // Check if the horizontal movement is significantly greater than the vertical movement
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                        // Horizontal movement is dominant
                         // Prevent default action only if horizontal movement is detected to be dominant
                           e.preventDefault(); // This line was moved from handleStart
                        if (Math.abs(deltaX) >= 70) { // You can adjust the threshold (70) as needed
                            if (deltaX < 0) {
                                main_this.next(); // Move to the next slide
                            } else {
                                main_this.prev(); // Move to the previous slide
                            }
                            main_this.initialX = currentX; // Update the initial X position
                        }
                    }
                    else {

                        slider.style.cursor = "grab";
                        // e_main.preventDefault();
                    }

                    // Reset the cursor style when the user moves vertically
                    if (Math.abs(deltaY) > Math.abs(deltaX)) {
                        slider.style.cursor = "grab";
                        // e_main.preventDefault();
                    }
                }

                const handleEnd = () => {
                    document.removeEventListener("mousemove", handleMove);
                    document.removeEventListener("touchmove", handleMove);
                    document.removeEventListener("mouseup", handleEnd);
                    document.removeEventListener("touchend", handleEnd);



                    // Reset the cursor style when the mouse is up or touch ends
                    slider.style.cursor = "grab";

                }




                document.addEventListener("mousemove", handleMove);
               document.addEventListener("touchmove", handleMove, { passive: false }); // Add { passive: false } to prevent scrolling

                document.addEventListener("mouseup", handleEnd);
                document.addEventListener("touchend", handleEnd);

                // Store the initial X position
                main_this.initialX = e_main.clientX || (e_main.touches && e_main.touches[0] && e_main.touches[0].clientX);
                main_this.initialY = e_main.clientY || (e_main.touches && e_main.touches[0] && e_main.touches[0].clientY);
            }

            const handleKeyDown = (e) => {


                if (e.key === "ArrowLeft") {
                    main_this.prev(); // Move to the previous slide when the left arrow key is pressed
                } else if (e.key === "ArrowRight") {
                    main_this.next(); // Move to the next slide when the right arrow key is pressed
                }
            }

            const handleKeyUp = () => {
                document.removeEventListener("keydown", handleKeyDown);
                document.removeEventListener("keyup", handleKeyUp);
            }

            slider.addEventListener("mousedown", handleStart);
            slider.addEventListener("touchstart", handleStart);
            document.addEventListener("keydown", handleKeyDown);
            //  document.addEventListener("keyup", handleKeyUp);



        },





        next() {


            if (this.currentDot < this.dotsNavigation.length) {
                this.currentDot++;
                this.setDot(this.currentDot);

            }




        },

        prev() {


            if (this.currentDot > 1) {

                this.currentDot--;

                this.setDot(this.currentDot);

            }

        },

        initSlider() {




            let sliderContainer = document.getElementById("sliderContainer_" + this.Random_string);
            let mainSliderContainer = document.getElementById("mainSliderContainer_" + this.Random_string);

            let slider = document.getElementById("slider_" + this.Random_string);
            let cards_lis = slider.querySelectorAll("li");

            let cards = Array.from(cards_lis).filter((card) => card.parentNode === slider);

            // let cards = slider.querySelectorAll("li");





            let sliderContainerWidth = sliderContainer.clientWidth;
            let cardwidth = sliderContainerWidth / this.elementsToShow;




            if (this.elementsToShow > 1) {

                if (document.body.clientWidth < 1000) {
                    this.elementsToShow = 1;
                    cardwidth = this.hide_arrow ? mainSliderContainer.clientWidth : sliderContainerWidth;
                } else if (document.body.clientWidth < 1500) {
                    this.elementsToShow = 2;
                }

            } else {
                this.elementsToShow = 1;
                cardwidth = this.hide_arrow ? mainSliderContainer.clientWidth : sliderContainerWidth;
            }







            if (cards.length > 1) {
                this.dotsNum = this.elementsToShow == 1 ? cards.length : cards.length - this.elementsToShow + 1;

                let navigation_no_between_slides = this.elementsToShow == 1 ? (cardwidth * (cards.length)) / this.dotsNum : (cardwidth * (cards.length - this.elementsToShow)) / (this.dotsNum - 1);
                this.dotsNavigation = [];

                for (let i = 0; i < this.dotsNum; i++) {


                    this.dotsNavigation.push(navigation_no_between_slides * i); // Add numbers to the array
                }

            }




            slider.style.width = cards.length * cardwidth + "px";

            slider.style.transition = "margin";
            slider.style.transitionDuration = "1s";

            for (let index = 0; index < cards.length; index++) {

                const element = cards[index];
                element.style.width = cardwidth + 'px';


            }




        },






        setDot(index) {


            let slider = document.getElementById("slider_" + this.Random_string);


            if (this.direction_property == "rtl") {

                slider.style.marginRight = -this.dotsNavigation[index - 1] + 'px';


            }
            else {

                slider.style.marginLeft = -this.dotsNavigation[index - 1] + 'px';

            }

            this.currentDot = index;

        }

    },
};
</script>

<style lang="scss" scoped>
.gl-dot.active span,
.gl-dot:hover span {
    opacity: .9;

    height: 1.56rem;
    width: 1.56rem;
    max-width: 1.56rem;
}

.gl-dot span {
    cursor: pointer;
    height: 1.25rem;
    width: 1.25rem;
    max-width: 1.25rem;
    display: inline-block;
    border-radius: 100%;
    /* background: #000; */
    opacity: .2;
    height: 1.25rem;
    width: 1.25rem;
    max-width: 1.25rem;


}




.arrow_button_prev {

    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
   /* width: 8%; */
    padding: 10px;
    /* color: #fff; */
    text-align: center;
    /* background: 0 0; */
    /* border: 0; */
    /* opacity: .5; */
    transition: opacity .15s ease;

}


.arrow_button_next {

    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
   /* width: 8%; */
    padding: 10px;
    /* color: #fff; */
    text-align: center;
    /* background: 0 0; */
    /* border: 0; */
    /* opacity: .5; */
    transition: opacity .15s ease;

}

.slider_indicators {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    display: flex;
    justify-content: center;
    padding: 0;
    margin-right: 15%;
    margin-bottom: 1rem;
    margin-left: 15%;
}
</style>



