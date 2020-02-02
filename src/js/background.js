let fun = function() {
  return {cancel: true};
};

chrome.runtime.onMessage.addListener(function(req, sender, sendRes) {
  if (req.mes === 'add') {
    urls = [];
    for (let url in req.urls) {
      if (req.urls[url]) urls.push(url);
    }
    if (urls.length) chrome.webRequest.onBeforeRequest.addListener(fun, {urls: urls}, ['blocking']);
    // console.log(urls);
  } else if (req.mes === 'remove') {
    chrome.webRequest.onBeforeRequest.removeListener(fun);
    urls = [];
    for (let url in req.urls) {
      if (req.urls[url]) urls.push(url);
    }
    if (urls.length) chrome.webRequest.onBeforeRequest.addListener(fun, {urls: urls}, ['blocking']);
    // console.log
  }
  // console.log(req);
});