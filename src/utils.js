(function () {
  var DEBUG, Url, __;

  Url = require('url');

  __ = require('underscore');

  DEBUG = process.env['DEBUG'];

  /*
  Url Options
      url (default false)
          If the string is a URL, not a host string.


      port (default true, unless port 80)
          If the string is should contain a port.
      
      prefix (default true)
          If we should prended the protocol prefix.
  */

  exports.getHostUtilities = function (domain, port, prefix) {
    var HOST_REGEX, addHost, isHostSecure, removeHost;

    if (port == null) port = 80;
    if (prefix == null) prefix = "http";

    addHost = function (url, options) {
      var addHostToHost, urlobj;

      if (options == null) 
        options = {};

      options = __.defaults(options, {
        port: true,
        prefix: true,
        url: false
      });

      addHostToHost = function (host, secure) {
        var newHost = '';

        if (options.prefix && secure) {
            newHost += prefix + "s.";
        }
        else if (options.prefix && !secure) {
            newHost += "";
        }

        newHost += host + "." + domain;

        if (options.port && port !== 80) 
          newHost += ":" + port;

        return newHost;
      };

      if (options.url) {
        urlobj = Url.parse(url, false, true);

        if (urlobj.host) {
          urlobj.host = addHostToHost(urlobj.host, urlobj.protocol === 'https:');
          urlobj.protocol = "http:";
        }

        return Url.format(urlobj);
      } 
      else {
        return addHostToHost(url);
      }
    };

    HOST_REGEX = new RegExp("^(" + prefix + "s\.)?(.*)[.]" + domain + "(:\\d+)?", "i");

    removeHost = function (url, options) {
      var host, removeHostFromHost, secure, urlobj, _ref, _ref2;
      if (options == null) options = {};

      options = __.defaults(options, {
        port: true,
        prefix: true,
        url: false
      });

      removeHostFromHost = function (host) {
        var match = host.match(HOST_REGEX);

        if (match) {
          return {
            host: match[2],
            secure: match[1] === prefix + 's.' ? true : false
          };
        } 
        else {
          if (DEBUG) {
            console.log("Error transforming host: " + host);
          }

          return {
            host: host,
            secure: false
          };
        }
      };

      if (options.url) {
        urlobj = Url.parse(url, false, true);
        _ref = removeHostFromHost(urlobj.host), host = _ref.host, secure = _ref.secure;
        urlobj.host = host;
        urlobj.protcol = secure ? "https:" : "http:";
        url = Url.format(urlobj);

        return url;
      } 
      else {
        _ref2 = removeHostFromHost(url), host = _ref2.host, secure = _ref2.secure;

        return host;
      }
    };

    isHostSecure = function (host) {
      var match = host.match(HOST_REGEX);

      return match && match[1] === prefix + 's.' ? true : false;
    };

    normalizeHost = function (host) {
      var urlobj = Url.parse(host, false, true);

      return urlobj.host.replace('www.', '');
    };

    return [addHost, removeHost, isHostSecure, normalizeHost];
  };

}).call(this);