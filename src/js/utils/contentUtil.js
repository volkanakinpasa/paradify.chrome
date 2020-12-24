function youTubeTitle(cb) {
  var titleEl = document.getElementsByTagName('title')[0];
  var docEl = document.documentElement;
  if (docEl && docEl.addEventListener) {
    docEl.addEventListener(
      'DOMSubtreeModified',
      function (evt) {
        var t = evt.target;
        if (t === titleEl || (t.parentNode && t.parentNode === titleEl)) {
          cb();
        }
      },
      false,
    );
  } else {
    document.onpropertychange = function () {
      if (window.event.propertyName == 'title') {
        cb();
      }
    };
  }
}
const contentUtil = { youTubeTitle };
export default contentUtil;
