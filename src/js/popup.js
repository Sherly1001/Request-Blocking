$(document).ready(function() {
  $('.block-urls').on('click', '.rm', function() {
    $(this).parent().fadeOut(300, function() {
      if ($(this).parent().children().length < 3) {
        $(this).parent().hide();
      }
      !function(url) {
        chrome.storage.sync.get('block-urls', function(o) {
          delete o['block-urls'][url];
          chrome.storage.sync.set({'block-urls': o['block-urls']});
          chrome.runtime.sendMessage({mes: 'remove', urls: o['block-urls']});
        });
      }($(this).children().first().val());
      $(this).remove();
    });
  });

  $('.block-urls').on('click', '.tg', function() {
    !function($tg) {
      chrome.storage.sync.get('block-urls', function(o) {
        o['block-urls'][$tg.siblings().first().val()] = !tg($tg);
        chrome.storage.sync.set({'block-urls': o['block-urls']});

        chrome.runtime.sendMessage({mes: 'remove', urls: o['block-urls']});
      });
    }($(this));
  });

  $('.add-url').on('click', '.add', add);
  $('.add-url').on('keyup', 'input', function(e) {
    if (e.keyCode == 13) add();
  });
  
  $('footer a').on('click', function(e) {
    let link = $(this).attr('link');
    chrome.tabs.create({url: link});
  });
  
  chrome.storage.sync.get('block-urls', function(o) {
    for (let url in o['block-urls']) {
      $('.block-urls').append(`<div><input type="text" value="${url}" readonly><div class="bt tg"><i class="fas fa-toggle-${o['block-urls'][url] ? 'on' : 'off'}"></i></div><div class="bt rm"><i class="fas fa-trash-alt"></i></div></div>`).show();
    }
  });

  if ($('.block-urls').children().length < 2) $('.block-urls').hide();

  $('.add-url input').focus();

  function add() {
    let url = $('.add-url input').val();
    $('.add-url input').val('');
    let rg = /^(\*|https?|file|ftp):\/\/(\*|.+)\/.+$/gi
    if (rg.test(url) == false) {
      alert('invalid url');
      return;
    }
    !function(url) {
      chrome.storage.sync.get('block-urls', o => {
        let urls = o['block-urls'] || {};
        if (urls[url] === undefined) {
          urls[url] = true;
          chrome.storage.sync.set({'block-urls': urls});
          $('.block-urls').append('<div><input type="text" value="' + url + '" readonly><div class="bt tg"><i class="fas fa-toggle-on"></i></div><div class="bt rm"><i class="fas fa-trash-alt"></i></div></div>').show();
          
          chrome.runtime.sendMessage({mes: 'add', urls: urls});
        } else if (urls[url] === false) {
          tg($(`input[value='${url}']`).siblings().first());
          urls[url] = true;
          chrome.storage.sync.set({'block-urls': urls});
          chrome.runtime.sendMessage({mes: 'add', urls: urls});
        }
      });
    }(url);
  }

  function tg(e) {
    if ($(e).children().hasClass('fa-toggle-on')) {
      $(e).children().removeClass('fa-toggle-on').addClass('fa-toggle-off');
      return true;
    } else {
      $(e).children().removeClass('fa-toggle-off').addClass('fa-toggle-on');
      return false;
    }
  }
});
