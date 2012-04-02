(function($) {
  // add the dataTransfer property for use with the native 'drag' and 'drop' event
  // to capture information about files dropped into the browser window
  $.event.props.push("dataTransfer");
  
  // add the state property for use with the native 'popstate' event
  $.event.props.push("state");
})(jQuery);