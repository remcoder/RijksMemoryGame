/**
 *
 * Provides python-like string interpolation.
 * It supports value interpolation either by keys of a dictionary or
 * by index of an array.
 *
 * Examples::
 *
 *      interpolate("Hello %s.", ["World"]) == "Hello World."
 *      interpolate("Hello %(name)s.", {name: "World"}) == "Hello World."
 *      interpolate("Hello %%.", {name: "World"}) == "Hello %."
 *
 * This version doesn't do any type checks and doesn't provide
 * formating support.
 *
 * http://djangosnippets.org/snippets/2074/
 *
 * RV nov-24-2011: using arguments instead of passing an array
 *
 */

function interpolate(s)
{
		args = Array.prototype.slice.call(arguments,1);
    var i = 0;
    return s.replace(/%(?:\(([^)]+)\))?([%diouxXeEfFgGcrs])/g, function (match, v, t) {
        if (t == "%") return "%";
        return args[v || i++];
    });
}

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();
