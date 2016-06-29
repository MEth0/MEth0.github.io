var config = {
  commands: [
    { key: 'a', name: 'Amazon', url: 'https://www.amazon.com', search: '/s/?field-keywords=' },
    { key: 'd', name: 'Drive', url: 'https://drive.google.com/drive', search: '/search?q=' },
    { key: 'e', name: 'Egghead', url: 'https://egghead.io', search: '/search?q=' },
    { key: 'g', name: 'GitHub', url: 'https://github.com', search: '/search?q=' },
    { key: 'h', name: 'Hacker News', url: 'https://hn.algolia.com', search: '/?query=' },
    { key: 'i', name: 'Inbox', url: 'https://inbox.google.com', search: '/search/' },
    { key: 'k', name: 'Keep', url: 'https://keep.google.com', search: '/#search/text=' },
    { key: 'K', name: 'Kickass', url: 'https://kat.cr', search: '/usearch/' },
    { key: 'p', name: 'Product Hunt', url: 'https://www.producthunt.com', search: '/search?q=' },
    { key: 'r', name: 'Reddit', url: 'https://www.reddit.com', search: '/search?q=' },
    { key: 's', name: 'Stack Exchange', url: 'https://stackexchange.com', search: '/search?q=' },
    { key: 'S', name: 'SoundCloud', url: 'https://soundcloud.com', search: '/search?q=' },
    { key: 't', name: 'Twitter', url: 'https://twitter.com', search: '/search?q=' },
    { key: 'u', name: 'Unsplash', url: 'https://unsplash.com', search: '/search?keyword=' },
    { key: 'y', name: 'YouTube', url: 'https://www.youtube.com', search: '/weather?search_query=' },
    { key: 'Y', name: 'YTS', url: 'https://yts.ag', search: '/browse-movies/' }
  ],
  // if none of the keys are matched, this is triggered
  // for DuckDuckGo use: https://duckduckgo.com/?q=
  defaultCommand: 'https://www.google.com/search?q=',
  // the delimiter between the key and your search query
  // e.g. to search GitHub for potatoes you'd type "g:potatoes"
  searchDelimiter: ':'
};

/**
 * Clock
 */
(function() {
    var clock = document.getElementById('js-clock');

    function leftpad(num) {
        return ('0' + num.toString()).slice(-2);
    }

    function setTime() {
        var date = new Date();
        var hours = leftpad(date.getHours());
        var minutes = leftpad(date.getMinutes());
        var seconds = leftpad(date.getSeconds());
        clock.innerHTML = hours + ':' + minutes + ':' + seconds;
    }
    setTime();
    setInterval(setTime, 1000);
})();

/**
 * Help
 */
var Help = (function(config) {
    var head = document.getElementsByTagName('head')[0];
    var sidebar = document.getElementById('js-sidebar');
    var searchHelp = document.getElementById('js-help');
    config.commands.forEach(function(command) {
        var prefetch = document.createElement('link');
        var li = document.createElement('li');
        var anchor = document.createElement('a');
        var key = document.createElement('span');
        var name = document.createElement('span');
        prefetch.rel = 'prerender';
        prefetch.href = command.url;
        key.className = 'help-key';
        key.innerHTML = command.key + config.searchDelimiter + ' ';
        name.className = 'help-name';
        name.innerHTML = command.name;
        anchor.href = command.url;
        head.appendChild(prefetch);
        anchor.appendChild(key);
        anchor.appendChild(name);
        li.appendChild(anchor);
        searchHelp.appendChild(li);
    });
    document.addEventListener('keydown', function(event) {
        if (event.keyCode === 27) sidebar.removeAttribute('data-toggled');
    });
    return {
        toggle: function() {
            var toggle = sidebar.getAttribute('data-toggled') !== 'true';
            sidebar.setAttribute('data-toggled', toggle);
        }
    };
})(config);
/**
 * Form
 */
var Form = (function(config) {
    var searchForm = document.getElementById('js-search-form');
    var searchInput = document.getElementById('js-search-input');
    var urlRegex = /(\b(https?|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        var q = searchInput.value.trim();
        var qSplit = q.split(config.searchDelimiter);
        var validCommand = false;
        var redirect = '';
        if (q === '' || q === '?') {
            Help.toggle();
            searchInput.value = '';
            return false;
        }
        if (q.match(new RegExp(urlRegex))) {
            redirect = q;
        } else {
            redirect = config.defaultCommand + encodeURIComponent(q);
        }
        config.commands.forEach(function(command) {
            if (qSplit[0] === command.key) {
                if (qSplit[1] && command.search) {
                    qSplit.shift();
                    var search = encodeURIComponent(qSplit.join(config.searchDelimiter).trim());
                    redirect = command.url + command.search + search;
                } else {
                    redirect = command.url;
                }
            }
        });
        window.location.href = redirect;
    }, false);
    return {
        searchInput: searchInput
    };
})(config);
