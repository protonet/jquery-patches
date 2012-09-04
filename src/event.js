(function($) {
  // add the dataTransfer property for use with the native 'drag' and 'drop' event
  // to capture information about files dropped into the browser window
  $.event.props.push("dataTransfer");
  
  // add the state property for use with the native 'popstate' event
  $.event.props.push("state");
  
  var isTouchDevice = "ontouchstart" in window;
  
  // Most touch devices do not support the dblclick event
  // This is a polyfill which simulates the behavior
  if (isTouchDevice) {
    $.event.special.dblclick = {
      setup: function(data) {
        $.event.add(this, "touchend._dblclick", function(event) {
          var now       = new Date().getTime(),
              lastTouch = $.data(event.target, "lastTouch") || now + 1, // the first time this will make delta a negative number
              delta     = now - lastTouch;
          if (delta < 500 && delta > 0) {
            $.event.simulate("dblclick", event.target, event, true);
          } else {
            $.event.simulate("mousedown", event.target, event, true);
          }
          $.data(event.target, "lastTouch", now);
        });
      },

      remove: function(data) {
        $.event.remove(this, "._dblclick");
      }
    };
  }
})(jQuery);