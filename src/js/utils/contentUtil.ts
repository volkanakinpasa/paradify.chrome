// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function youTubeTitle(cb: any) {
  const titleEl = document.getElementsByTagName('title')[0];
  const docEl = document.documentElement;
  if (docEl && docEl.addEventListener) {
    docEl.addEventListener(
      'DOMSubtreeModified',
      function (evt) {
        const t: any = evt.target;
        if (t === titleEl || (t.parentNode && t.parentNode === titleEl)) {
          cb();
        }
      },
      false,
    );
  } else {
    // document.onpropertychange = function () {
    //   if (window.event.propertyName == 'title') {
    //     cb();
    //   }
    // };
  }
}

const contentUtil = { youTubeTitle };
export default contentUtil;
