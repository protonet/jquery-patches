module("$.event.dblclick");

asyncTest("multiple dblclick events are executed (in order and bubble)", function() {
  expect(3);
  
  $("body").on("dblclick", function() {
    ok(true, 1);
  });
  
  $("body").on("dblclick", function() {
    ok(true, 2);
  });
  
  $("html").on("dblclick", function() {
    ok(true, 3);
  });
  
  // Simulate double click by triggering double tap
  setTimeout(function() {
    $("body").trigger("touchend");
    setTimeout(function() {
      $("body").trigger("touchend");
      
      // Now unbind events and check whether they are correctly removed
      $("body, html").off("dblclick");
      
      // Simulate double click by triggering double tap
      $("body").trigger("touchend");
      setTimeout(function() {
        $("body").trigger("touchend");
        start();
      }, 100);
    }, 100);
  }, 100);
});