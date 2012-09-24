(function($) {
  // add the dataTransfer property for use with the native 'drag' and 'drop' event
  // to capture information about files dropped into the browser window
  $.event.props.push("dataTransfer");
  
  // add the state property for use with the native 'popstate' event
  $.event.props.push("state");
  
  var isTouchDevice = "ontouchstart" in window;
  
  var special = $.event.special;
  
  // Most touch devices do not support the dblclick event
  // This is a polyfill which simulates the behavior
  if (isTouchDevice) {
    special.dblclick = {
      setup: function() {
        $(this).on("touchend.dblclick", special.dblclick.handler);
      },

      teardown: function() {
        $(this).off("touchend.dblclick", special.dblclick.handler);
      },

      handler: function(event) {
        var $element  = $(event.target),
            lastTouch = $element.data("lastTouch") || 0,
            now       = +new Date(),
            delta     = now - lastTouch;
        if (delta > 20 && delta < 500) {
          $element.data("lastTouch", 0).trigger("dblclick");
          event.preventDefault();
        } else {
          $element.data("lastTouch", now);
        }
      }
    };
  }
})(jQuery);