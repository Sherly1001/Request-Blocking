let fun = function() {
  return {cancel: true};
};

!function() {
  chrome.storage.sync.get('block-urls', function(o) {
    urls = [];
    for (let url in o['block-urls']) {
      if (o['block-urls'][url]) urls.push(url);
    }
    if (urls.length) chrome.webRequest.onBeforeRequest.addListener(fun, {urls: urls}, ['blocking']);
  });
}();

chrome.runtime.onMessage.addListener(function(req, sender, sendRes) {
  if (req.mes === 'add') {
    urls = [];
    for (let url in req.urls) {
      if (req.urls[url]) urls.push(url);
    }
    if (urls.length) chrome.webRequest.onBeforeRequest.addListener(fun, {urls: urls}, ['blocking']);
  } else if (req.mes === 'remove') {
    chrome.webRequest.onBeforeRequest.removeListener(fun);
    urls = [];
    for (let url in req.urls) {
      if (req.urls[url]) urls.push(url);
    }
    if (urls.length) chrome.webRequest.onBeforeRequest.addListener(fun, {urls: urls}, ['blocking']);
  }
});
