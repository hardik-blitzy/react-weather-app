/**
 * script.js
 * DOM-ready initialization script.
 *
 * @module script
 * @description Executed on document ready to:
 * - Hide the loading spinner (#spinner element)
 * - Configure jQuery noConflict mode to prevent $ conflicts
 *
 * This script is imported via autoload.js for side-effect execution.
 * It has no exports - all functionality runs on DOM-ready.
 *
 * @requires jquery - jQuery library for DOM manipulation
 * @see ../../../autoload.js - Imports this module for side effects
 */
import jQuery from "jquery";


jQuery(($)=>{
    $.noConflict();

    //remove the loader on page load
   $("#spinner").css({"display":"none"});
});