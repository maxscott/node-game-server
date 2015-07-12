(function (module) {
  var Vector2d = typeof require === 'undefined' 
    ? module.Vector2d
    : require('./Vector2d');

  console.log(new Vector2d());

})(typeof module === 'undefined' ? this : module);
