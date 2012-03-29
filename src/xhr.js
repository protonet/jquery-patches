(function($) {

/**
 * Enable cross domain XHR in IE 8 + 9
 *
 * Taken and modified from https://github.com/jaubourg/ajaxHooks/edit/master/src/ajax/xdr.js
 * jQuery ticket: http://bugs.jquery.com/ticket/8283
 */
if (window.XDomainRequest) {
  $.ajaxTransport(function(s) {
    if (s.crossDomain && s.async) {
      if (s.timeout) {
        s.xdrTimeout = s.timeout;
        delete s.timeout;
      }
      var xdr, undef;
      return {
        send: function(_, complete) {
          function callback( status, statusText, responses, responseHeaders ) {
            xdr.onload = xdr.onerror = xdr.ontimeout = jQuery.noop;
            xdr = undef;
            complete(status, statusText, responses, responseHeaders);
          }
          xdr = new XDomainRequest();
          xdr.open(s.type, s.url);
          xdr.onload = function() {
            callback(200, "OK", { text: xdr.responseText }, "Content-Type: " + xdr.contentType);
          };
          xdr.onerror = function() {
            callback(404, "Not Found");
          };
          if (s.xdrTimeout) {
            xdr.ontimeout = function() {
              callback(0, "timeout");
            };
            xdr.timeout = s.xdrTimeout;
          }
          xdr.send((s.hasContent && s.data) || null);
        },
        abort: function() {
          if (xdr) {
            xdr.onerror = $.noop;
            xdr.abort();
          }
        }
      };
    }
  });
}


/**
 * Fix getResponseHeader of cross domain XHR in Firefox
 *
 * Bugzilla ticket: https://bugzilla.mozilla.org/show_bug.cgi?id=608735
 * jQuery ticket:   http://bugs.jquery.com/ticket/10338
 */
var _super = $.ajaxSettings.xhr,
    defaultHeaders = ["Cache-Control", "Content-Language", "Content-Type", "Expires", "Last-Modified", "Pragma"];
$.ajaxSetup({
    xhr: function() {
      var xhr = _super();
      var getAllResponseHeaders = xhr.getAllResponseHeaders;
      
      xhr.getAllResponseHeaders = function() {
        var allHeaders = getAllResponseHeaders.call(xhr);
        if (allHeaders) {
          return allHeaders;
        }
        allHeaders = "";
        $.each(defaultHeaders, function(i, headerName) {
            if (xhr.getResponseHeader(headerName)) {
                allHeaders += headerName + ": " + xhr.getResponseHeader(headerName) + "\n";
            }
        });
        return allHeaders;
      };
      return xhr;
    }
});

})(jQuery);