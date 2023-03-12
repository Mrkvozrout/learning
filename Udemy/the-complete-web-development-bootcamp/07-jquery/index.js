/// <reference path="../_lib-src/jquery.js" />

$(document).on("keydown", (event) => {
  $("h1").text(event.key);
});
