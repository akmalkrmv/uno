(function(f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else {
    if (typeof define === "function" && define.amd) {
      define([], f);
    } else {
      var g;
      if (typeof window !== "undefined") {
        g = window;
      } else {
        if (typeof global !== "undefined") {
          g = global;
        } else {
          if (typeof self !== "undefined") {
            g = self;
          } else {
            g = this;
          }
        }
      }
      g.adapter = f();
    }
  }
})(function() {
  var define, module, exports;
  return function() {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;
            if (!f && c) {
              return c(i, !0);
            }
            if (u) {
              return u(i, !0);
            }
            var a = new Error("Cannot find module '" + i + "'");
            throw a.code = "MODULE_NOT_FOUND", a;
          }
          var p = n[i] = {exports:{}};
          e[i][0].call(p.exports, function(r) {
            var n = e[i][1][r];
            return o(n || r);
          }, p, p.exports, r, e, n, t);
        }
        return n[i].exports;
      }
      for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
        o(t[i]);
      }
      return o;
    }
    return r;
  }()({1:[function(require, module, exports) {
    var _adapter_factory = require("./adapter_factory.js");
    var adapter = (0, _adapter_factory.adapterFactory)({window:window});
    module.exports = adapter;
  }, {"./adapter_factory.js":2}], 2:[function(require, module, exports) {
    Object.defineProperty(exports, "__esModule", {value:true});
    exports.adapterFactory = adapterFactory;
    var _utils = require("./utils");
    var utils = _interopRequireWildcard(_utils);
    var _chrome_shim = require("./chrome/chrome_shim");
    var chromeShim = _interopRequireWildcard(_chrome_shim);
    var _edge_shim = require("./edge/edge_shim");
    var edgeShim = _interopRequireWildcard(_edge_shim);
    var _firefox_shim = require("./firefox/firefox_shim");
    var firefoxShim = _interopRequireWildcard(_firefox_shim);
    var _safari_shim = require("./safari/safari_shim");
    var safariShim = _interopRequireWildcard(_safari_shim);
    var _common_shim = require("./common_shim");
    var commonShim = _interopRequireWildcard(_common_shim);
    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) {
        return obj;
      } else {
        var newObj = {};
        if (obj != null) {
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              newObj[key] = obj[key];
            }
          }
        }
        newObj.default = obj;
        return newObj;
      }
    }
    function adapterFactory() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, window = _ref.window;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {shimChrome:true, shimFirefox:true, shimEdge:true, shimSafari:true};
      var logging = utils.log;
      var browserDetails = utils.detectBrowser(window);
      var adapter = {browserDetails:browserDetails, commonShim:commonShim, extractVersion:utils.extractVersion, disableLog:utils.disableLog, disableWarnings:utils.disableWarnings};
      switch(browserDetails.browser) {
        case "chrome":
          if (!chromeShim || !chromeShim.shimPeerConnection || !options.shimChrome) {
            logging("Chrome shim is not included in this adapter release.");
            return adapter;
          }
          logging("adapter.js shimming chrome.");
          adapter.browserShim = chromeShim;
          chromeShim.shimGetUserMedia(window);
          chromeShim.shimMediaStream(window);
          chromeShim.shimPeerConnection(window);
          chromeShim.shimOnTrack(window);
          chromeShim.shimAddTrackRemoveTrack(window);
          chromeShim.shimGetSendersWithDtmf(window);
          chromeShim.shimGetStats(window);
          chromeShim.shimSenderReceiverGetStats(window);
          chromeShim.fixNegotiationNeeded(window);
          commonShim.shimRTCIceCandidate(window);
          commonShim.shimConnectionState(window);
          commonShim.shimMaxMessageSize(window);
          commonShim.shimSendThrowTypeError(window);
          commonShim.removeAllowExtmapMixed(window);
          break;
        case "firefox":
          if (!firefoxShim || !firefoxShim.shimPeerConnection || !options.shimFirefox) {
            logging("Firefox shim is not included in this adapter release.");
            return adapter;
          }
          logging("adapter.js shimming firefox.");
          adapter.browserShim = firefoxShim;
          firefoxShim.shimGetUserMedia(window);
          firefoxShim.shimPeerConnection(window);
          firefoxShim.shimOnTrack(window);
          firefoxShim.shimRemoveStream(window);
          firefoxShim.shimSenderGetStats(window);
          firefoxShim.shimReceiverGetStats(window);
          firefoxShim.shimRTCDataChannel(window);
          firefoxShim.shimAddTransceiver(window);
          firefoxShim.shimCreateOffer(window);
          firefoxShim.shimCreateAnswer(window);
          commonShim.shimRTCIceCandidate(window);
          commonShim.shimConnectionState(window);
          commonShim.shimMaxMessageSize(window);
          commonShim.shimSendThrowTypeError(window);
          break;
        case "edge":
          if (!edgeShim || !edgeShim.shimPeerConnection || !options.shimEdge) {
            logging("MS edge shim is not included in this adapter release.");
            return adapter;
          }
          logging("adapter.js shimming edge.");
          adapter.browserShim = edgeShim;
          edgeShim.shimGetUserMedia(window);
          edgeShim.shimGetDisplayMedia(window);
          edgeShim.shimPeerConnection(window);
          edgeShim.shimReplaceTrack(window);
          commonShim.shimMaxMessageSize(window);
          commonShim.shimSendThrowTypeError(window);
          break;
        case "safari":
          if (!safariShim || !options.shimSafari) {
            logging("Safari shim is not included in this adapter release.");
            return adapter;
          }
          logging("adapter.js shimming safari.");
          adapter.browserShim = safariShim;
          safariShim.shimRTCIceServerUrls(window);
          safariShim.shimCreateOfferLegacy(window);
          safariShim.shimCallbacksAPI(window);
          safariShim.shimLocalStreamsAPI(window);
          safariShim.shimRemoteStreamsAPI(window);
          safariShim.shimTrackEventTransceiver(window);
          safariShim.shimGetUserMedia(window);
          commonShim.shimRTCIceCandidate(window);
          commonShim.shimMaxMessageSize(window);
          commonShim.shimSendThrowTypeError(window);
          commonShim.removeAllowExtmapMixed(window);
          break;
        default:
          logging("Unsupported browser!");
          break;
      }
      return adapter;
    }
  }, {"./chrome/chrome_shim":3, "./common_shim":6, "./edge/edge_shim":7, "./firefox/firefox_shim":11, "./safari/safari_shim":14, "./utils":15}], 3:[function(require, module, exports) {
    Object.defineProperty(exports, "__esModule", {value:true});
    exports.shimGetDisplayMedia = exports.shimGetUserMedia = undefined;
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    var _getusermedia = require("./getusermedia");
    Object.defineProperty(exports, "shimGetUserMedia", {enumerable:true, get:function get() {
      return _getusermedia.shimGetUserMedia;
    }});
    var _getdisplaymedia = require("./getdisplaymedia");
    Object.defineProperty(exports, "shimGetDisplayMedia", {enumerable:true, get:function get() {
      return _getdisplaymedia.shimGetDisplayMedia;
    }});
    exports.shimMediaStream = shimMediaStream;
    exports.shimOnTrack = shimOnTrack;
    exports.shimGetSendersWithDtmf = shimGetSendersWithDtmf;
    exports.shimGetStats = shimGetStats;
    exports.shimSenderReceiverGetStats = shimSenderReceiverGetStats;
    exports.shimAddTrackRemoveTrackWithNative = shimAddTrackRemoveTrackWithNative;
    exports.shimAddTrackRemoveTrack = shimAddTrackRemoveTrack;
    exports.shimPeerConnection = shimPeerConnection;
    exports.fixNegotiationNeeded = fixNegotiationNeeded;
    var _utils = require("../utils.js");
    var utils = _interopRequireWildcard(_utils);
    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) {
        return obj;
      } else {
        var newObj = {};
        if (obj != null) {
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              newObj[key] = obj[key];
            }
          }
        }
        newObj.default = obj;
        return newObj;
      }
    }
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {value:value, enumerable:true, configurable:true, writable:true});
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function shimMediaStream(window) {
      window.MediaStream = window.MediaStream || window.webkitMediaStream;
    }
    function shimOnTrack(window) {
      if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" && window.RTCPeerConnection && !("ontrack" in window.RTCPeerConnection.prototype)) {
        Object.defineProperty(window.RTCPeerConnection.prototype, "ontrack", {get:function get() {
          return this._ontrack;
        }, set:function set(f) {
          if (this._ontrack) {
            this.removeEventListener("track", this._ontrack);
          }
          this.addEventListener("track", this._ontrack = f);
        }, enumerable:true, configurable:true});
        var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
        window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
          var _this = this;
          if (!this._ontrackpoly) {
            this._ontrackpoly = function(e) {
              e.stream.addEventListener("addtrack", function(te) {
                var receiver = void 0;
                if (window.RTCPeerConnection.prototype.getReceivers) {
                  receiver = _this.getReceivers().find(function(r) {
                    return r.track && r.track.id === te.track.id;
                  });
                } else {
                  receiver = {track:te.track};
                }
                var event = new Event("track");
                event.track = te.track;
                event.receiver = receiver;
                event.transceiver = {receiver:receiver};
                event.streams = [e.stream];
                _this.dispatchEvent(event);
              });
              e.stream.getTracks().forEach(function(track) {
                var receiver = void 0;
                if (window.RTCPeerConnection.prototype.getReceivers) {
                  receiver = _this.getReceivers().find(function(r) {
                    return r.track && r.track.id === track.id;
                  });
                } else {
                  receiver = {track:track};
                }
                var event = new Event("track");
                event.track = track;
                event.receiver = receiver;
                event.transceiver = {receiver:receiver};
                event.streams = [e.stream];
                _this.dispatchEvent(event);
              });
            };
            this.addEventListener("addstream", this._ontrackpoly);
          }
          return origSetRemoteDescription.apply(this, arguments);
        };
      } else {
        utils.wrapPeerConnectionEvent(window, "track", function(e) {
          if (!e.transceiver) {
            Object.defineProperty(e, "transceiver", {value:{receiver:e.receiver}});
          }
          return e;
        });
      }
    }
    function shimGetSendersWithDtmf(window) {
      if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" && window.RTCPeerConnection && !("getSenders" in window.RTCPeerConnection.prototype) && "createDTMFSender" in window.RTCPeerConnection.prototype) {
        var shimSenderWithDtmf = function shimSenderWithDtmf(pc, track) {
          return {track:track, get dtmf() {
            if (this._dtmf === undefined) {
              if (track.kind === "audio") {
                this._dtmf = pc.createDTMFSender(track);
              } else {
                this._dtmf = null;
              }
            }
            return this._dtmf;
          }, _pc:pc};
        };
        if (!window.RTCPeerConnection.prototype.getSenders) {
          window.RTCPeerConnection.prototype.getSenders = function getSenders() {
            this._senders = this._senders || [];
            return this._senders.slice();
          };
          var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
          window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
            var sender = origAddTrack.apply(this, arguments);
            if (!sender) {
              sender = shimSenderWithDtmf(this, track);
              this._senders.push(sender);
            }
            return sender;
          };
          var origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
          window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
            origRemoveTrack.apply(this, arguments);
            var idx = this._senders.indexOf(sender);
            if (idx !== -1) {
              this._senders.splice(idx, 1);
            }
          };
        }
        var origAddStream = window.RTCPeerConnection.prototype.addStream;
        window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
          var _this2 = this;
          this._senders = this._senders || [];
          origAddStream.apply(this, [stream]);
          stream.getTracks().forEach(function(track) {
            _this2._senders.push(shimSenderWithDtmf(_this2, track));
          });
        };
        var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
        window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
          var _this3 = this;
          this._senders = this._senders || [];
          origRemoveStream.apply(this, [stream]);
          stream.getTracks().forEach(function(track) {
            var sender = _this3._senders.find(function(s) {
              return s.track === track;
            });
            if (sender) {
              _this3._senders.splice(_this3._senders.indexOf(sender), 1);
            }
          });
        };
      } else {
        if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" && window.RTCPeerConnection && "getSenders" in window.RTCPeerConnection.prototype && "createDTMFSender" in window.RTCPeerConnection.prototype && window.RTCRtpSender && !("dtmf" in window.RTCRtpSender.prototype)) {
          var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
          window.RTCPeerConnection.prototype.getSenders = function getSenders() {
            var _this4 = this;
            var senders = origGetSenders.apply(this, []);
            senders.forEach(function(sender) {
              return sender._pc = _this4;
            });
            return senders;
          };
          Object.defineProperty(window.RTCRtpSender.prototype, "dtmf", {get:function get() {
            if (this._dtmf === undefined) {
              if (this.track.kind === "audio") {
                this._dtmf = this._pc.createDTMFSender(this.track);
              } else {
                this._dtmf = null;
              }
            }
            return this._dtmf;
          }});
        }
      }
    }
    function shimGetStats(window) {
      if (!window.RTCPeerConnection) {
        return;
      }
      var origGetStats = window.RTCPeerConnection.prototype.getStats;
      window.RTCPeerConnection.prototype.getStats = function getStats() {
        var _this5 = this;
        var _arguments = Array.prototype.slice.call(arguments), selector = _arguments[0], onSucc = _arguments[1], onErr = _arguments[2];
        if (arguments.length > 0 && typeof selector === "function") {
          return origGetStats.apply(this, arguments);
        }
        if (origGetStats.length === 0 && (arguments.length === 0 || typeof selector !== "function")) {
          return origGetStats.apply(this, []);
        }
        var fixChromeStats_ = function fixChromeStats_(response) {
          var standardReport = {};
          var reports = response.result();
          reports.forEach(function(report) {
            var standardStats = {id:report.id, timestamp:report.timestamp, type:{localcandidate:"local-candidate", remotecandidate:"remote-candidate"}[report.type] || report.type};
            report.names().forEach(function(name) {
              standardStats[name] = report.stat(name);
            });
            standardReport[standardStats.id] = standardStats;
          });
          return standardReport;
        };
        var makeMapStats = function makeMapStats(stats) {
          return new Map(Object.keys(stats).map(function(key) {
            return [key, stats[key]];
          }));
        };
        if (arguments.length >= 2) {
          var successCallbackWrapper_ = function successCallbackWrapper_(response) {
            onSucc(makeMapStats(fixChromeStats_(response)));
          };
          return origGetStats.apply(this, [successCallbackWrapper_, selector]);
        }
        return (new Promise(function(resolve, reject) {
          origGetStats.apply(_this5, [function(response) {
            resolve(makeMapStats(fixChromeStats_(response)));
          }, reject]);
        })).then(onSucc, onErr);
      };
    }
    function shimSenderReceiverGetStats(window) {
      if (!((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" && window.RTCPeerConnection && window.RTCRtpSender && window.RTCRtpReceiver)) {
        return;
      }
      if (!("getStats" in window.RTCRtpSender.prototype)) {
        var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
        if (origGetSenders) {
          window.RTCPeerConnection.prototype.getSenders = function getSenders() {
            var _this6 = this;
            var senders = origGetSenders.apply(this, []);
            senders.forEach(function(sender) {
              return sender._pc = _this6;
            });
            return senders;
          };
        }
        var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
        if (origAddTrack) {
          window.RTCPeerConnection.prototype.addTrack = function addTrack() {
            var sender = origAddTrack.apply(this, arguments);
            sender._pc = this;
            return sender;
          };
        }
        window.RTCRtpSender.prototype.getStats = function getStats() {
          var sender = this;
          return this._pc.getStats().then(function(result) {
            return utils.filterStats(result, sender.track, true);
          });
        };
      }
      if (!("getStats" in window.RTCRtpReceiver.prototype)) {
        var origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
        if (origGetReceivers) {
          window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
            var _this7 = this;
            var receivers = origGetReceivers.apply(this, []);
            receivers.forEach(function(receiver) {
              return receiver._pc = _this7;
            });
            return receivers;
          };
        }
        utils.wrapPeerConnectionEvent(window, "track", function(e) {
          e.receiver._pc = e.srcElement;
          return e;
        });
        window.RTCRtpReceiver.prototype.getStats = function getStats() {
          var receiver = this;
          return this._pc.getStats().then(function(result) {
            return utils.filterStats(result, receiver.track, false);
          });
        };
      }
      if (!("getStats" in window.RTCRtpSender.prototype && "getStats" in window.RTCRtpReceiver.prototype)) {
        return;
      }
      var origGetStats = window.RTCPeerConnection.prototype.getStats;
      window.RTCPeerConnection.prototype.getStats = function getStats() {
        if (arguments.length > 0 && arguments[0] instanceof window.MediaStreamTrack) {
          var track = arguments[0];
          var sender = void 0;
          var receiver = void 0;
          var err = void 0;
          this.getSenders().forEach(function(s) {
            if (s.track === track) {
              if (sender) {
                err = true;
              } else {
                sender = s;
              }
            }
          });
          this.getReceivers().forEach(function(r) {
            if (r.track === track) {
              if (receiver) {
                err = true;
              } else {
                receiver = r;
              }
            }
            return r.track === track;
          });
          if (err || sender && receiver) {
            return Promise.reject(new DOMException("There are more than one sender or receiver for the track.", "InvalidAccessError"));
          } else {
            if (sender) {
              return sender.getStats();
            } else {
              if (receiver) {
                return receiver.getStats();
              }
            }
          }
          return Promise.reject(new DOMException("There is no sender or receiver for the track.", "InvalidAccessError"));
        }
        return origGetStats.apply(this, arguments);
      };
    }
    function shimAddTrackRemoveTrackWithNative(window) {
      window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
        var _this8 = this;
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        return Object.keys(this._shimmedLocalStreams).map(function(streamId) {
          return _this8._shimmedLocalStreams[streamId][0];
        });
      };
      var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
      window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
        if (!stream) {
          return origAddTrack.apply(this, arguments);
        }
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        var sender = origAddTrack.apply(this, arguments);
        if (!this._shimmedLocalStreams[stream.id]) {
          this._shimmedLocalStreams[stream.id] = [stream, sender];
        } else {
          if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) {
            this._shimmedLocalStreams[stream.id].push(sender);
          }
        }
        return sender;
      };
      var origAddStream = window.RTCPeerConnection.prototype.addStream;
      window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
        var _this9 = this;
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        stream.getTracks().forEach(function(track) {
          var alreadyExists = _this9.getSenders().find(function(s) {
            return s.track === track;
          });
          if (alreadyExists) {
            throw new DOMException("Track already exists.", "InvalidAccessError");
          }
        });
        var existingSenders = this.getSenders();
        origAddStream.apply(this, arguments);
        var newSenders = this.getSenders().filter(function(newSender) {
          return existingSenders.indexOf(newSender) === -1;
        });
        this._shimmedLocalStreams[stream.id] = [stream].concat(newSenders);
      };
      var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
      window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        delete this._shimmedLocalStreams[stream.id];
        return origRemoveStream.apply(this, arguments);
      };
      var origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
      window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
        var _this10 = this;
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        if (sender) {
          Object.keys(this._shimmedLocalStreams).forEach(function(streamId) {
            var idx = _this10._shimmedLocalStreams[streamId].indexOf(sender);
            if (idx !== -1) {
              _this10._shimmedLocalStreams[streamId].splice(idx, 1);
            }
            if (_this10._shimmedLocalStreams[streamId].length === 1) {
              delete _this10._shimmedLocalStreams[streamId];
            }
          });
        }
        return origRemoveTrack.apply(this, arguments);
      };
    }
    function shimAddTrackRemoveTrack(window) {
      if (!window.RTCPeerConnection) {
        return;
      }
      var browserDetails = utils.detectBrowser(window);
      if (window.RTCPeerConnection.prototype.addTrack && browserDetails.version >= 65) {
        return shimAddTrackRemoveTrackWithNative(window);
      }
      var origGetLocalStreams = window.RTCPeerConnection.prototype.getLocalStreams;
      window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
        var _this11 = this;
        var nativeStreams = origGetLocalStreams.apply(this);
        this._reverseStreams = this._reverseStreams || {};
        return nativeStreams.map(function(stream) {
          return _this11._reverseStreams[stream.id];
        });
      };
      var origAddStream = window.RTCPeerConnection.prototype.addStream;
      window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
        var _this12 = this;
        this._streams = this._streams || {};
        this._reverseStreams = this._reverseStreams || {};
        stream.getTracks().forEach(function(track) {
          var alreadyExists = _this12.getSenders().find(function(s) {
            return s.track === track;
          });
          if (alreadyExists) {
            throw new DOMException("Track already exists.", "InvalidAccessError");
          }
        });
        if (!this._reverseStreams[stream.id]) {
          var newStream = new window.MediaStream(stream.getTracks());
          this._streams[stream.id] = newStream;
          this._reverseStreams[newStream.id] = stream;
          stream = newStream;
        }
        origAddStream.apply(this, [stream]);
      };
      var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
      window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
        this._streams = this._streams || {};
        this._reverseStreams = this._reverseStreams || {};
        origRemoveStream.apply(this, [this._streams[stream.id] || stream]);
        delete this._reverseStreams[this._streams[stream.id] ? this._streams[stream.id].id : stream.id];
        delete this._streams[stream.id];
      };
      window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
        var _this13 = this;
        if (this.signalingState === "closed") {
          throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.", "InvalidStateError");
        }
        var streams = [].slice.call(arguments, 1);
        if (streams.length !== 1 || !streams[0].getTracks().find(function(t) {
          return t === track;
        })) {
          throw new DOMException("The adapter.js addTrack polyfill only supports a single " + " stream which is associated with the specified track.", "NotSupportedError");
        }
        var alreadyExists = this.getSenders().find(function(s) {
          return s.track === track;
        });
        if (alreadyExists) {
          throw new DOMException("Track already exists.", "InvalidAccessError");
        }
        this._streams = this._streams || {};
        this._reverseStreams = this._reverseStreams || {};
        var oldStream = this._streams[stream.id];
        if (oldStream) {
          oldStream.addTrack(track);
          Promise.resolve().then(function() {
            _this13.dispatchEvent(new Event("negotiationneeded"));
          });
        } else {
          var newStream = new window.MediaStream([track]);
          this._streams[stream.id] = newStream;
          this._reverseStreams[newStream.id] = stream;
          this.addStream(newStream);
        }
        return this.getSenders().find(function(s) {
          return s.track === track;
        });
      };
      function replaceInternalStreamId(pc, description) {
        var sdp = description.sdp;
        Object.keys(pc._reverseStreams || []).forEach(function(internalId) {
          var externalStream = pc._reverseStreams[internalId];
          var internalStream = pc._streams[externalStream.id];
          sdp = sdp.replace(new RegExp(internalStream.id, "g"), externalStream.id);
        });
        return new RTCSessionDescription({type:description.type, sdp:sdp});
      }
      function replaceExternalStreamId(pc, description) {
        var sdp = description.sdp;
        Object.keys(pc._reverseStreams || []).forEach(function(internalId) {
          var externalStream = pc._reverseStreams[internalId];
          var internalStream = pc._streams[externalStream.id];
          sdp = sdp.replace(new RegExp(externalStream.id, "g"), internalStream.id);
        });
        return new RTCSessionDescription({type:description.type, sdp:sdp});
      }
      ["createOffer", "createAnswer"].forEach(function(method) {
        var nativeMethod = window.RTCPeerConnection.prototype[method];
        var methodObj = _defineProperty({}, method, function() {
          var _this14 = this;
          var args = arguments;
          var isLegacyCall = arguments.length && typeof arguments[0] === "function";
          if (isLegacyCall) {
            return nativeMethod.apply(this, [function(description) {
              var desc = replaceInternalStreamId(_this14, description);
              args[0].apply(null, [desc]);
            }, function(err) {
              if (args[1]) {
                args[1].apply(null, err);
              }
            }, arguments[2]]);
          }
          return nativeMethod.apply(this, arguments).then(function(description) {
            return replaceInternalStreamId(_this14, description);
          });
        });
        window.RTCPeerConnection.prototype[method] = methodObj[method];
      });
      var origSetLocalDescription = window.RTCPeerConnection.prototype.setLocalDescription;
      window.RTCPeerConnection.prototype.setLocalDescription = function setLocalDescription() {
        if (!arguments.length || !arguments[0].type) {
          return origSetLocalDescription.apply(this, arguments);
        }
        arguments[0] = replaceExternalStreamId(this, arguments[0]);
        return origSetLocalDescription.apply(this, arguments);
      };
      var origLocalDescription = Object.getOwnPropertyDescriptor(window.RTCPeerConnection.prototype, "localDescription");
      Object.defineProperty(window.RTCPeerConnection.prototype, "localDescription", {get:function get() {
        var description = origLocalDescription.get.apply(this);
        if (description.type === "") {
          return description;
        }
        return replaceInternalStreamId(this, description);
      }});
      window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
        var _this15 = this;
        if (this.signalingState === "closed") {
          throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.", "InvalidStateError");
        }
        if (!sender._pc) {
          throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack " + "does not implement interface RTCRtpSender.", "TypeError");
        }
        var isLocal = sender._pc === this;
        if (!isLocal) {
          throw new DOMException("Sender was not created by this connection.", "InvalidAccessError");
        }
        this._streams = this._streams || {};
        var stream = void 0;
        Object.keys(this._streams).forEach(function(streamid) {
          var hasTrack = _this15._streams[streamid].getTracks().find(function(track) {
            return sender.track === track;
          });
          if (hasTrack) {
            stream = _this15._streams[streamid];
          }
        });
        if (stream) {
          if (stream.getTracks().length === 1) {
            this.removeStream(this._reverseStreams[stream.id]);
          } else {
            stream.removeTrack(sender.track);
          }
          this.dispatchEvent(new Event("negotiationneeded"));
        }
      };
    }
    function shimPeerConnection(window) {
      var browserDetails = utils.detectBrowser(window);
      if (!window.RTCPeerConnection && window.webkitRTCPeerConnection) {
        window.RTCPeerConnection = window.webkitRTCPeerConnection;
      }
      if (!window.RTCPeerConnection) {
        return;
      }
      if (browserDetails.version < 53) {
        ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function(method) {
          var nativeMethod = window.RTCPeerConnection.prototype[method];
          var methodObj = _defineProperty({}, method, function() {
            arguments[0] = new (method === "addIceCandidate" ? window.RTCIceCandidate : window.RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          });
          window.RTCPeerConnection.prototype[method] = methodObj[method];
        });
      }
      var nativeAddIceCandidate = window.RTCPeerConnection.prototype.addIceCandidate;
      window.RTCPeerConnection.prototype.addIceCandidate = function addIceCandidate() {
        if (!arguments[0]) {
          if (arguments[1]) {
            arguments[1].apply(null);
          }
          return Promise.resolve();
        }
        if (browserDetails.version < 78 && arguments[0] && arguments[0].candidate === "") {
          return Promise.resolve();
        }
        return nativeAddIceCandidate.apply(this, arguments);
      };
    }
    function fixNegotiationNeeded(window) {
      utils.wrapPeerConnectionEvent(window, "negotiationneeded", function(e) {
        var pc = e.target;
        if (pc.signalingState !== "stable") {
          return;
        }
        return e;
      });
    }
  }, {"../utils.js":15, "./getdisplaymedia":4, "./getusermedia":5}], 4:[function(require, module, exports) {
    Object.defineProperty(exports, "__esModule", {value:true});
    exports.shimGetDisplayMedia = shimGetDisplayMedia;
    function shimGetDisplayMedia(window, getSourceId) {
      if (window.navigator.mediaDevices && "getDisplayMedia" in window.navigator.mediaDevices) {
        return;
      }
      if (!window.navigator.mediaDevices) {
        return;
      }
      if (typeof getSourceId !== "function") {
        console.error("shimGetDisplayMedia: getSourceId argument is not " + "a function");
        return;
      }
      window.navigator.mediaDevices.getDisplayMedia = function getDisplayMedia(constraints) {
        return getSourceId(constraints).then(function(sourceId) {
          var widthSpecified = constraints.video && constraints.video.width;
          var heightSpecified = constraints.video && constraints.video.height;
          var frameRateSpecified = constraints.video && constraints.video.frameRate;
          constraints.video = {mandatory:{chromeMediaSource:"desktop", chromeMediaSourceId:sourceId, maxFrameRate:frameRateSpecified || 3}};
          if (widthSpecified) {
            constraints.video.mandatory.maxWidth = widthSpecified;
          }
          if (heightSpecified) {
            constraints.video.mandatory.maxHeight = heightSpecified;
          }
          return window.navigator.mediaDevices.getUserMedia(constraints);
        });
      };
    }
  }, {}], 5:[function(require, module, exports) {
    Object.defineProperty(exports, "__esModule", {value:true});
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    exports.shimGetUserMedia = shimGetUserMedia;
    var _utils = require("../utils.js");
    var utils = _interopRequireWildcard(_utils);
    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) {
        return obj;
      } else {
        var newObj = {};
        if (obj != null) {
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              newObj[key] = obj[key];
            }
          }
        }
        newObj.default = obj;
        return newObj;
      }
    }
    var logging = utils.log;
    function shimGetUserMedia(window) {
      var navigator = window && window.navigator;
      if (!navigator.mediaDevices) {
        return;
      }
      var browserDetails = utils.detectBrowser(window);
      var constraintsToChrome_ = function constraintsToChrome_(c) {
        if ((typeof c === "undefined" ? "undefined" : _typeof(c)) !== "object" || c.mandatory || c.optional) {
          return c;
        }
        var cc = {};
        Object.keys(c).forEach(function(key) {
          if (key === "require" || key === "advanced" || key === "mediaSource") {
            return;
          }
          var r = _typeof(c[key]) === "object" ? c[key] : {ideal:c[key]};
          if (r.exact !== undefined && typeof r.exact === "number") {
            r.min = r.max = r.exact;
          }
          var oldname_ = function oldname_(prefix, name) {
            if (prefix) {
              return prefix + name.charAt(0).toUpperCase() + name.slice(1);
            }
            return name === "deviceId" ? "sourceId" : name;
          };
          if (r.ideal !== undefined) {
            cc.optional = cc.optional || [];
            var oc = {};
            if (typeof r.ideal === "number") {
              oc[oldname_("min", key)] = r.ideal;
              cc.optional.push(oc);
              oc = {};
              oc[oldname_("max", key)] = r.ideal;
              cc.optional.push(oc);
            } else {
              oc[oldname_("", key)] = r.ideal;
              cc.optional.push(oc);
            }
          }
          if (r.exact !== undefined && typeof r.exact !== "number") {
            cc.mandatory = cc.mandatory || {};
            cc.mandatory[oldname_("", key)] = r.exact;
          } else {
            ["min", "max"].forEach(function(mix) {
              if (r[mix] !== undefined) {
                cc.mandatory = cc.mandatory || {};
                cc.mandatory[oldname_(mix, key)] = r[mix];
              }
            });
          }
        });
        if (c.advanced) {
          cc.optional = (cc.optional || []).concat(c.advanced);
        }
        return cc;
      };
      var shimConstraints_ = function shimConstraints_(constraints, func) {
        if (browserDetails.version >= 61) {
          return func(constraints);
        }
        constraints = JSON.parse(JSON.stringify(constraints));
        if (constraints && _typeof(constraints.audio) === "object") {
          var remap = function remap(obj, a, b) {
            if (a in obj && !(b in obj)) {
              obj[b] = obj[a];
              delete obj[a];
            }
          };
          constraints = JSON.parse(JSON.stringify(constraints));
          remap(constraints.audio, "autoGainControl", "googAutoGainControl");
          remap(constraints.audio, "noiseSuppression", "googNoiseSuppression");
          constraints.audio = constraintsToChrome_(constraints.audio);
        }
        if (constraints && _typeof(constraints.video) === "object") {
          var face = constraints.video.facingMode;
          face = face && ((typeof face === "undefined" ? "undefined" : _typeof(face)) === "object" ? face : {ideal:face});
          var getSupportedFacingModeLies = browserDetails.version < 66;
          if (face && (face.exact === "user" || face.exact === "environment" || face.ideal === "user" || face.ideal === "environment") && !(navigator.mediaDevices.getSupportedConstraints && navigator.mediaDevices.getSupportedConstraints().facingMode && !getSupportedFacingModeLies)) {
            delete constraints.video.facingMode;
            var matches = void 0;
            if (face.exact === "environment" || face.ideal === "environment") {
              matches = ["back", "rear"];
            } else {
              if (face.exact === "user" || face.ideal === "user") {
                matches = ["front"];
              }
            }
            if (matches) {
              return navigator.mediaDevices.enumerateDevices().then(function(devices) {
                devices = devices.filter(function(d) {
                  return d.kind === "videoinput";
                });
                var dev = devices.find(function(d) {
                  return matches.some(function(match) {
                    return d.label.toLowerCase().includes(match);
                  });
                });
                if (!dev && devices.length && matches.includes("back")) {
                  dev = devices[devices.length - 1];
                }
                if (dev) {
                  constraints.video.deviceId = face.exact ? {exact:dev.deviceId} : {ideal:dev.deviceId};
                }
                constraints.video = constraintsToChrome_(constraints.video);
                logging("chrome: " + JSON.stringify(constraints));
                return func(constraints);
              });
            }
          }
          constraints.video = constraintsToChrome_(constraints.video);
        }
        logging("chrome: " + JSON.stringify(constraints));
        return func(constraints);
      };
      var shimError_ = function shimError_(e) {
        if (browserDetails.version >= 64) {
          return e;
        }
        return {name:{PermissionDeniedError:"NotAllowedError", PermissionDismissedError:"NotAllowedError", InvalidStateError:"NotAllowedError", DevicesNotFoundError:"NotFoundError", ConstraintNotSatisfiedError:"OverconstrainedError", TrackStartError:"NotReadableError", MediaDeviceFailedDueToShutdown:"NotAllowedError", MediaDeviceKillSwitchOn:"NotAllowedError", TabCaptureError:"AbortError", ScreenCaptureError:"AbortError", DeviceCaptureError:"AbortError"}[e.name] || e.name, message:e.message, constraint:e.constraint || 
        e.constraintName, toString:function toString() {
          return this.name + (this.message && ": ") + this.message;
        }};
      };
      var getUserMedia_ = function getUserMedia_(constraints, onSuccess, onError) {
        shimConstraints_(constraints, function(c) {
          navigator.webkitGetUserMedia(c, onSuccess, function(e) {
            if (onError) {
              onError(shimError_(e));
            }
          });
        });
      };
      navigator.getUserMedia = getUserMedia_.bind(navigator);
      if (navigator.mediaDevices.getUserMedia) {
        var origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
        navigator.mediaDevices.getUserMedia = function(cs) {
          return shimConstraints_(cs, function(c) {
            return origGetUserMedia(c).then(function(stream) {
              if (c.audio && !stream.getAudioTracks().length || c.video && !stream.getVideoTracks().length) {
                stream.getTracks().forEach(function(track) {
                  track.stop();
                });
                throw new DOMException("", "NotFoundError");
              }
              return stream;
            }, function(e) {
              return Promise.reject(shimError_(e));
            });
          });
        };
      }
    }
  }, {"../utils.js":15}], 6:[function(require, module, exports) {
    Object.defineProperty(exports, "__esModule", {value:true});
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    exports.shimRTCIceCandidate = shimRTCIceCandidate;
    exports.shimMaxMessageSize = shimMaxMessageSize;
    exports.shimSendThrowTypeError = shimSendThrowTypeError;
    exports.shimConnectionState = shimConnectionState;
    exports.removeAllowExtmapMixed = removeAllowExtmapMixed;
    var _sdp = require("sdp");
    var _sdp2 = _interopRequireDefault(_sdp);
    var _utils = require("./utils");
    var utils = _interopRequireWildcard(_utils);
    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) {
        return obj;
      } else {
        var newObj = {};
        if (obj != null) {
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              newObj[key] = obj[key];
            }
          }
        }
        newObj.default = obj;
        return newObj;
      }
    }
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {default:obj};
    }
    function shimRTCIceCandidate(window) {
      if (!window.RTCIceCandidate || window.RTCIceCandidate && "foundation" in window.RTCIceCandidate.prototype) {
        return;
      }
      var NativeRTCIceCandidate = window.RTCIceCandidate;
      window.RTCIceCandidate = function RTCIceCandidate(args) {
        if ((typeof args === "undefined" ? "undefined" : _typeof(args)) === "object" && args.candidate && args.candidate.indexOf("a=") === 0) {
          args = JSON.parse(JSON.stringify(args));
          args.candidate = args.candidate.substr(2);
        }
        if (args.candidate && args.candidate.length) {
          var nativeCandidate = new NativeRTCIceCandidate(args);
          var parsedCandidate = _sdp2.default.parseCandidate(args.candidate);
          var augmentedCandidate = Object.assign(nativeCandidate, parsedCandidate);
          augmentedCandidate.toJSON = function toJSON() {
            return {candidate:augmentedCandidate.candidate, sdpMid:augmentedCandidate.sdpMid, sdpMLineIndex:augmentedCandidate.sdpMLineIndex, usernameFragment:augmentedCandidate.usernameFragment};
          };
          return augmentedCandidate;
        }
        return new NativeRTCIceCandidate(args);
      };
      window.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype;
      utils.wrapPeerConnectionEvent(window, "icecandidate", function(e) {
        if (e.candidate) {
          Object.defineProperty(e, "candidate", {value:new window.RTCIceCandidate(e.candidate), writable:"false"});
        }
        return e;
      });
    }
    function shimMaxMessageSize(window) {
      if (!window.RTCPeerConnection) {
        return;
      }
      var browserDetails = utils.detectBrowser(window);
      if (!("sctp" in window.RTCPeerConnection.prototype)) {
        Object.defineProperty(window.RTCPeerConnection.prototype, "sctp", {get:function get() {
          return typeof this._sctp === "undefined" ? null : this._sctp;
        }});
      }
      var sctpInDescription = function sctpInDescription(description) {
        if (!description || !description.sdp) {
          return false;
        }
        var sections = _sdp2.default.splitSections(description.sdp);
        sections.shift();
        return sections.some(function(mediaSection) {
          var mLine = _sdp2.default.parseMLine(mediaSection);
          return mLine && mLine.kind === "application" && mLine.protocol.indexOf("SCTP") !== -1;
        });
      };
      var getRemoteFirefoxVersion = function getRemoteFirefoxVersion(description) {
        var match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
        if (match === null || match.length < 2) {
          return -1;
        }
        var version = parseInt(match[1], 10);
        return version !== version ? -1 : version;
      };
      var getCanSendMaxMessageSize = function getCanSendMaxMessageSize(remoteIsFirefox) {
        var canSendMaxMessageSize = 65536;
        if (browserDetails.browser === "firefox") {
          if (browserDetails.version < 57) {
            if (remoteIsFirefox === -1) {
              canSendMaxMessageSize = 16384;
            } else {
              canSendMaxMessageSize = 2147483637;
            }
          } else {
            if (browserDetails.version < 60) {
              canSendMaxMessageSize = browserDetails.version === 57 ? 65535 : 65536;
            } else {
              canSendMaxMessageSize = 2147483637;
            }
          }
        }
        return canSendMaxMessageSize;
      };
      var getMaxMessageSize = function getMaxMessageSize(description, remoteIsFirefox) {
        var maxMessageSize = 65536;
        if (browserDetails.browser === "firefox" && browserDetails.version === 57) {
          maxMessageSize = 65535;
        }
        var match = _sdp2.default.matchPrefix(description.sdp, "a=max-message-size:");
        if (match.length > 0) {
          maxMessageSize = parseInt(match[0].substr(19), 10);
        } else {
          if (browserDetails.browser === "firefox" && remoteIsFirefox !== -1) {
            maxMessageSize = 2147483637;
          }
        }
        return maxMessageSize;
      };
      var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
      window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
        this._sctp = null;
        if (browserDetails.browser === "chrome" && browserDetails.version >= 76) {
          var _getConfiguration = this.getConfiguration(), sdpSemantics = _getConfiguration.sdpSemantics;
          if (sdpSemantics === "plan-b") {
            Object.defineProperty(this, "sctp", {get:function get() {
              return typeof this._sctp === "undefined" ? null : this._sctp;
            }, enumerable:true, configurable:true});
          }
        }
        if (sctpInDescription(arguments[0])) {
          var isFirefox = getRemoteFirefoxVersion(arguments[0]);
          var canSendMMS = getCanSendMaxMessageSize(isFirefox);
          var remoteMMS = getMaxMessageSize(arguments[0], isFirefox);
          var maxMessageSize = void 0;
          if (canSendMMS === 0 && remoteMMS === 0) {
            maxMessageSize = Number.POSITIVE_INFINITY;
          } else {
            if (canSendMMS === 0 || remoteMMS === 0) {
              maxMessageSize = Math.max(canSendMMS, remoteMMS);
            } else {
              maxMessageSize = Math.min(canSendMMS, remoteMMS);
            }
          }
          var sctp = {};
          Object.defineProperty(sctp, "maxMessageSize", {get:function get() {
            return maxMessageSize;
          }});
          this._sctp = sctp;
        }
        return origSetRemoteDescription.apply(this, arguments);
      };
    }
    function shimSendThrowTypeError(window) {
      if (!(window.RTCPeerConnection && "createDataChannel" in window.RTCPeerConnection.prototype)) {
        return;
      }
      function wrapDcSend(dc, pc) {
        var origDataChannelSend = dc.send;
        dc.send = function send() {
          var data = arguments[0];
          var length = data.length || data.size || data.byteLength;
          if (dc.readyState === "open" && pc.sctp && length > pc.sctp.maxMessageSize) {
            throw new TypeError("Message too large (can send a maximum of " + pc.sctp.maxMessageSize + " bytes)");
          }
          return origDataChannelSend.apply(dc, arguments);
        };
      }
      var origCreateDataChannel = window.RTCPeerConnection.prototype.createDataChannel;
      window.RTCPeerConnection.prototype.createDataChannel = function createDataChannel() {
        var dataChannel = origCreateDataChannel.apply(this, arguments);
        wrapDcSend(dataChannel, this);
        return dataChannel;
      };
      utils.wrapPeerConnectionEvent(window, "datachannel", function(e) {
        wrapDcSend(e.channel, e.target);
        return e;
      });
    }
    function shimConnectionState(window) {
      if (!window.RTCPeerConnection || "connectionState" in window.RTCPeerConnection.prototype) {
        return;
      }
      var proto = window.RTCPeerConnection.prototype;
      Object.defineProperty(proto, "connectionState", {get:function get() {
        return {completed:"connected", checking:"connecting"}[this.iceConnectionState] || this.iceConnectionState;
      }, enumerable:true, configurable:true});
      Object.defineProperty(proto, "onconnectionstatechange", {get:function get() {
        return this._onconnectionstatechange || null;
      }, set:function set(cb) {
        if (this._onconnectionstatechange) {
          this.removeEventListener("connectionstatechange", this._onconnectionstatechange);
          delete this._onconnectionstatechange;
        }
        if (cb) {
          this.addEventListener("connectionstatechange", this._onconnectionstatechange = cb);
        }
      }, enumerable:true, configurable:true});
      ["setLocalDescription", "setRemoteDescription"].forEach(function(method) {
        var origMethod = proto[method];
        proto[method] = function() {
          if (!this._connectionstatechangepoly) {
            this._connectionstatechangepoly = function(e) {
              var pc = e.target;
              if (pc._lastConnectionState !== pc.connectionState) {
                pc._lastConnectionState = pc.connectionState;
                var newEvent = new Event("connectionstatechange", e);
                pc.dispatchEvent(newEvent);
              }
              return e;
            };
            this.addEventListener("iceconnectionstatechange", this._connectionstatechangepoly);
          }
          return origMethod.apply(this, arguments);
        };
      });
    }
    function removeAllowExtmapMixed(window) {
      if (!window.RTCPeerConnection) {
        return;
      }
      var browserDetails = utils.detectBrowser(window);
      if (browserDetails.browser === "chrome" && browserDetails.version >= 71) {
        return;
      }
      var nativeSRD = window.RTCPeerConnection.prototype.setRemoteDescription;
      window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription(desc) {
        if (desc && desc.sdp && desc.sdp.indexOf("\na=extmap-allow-mixed") !== -1) {
          desc.sdp = desc.sdp.split("\n").filter(function(line) {
            return line.trim() !== "a=extmap-allow-mixed";
          }).join("\n");
        }
        return nativeSRD.apply(this, arguments);
      };
    }
  }, {"./utils":15, "sdp":17}], 7:[function(require, module, exports) {
    Object.defineProperty(exports, "__esModule", {value:true});
    exports.shimGetDisplayMedia = exports.shimGetUserMedia = undefined;
    var _getusermedia = require("./getusermedia");
    Object.defineProperty(exports, "shimGetUserMedia", {enumerable:true, get:function get() {
      return _getusermedia.shimGetUserMedia;
    }});
    var _getdisplaymedia = require("./getdisplaymedia");
    Object.defineProperty(exports, "shimGetDisplayMedia", {enumerable:true, get:function get() {
      return _getdisplaymedia.shimGetDisplayMedia;
    }});
    exports.shimPeerConnection = shimPeerConnection;
    exports.shimReplaceTrack = shimReplaceTrack;
    var _utils = require("../utils");
    var utils = _interopRequireWildcard(_utils);
    var _filtericeservers = require("./filtericeservers");
    var _rtcpeerconnectionShim = require("rtcpeerconnection-shim");
    var _rtcpeerconnectionShim2 = _interopRequireDefault(_rtcpeerconnectionShim);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {default:obj};
    }
    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) {
        return obj;
      } else {
        var newObj = {};
        if (obj != null) {
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              newObj[key] = obj[key];
            }
          }
        }
        newObj.default = obj;
        return newObj;
      }
    }
    function shimPeerConnection(window) {
      var browserDetails = utils.detectBrowser(window);
      if (window.RTCIceGatherer) {
        if (!window.RTCIceCandidate) {
          window.RTCIceCandidate = function RTCIceCandidate(args) {
            return args;
          };
        }
        if (!window.RTCSessionDescription) {
          window.RTCSessionDescription = function RTCSessionDescription(args) {
            return args;
          };
        }
        if (browserDetails.version < 15025) {
          var origMSTEnabled = Object.getOwnPropertyDescriptor(window.MediaStreamTrack.prototype, "enabled");
          Object.defineProperty(window.MediaStreamTrack.prototype, "enabled", {set:function set(value) {
            origMSTEnabled.set.call(this, value);
            var ev = new Event("enabled");
            ev.enabled = value;
            this.dispatchEvent(ev);
          }});
        }
      }
      if (window.RTCRtpSender && !("dtmf" in window.RTCRtpSender.prototype)) {
        Object.defineProperty(window.RTCRtpSender.prototype, "dtmf", {get:function get() {
          if (this._dtmf === undefined) {
            if (this.track.kind === "audio") {
              this._dtmf = new window.RTCDtmfSender(this);
            } else {
              if (this.track.kind === "video") {
                this._dtmf = null;
              }
            }
          }
          return this._dtmf;
        }});
      }
      if (window.RTCDtmfSender && !window.RTCDTMFSender) {
        window.RTCDTMFSender = window.RTCDtmfSender;
      }
      var RTCPeerConnectionShim = (0, _rtcpeerconnectionShim2.default)(window, browserDetails.version);
      window.RTCPeerConnection = function RTCPeerConnection(config) {
        if (config && config.iceServers) {
          config.iceServers = (0, _filtericeservers.filterIceServers)(config.iceServers, browserDetails.version);
          utils.log("ICE servers after filtering:", config.iceServers);
        }
        return new RTCPeerConnectionShim(config);
      };
      window.RTCPeerConnection.prototype = RTCPeerConnectionShim.prototype;
    }
    function shimReplaceTrack(window) {
      if (window.RTCRtpSender && !("replaceTrack" in window.RTCRtpSender.prototype)) {
        window.RTCRtpSender.prototype.replaceTrack = window.RTCRtpSender.prototype.setTrack;
      }
    }
  }, {"../utils":15, "./filtericeservers":8, "./getdisplaymedia":9, "./getusermedia":10, "rtcpeerconnection-shim":16}], 8:[function(require, module, exports) {
    Object.defineProperty(exports, "__esModule", {value:true});
    exports.filterIceServers = filterIceServers;
    var _utils = require("../utils");
    var utils = _interopRequireWildcard(_utils);
    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) {
        return obj;
      } else {
        var newObj = {};
        if (obj != null) {
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              newObj[key] = obj[key];
            }
          }
        }
        newObj.default = obj;
        return newObj;
      }
    }
    function filterIceServers(iceServers, edgeVersion) {
      var hasTurn = false;
      iceServers = JSON.parse(JSON.stringify(iceServers));
      return iceServers.filter(function(server) {
        if (server && (server.urls || server.url)) {
          var urls = server.urls || server.url;
          if (server.url && !server.urls) {
            utils.deprecated("RTCIceServer.url", "RTCIceServer.urls");
          }
          var isString = typeof urls === "string";
          if (isString) {
            urls = [urls];
          }
          urls = urls.filter(function(url) {
            if (url.indexOf("stun:") === 0) {
              return false;
            }
            var validTurn = url.startsWith("turn") && !url.startsWith("turn:[") && url.includes("transport=udp");
            if (validTurn && !hasTurn) {
              hasTurn = true;
              return true;
            }
            return validTurn && !hasTurn;
          });
          delete server.url;
          server.urls = isString ? urls[0] : urls;
          return !!urls.length;
        }
      });
    }
  }, {"../utils":15}], 9:[function(require, module, exports) {
    Object.defineProperty(exports, "__esModule", {value:true});
    exports.shimGetDisplayMedia = shimGetDisplayMedia;
    function shimGetDisplayMedia(window) {
      if (!("getDisplayMedia" in window.navigator)) {
        return;
      }
      if (!window.navigator.mediaDevices) {
        return;
      }
      if (window.navigator.mediaDevices && "getDisplayMedia" in window.navigator.mediaDevices) {
        return;
      }
      window.navigator.mediaDevices.getDisplayMedia = window.navigator.getDisplayMedia.bind(window.navigator);
    }
  }, {}], 10:[function(require, module, exports) {
    Object.defineProperty(exports, "__esModule", {value:true});
    exports.shimGetUserMedia = shimGetUserMedia;
    function shimGetUserMedia(window) {
      var navigator = window && window.navigator;
      var shimError_ = function shimError_(e) {
        return {name:{PermissionDeniedError:"NotAllowedError"}[e.name] || e.name, message:e.message, constraint:e.constraint, toString:function toString() {
          return this.name;
        }};
      };
      var origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getUserMedia = function(c) {
        return origGetUserMedia(c).catch(function(e) {
          return Promise.reject(shimError_(e));
        });
      };
    }
  }, {}], 11:[function(require, module, exports) {
    Object.defineProperty(exports, "__esModule", {value:true});
    exports.shimGetDisplayMedia = exports.shimGetUserMedia = undefined;
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    var _getusermedia = require("./getusermedia");
    Object.defineProperty(exports, "shimGetUserMedia", {enumerable:true, get:function get() {
      return _getusermedia.shimGetUserMedia;
    }});
    var _getdisplaymedia = require("./getdisplaymedia");
    Object.defineProperty(exports, "shimGetDisplayMedia", {enumerable:true, get:function get() {
      return _getdisplaymedia.shimGetDisplayMedia;
    }});
    exports.shimOnTrack = shimOnTrack;
    exports.shimPeerConnection = shimPeerConnection;
    exports.shimSenderGetStats = shimSenderGetStats;
    exports.shimReceiverGetStats = shimReceiverGetStats;
    exports.shimRemoveStream = shimRemoveStream;
    exports.shimRTCDataChannel = shimRTCDataChannel;
    exports.shimAddTransceiver = shimAddTransceiver;
    exports.shimCreateOffer = shimCreateOffer;
    exports.shimCreateAnswer = shimCreateAnswer;
    var _utils = require("../utils");
    var utils = _interopRequireWildcard(_utils);
    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) {
        return obj;
      } else {
        var newObj = {};
        if (obj != null) {
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              newObj[key] = obj[key];
            }
          }
        }
        newObj.default = obj;
        return newObj;
      }
    }
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {value:value, enumerable:true, configurable:true, writable:true});
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function shimOnTrack(window) {
      if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" && window.RTCTrackEvent && "receiver" in window.RTCTrackEvent.prototype && !("transceiver" in window.RTCTrackEvent.prototype)) {
        Object.defineProperty(window.RTCTrackEvent.prototype, "transceiver", {get:function get() {
          return {receiver:this.receiver};
        }});
      }
    }
    function shimPeerConnection(window) {
      var browserDetails = utils.detectBrowser(window);
      if ((typeof window === "undefined" ? "undefined" : _typeof(window)) !== "object" || !(window.RTCPeerConnection || window.mozRTCPeerConnection)) {
        return;
      }
      if (!window.RTCPeerConnection && window.mozRTCPeerConnection) {
        window.RTCPeerConnection = window.mozRTCPeerConnection;
      }
      if (browserDetails.version < 53) {
        ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function(method) {
          var nativeMethod = window.RTCPeerConnection.prototype[method];
          var methodObj = _defineProperty({}, method, function() {
            arguments[0] = new (method === "addIceCandidate" ? window.RTCIceCandidate : window.RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          });
          window.RTCPeerConnection.prototype[method] = methodObj[method];
        });
      }
      if (browserDetails.version < 68) {
        var nativeAddIceCandidate = window.RTCPeerConnection.prototype.addIceCandidate;
        window.RTCPeerConnection.prototype.addIceCandidate = function addIceCandidate() {
          if (!arguments[0]) {
            if (arguments[1]) {
              arguments[1].apply(null);
            }
            return Promise.resolve();
          }
          if (arguments[0] && arguments[0].candidate === "") {
            return Promise.resolve();
          }
          return nativeAddIceCandidate.apply(this, arguments);
        };
      }
      var modernStatsTypes = {inboundrtp:"inbound-rtp", outboundrtp:"outbound-rtp", candidatepair:"candidate-pair", localcandidate:"local-candidate", remotecandidate:"remote-candidate"};
      var nativeGetStats = window.RTCPeerConnection.prototype.getStats;
      window.RTCPeerConnection.prototype.getStats = function getStats() {
        var _arguments = Array.prototype.slice.call(arguments), selector = _arguments[0], onSucc = _arguments[1], onErr = _arguments[2];
        return nativeGetStats.apply(this, [selector || null]).then(function(stats) {
          if (browserDetails.version < 53 && !onSucc) {
            try {
              stats.forEach(function(stat) {
                stat.type = modernStatsTypes[stat.type] || stat.type;
              });
            } catch (e) {
              if (e.name !== "TypeError") {
                throw e;
              }
              stats.forEach(function(stat, i) {
                stats.set(i, Object.assign({}, stat, {type:modernStatsTypes[stat.type] || stat.type}));
              });
            }
          }
          return stats;
        }).then(onSucc, onErr);
      };
    }
    function shimSenderGetStats(window) {
      if (!((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" && window.RTCPeerConnection && window.RTCRtpSender)) {
        return;
      }
      if (window.RTCRtpSender && "getStats" in window.RTCRtpSender.prototype) {
        return;
      }
      var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
      if (origGetSenders) {
        window.RTCPeerConnection.prototype.getSenders = function getSenders() {
          var _this = this;
          var senders = origGetSenders.apply(this, []);
          senders.forEach(function(sender) {
            return sender._pc = _this;
          });
          return senders;
        };
      }
      var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
      if (origAddTrack) {
        window.RTCPeerConnection.prototype.addTrack = function addTrack() {
          var sender = origAddTrack.apply(this, arguments);
          sender._pc = this;
          return sender;
        };
      }
      window.RTCRtpSender.prototype.getStats = function getStats() {
        return this.track ? this._pc.getStats(this.track) : Promise.resolve(new Map);
      };
    }
    function shimReceiverGetStats(window) {
      if (!((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" && window.RTCPeerConnection && window.RTCRtpSender)) {
        return;
      }
      if (window.RTCRtpSender && "getStats" in window.RTCRtpReceiver.prototype) {
        return;
      }
      var origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
      if (origGetReceivers) {
        window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
          var _this2 = this;
          var receivers = origGetReceivers.apply(this, []);
          receivers.forEach(function(receiver) {
            return receiver._pc = _this2;
          });
          return receivers;
        };
      }
      utils.wrapPeerConnectionEvent(window, "track", function(e) {
        e.receiver._pc = e.srcElement;
        return e;
      });
      window.RTCRtpReceiver.prototype.getStats = function getStats() {
        return this._pc.getStats(this.track);
      };
    }
    function shimRemoveStream(window) {
      if (!window.RTCPeerConnection || "removeStream" in window.RTCPeerConnection.prototype) {
        return;
      }
      window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
        var _this3 = this;
        utils.deprecated("removeStream", "removeTrack");
        this.getSenders().forEach(function(sender) {
          if (sender.track && stream.getTracks().includes(sender.track)) {
            _this3.removeTrack(sender);
          }
        });
      };
    }
    function shimRTCDataChannel(window) {
      if (window.DataChannel && !window.RTCDataChannel) {
        window.RTCDataChannel = window.DataChannel;
      }
    }
    function shimAddTransceiver(window) {
      if (!((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" && window.RTCPeerConnection)) {
        return;
      }
      var origAddTransceiver = window.RTCPeerConnection.prototype.addTransceiver;
      if (origAddTransceiver) {
        window.RTCPeerConnection.prototype.addTransceiver = function addTransceiver() {
          this.setParametersPromises = [];
          var initParameters = arguments[1];
          var shouldPerformCheck = initParameters && "sendEncodings" in initParameters;
          if (shouldPerformCheck) {
            initParameters.sendEncodings.forEach(function(encodingParam) {
              if ("rid" in encodingParam) {
                var ridRegex = /^[a-z0-9]{0,16}$/i;
                if (!ridRegex.test(encodingParam.rid)) {
                  throw new TypeError("Invalid RID value provided.");
                }
              }
              if ("scaleResolutionDownBy" in encodingParam) {
                if (!(parseFloat(encodingParam.scaleResolutionDownBy) >= 1.0)) {
                  throw new RangeError("scale_resolution_down_by must be >= 1.0");
                }
              }
              if ("maxFramerate" in encodingParam) {
                if (!(parseFloat(encodingParam.maxFramerate) >= 0)) {
                  throw new RangeError("max_framerate must be >= 0.0");
                }
              }
            });
          }
          var transceiver = origAddTransceiver.apply(this, arguments);
          if (shouldPerformCheck) {
            var sender = transceiver.sender;
            var params = sender.getParameters();
            if (!("encodings" in params)) {
              params.encodings = initParameters.sendEncodings;
              this.setParametersPromises.push(sender.setParameters(params).catch(function() {
              }));
            }
          }
          return transceiver;
        };
      }
    }
    function shimCreateOffer(window) {
      if (!((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" && window.RTCPeerConnection)) {
        return;
      }
      var origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
      window.RTCPeerConnection.prototype.createOffer = function createOffer() {
        var _this4 = this, _arguments2 = arguments;
        if (this.setParametersPromises && this.setParametersPromises.length) {
          return Promise.all(this.setParametersPromises).then(function() {
            return origCreateOffer.apply(_this4, _arguments2);
          }).finally(function() {
            _this4.setParametersPromises = [];
          });
        }
        return origCreateOffer.apply(this, arguments);
      };
    }
    function shimCreateAnswer(window) {
      if (!((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" && window.RTCPeerConnection)) {
        return;
      }
      var origCreateAnswer = window.RTCPeerConnection.prototype.createAnswer;
      window.RTCPeerConnection.prototype.createAnswer = function createAnswer() {
        var _this5 = this, _arguments3 = arguments;
        if (this.setParametersPromises && this.setParametersPromises.length) {
          return Promise.all(this.setParametersPromises).then(function() {
            return origCreateAnswer.apply(_this5, _arguments3);
          }).finally(function() {
            _this5.setParametersPromises = [];
          });
        }
        return origCreateAnswer.apply(this, arguments);
      };
    }
  }, {"../utils":15, "./getdisplaymedia":12, "./getusermedia":13}], 12:[function(require, module, exports) {
    Object.defineProperty(exports, "__esModule", {value:true});
    exports.shimGetDisplayMedia = shimGetDisplayMedia;
    function shimGetDisplayMedia(window, preferredMediaSource) {
      if (window.navigator.mediaDevices && "getDisplayMedia" in window.navigator.mediaDevices) {
        return;
      }
      if (!window.navigator.mediaDevices) {
        return;
      }
      window.navigator.mediaDevices.getDisplayMedia = function getDisplayMedia(constraints) {
        if (!(constraints && constraints.video)) {
          var err = new DOMException("getDisplayMedia without video " + "constraints is undefined");
          err.name = "NotFoundError";
          err.code = 8;
          return Promise.reject(err);
        }
        if (constraints.video === true) {
          constraints.video = {mediaSource:preferredMediaSource};
        } else {
          constraints.video.mediaSource = preferredMediaSource;
        }
        return window.navigator.mediaDevices.getUserMedia(constraints);
      };
    }
  }, {}], 13:[function(require, module, exports) {
    Object.defineProperty(exports, "__esModule", {value:true});
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    exports.shimGetUserMedia = shimGetUserMedia;
    var _utils = require("../utils");
    var utils = _interopRequireWildcard(_utils);
    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) {
        return obj;
      } else {
        var newObj = {};
        if (obj != null) {
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              newObj[key] = obj[key];
            }
          }
        }
        newObj.default = obj;
        return newObj;
      }
    }
    function shimGetUserMedia(window) {
      var browserDetails = utils.detectBrowser(window);
      var navigator = window && window.navigator;
      var MediaStreamTrack = window && window.MediaStreamTrack;
      navigator.getUserMedia = function(constraints, onSuccess, onError) {
        utils.deprecated("navigator.getUserMedia", "navigator.mediaDevices.getUserMedia");
        navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
      };
      if (!(browserDetails.version > 55 && "autoGainControl" in navigator.mediaDevices.getSupportedConstraints())) {
        var remap = function remap(obj, a, b) {
          if (a in obj && !(b in obj)) {
            obj[b] = obj[a];
            delete obj[a];
          }
        };
        var nativeGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
        navigator.mediaDevices.getUserMedia = function(c) {
          if ((typeof c === "undefined" ? "undefined" : _typeof(c)) === "object" && _typeof(c.audio) === "object") {
            c = JSON.parse(JSON.stringify(c));
            remap(c.audio, "autoGainControl", "mozAutoGainControl");
            remap(c.audio, "noiseSuppression", "mozNoiseSuppression");
          }
          return nativeGetUserMedia(c);
        };
        if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
          var nativeGetSettings = MediaStreamTrack.prototype.getSettings;
          MediaStreamTrack.prototype.getSettings = function() {
            var obj = nativeGetSettings.apply(this, arguments);
            remap(obj, "mozAutoGainControl", "autoGainControl");
            remap(obj, "mozNoiseSuppression", "noiseSuppression");
            return obj;
          };
        }
        if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
          var nativeApplyConstraints = MediaStreamTrack.prototype.applyConstraints;
          MediaStreamTrack.prototype.applyConstraints = function(c) {
            if (this.kind === "audio" && (typeof c === "undefined" ? "undefined" : _typeof(c)) === "object") {
              c = JSON.parse(JSON.stringify(c));
              remap(c, "autoGainControl", "mozAutoGainControl");
              remap(c, "noiseSuppression", "mozNoiseSuppression");
            }
            return nativeApplyConstraints.apply(this, [c]);
          };
        }
      }
    }
  }, {"../utils":15}], 14:[function(require, module, exports) {
    Object.defineProperty(exports, "__esModule", {value:true});
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    exports.shimLocalStreamsAPI = shimLocalStreamsAPI;
    exports.shimRemoteStreamsAPI = shimRemoteStreamsAPI;
    exports.shimCallbacksAPI = shimCallbacksAPI;
    exports.shimGetUserMedia = shimGetUserMedia;
    exports.shimConstraints = shimConstraints;
    exports.shimRTCIceServerUrls = shimRTCIceServerUrls;
    exports.shimTrackEventTransceiver = shimTrackEventTransceiver;
    exports.shimCreateOfferLegacy = shimCreateOfferLegacy;
    var _utils = require("../utils");
    var utils = _interopRequireWildcard(_utils);
    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) {
        return obj;
      } else {
        var newObj = {};
        if (obj != null) {
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              newObj[key] = obj[key];
            }
          }
        }
        newObj.default = obj;
        return newObj;
      }
    }
    function shimLocalStreamsAPI(window) {
      if ((typeof window === "undefined" ? "undefined" : _typeof(window)) !== "object" || !window.RTCPeerConnection) {
        return;
      }
      if (!("getLocalStreams" in window.RTCPeerConnection.prototype)) {
        window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
          if (!this._localStreams) {
            this._localStreams = [];
          }
          return this._localStreams;
        };
      }
      if (!("addStream" in window.RTCPeerConnection.prototype)) {
        var _addTrack = window.RTCPeerConnection.prototype.addTrack;
        window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
          var _this = this;
          if (!this._localStreams) {
            this._localStreams = [];
          }
          if (!this._localStreams.includes(stream)) {
            this._localStreams.push(stream);
          }
          stream.getAudioTracks().forEach(function(track) {
            return _addTrack.call(_this, track, stream);
          });
          stream.getVideoTracks().forEach(function(track) {
            return _addTrack.call(_this, track, stream);
          });
        };
        window.RTCPeerConnection.prototype.addTrack = function addTrack(track) {
          var stream = arguments[1];
          if (stream) {
            if (!this._localStreams) {
              this._localStreams = [stream];
            } else {
              if (!this._localStreams.includes(stream)) {
                this._localStreams.push(stream);
              }
            }
          }
          return _addTrack.apply(this, arguments);
        };
      }
      if (!("removeStream" in window.RTCPeerConnection.prototype)) {
        window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
          var _this2 = this;
          if (!this._localStreams) {
            this._localStreams = [];
          }
          var index = this._localStreams.indexOf(stream);
          if (index === -1) {
            return;
          }
          this._localStreams.splice(index, 1);
          var tracks = stream.getTracks();
          this.getSenders().forEach(function(sender) {
            if (tracks.includes(sender.track)) {
              _this2.removeTrack(sender);
            }
          });
        };
      }
    }
    function shimRemoteStreamsAPI(window) {
      if ((typeof window === "undefined" ? "undefined" : _typeof(window)) !== "object" || !window.RTCPeerConnection) {
        return;
      }
      if (!("getRemoteStreams" in window.RTCPeerConnection.prototype)) {
        window.RTCPeerConnection.prototype.getRemoteStreams = function getRemoteStreams() {
          return this._remoteStreams ? this._remoteStreams : [];
        };
      }
      if (!("onaddstream" in window.RTCPeerConnection.prototype)) {
        Object.defineProperty(window.RTCPeerConnection.prototype, "onaddstream", {get:function get() {
          return this._onaddstream;
        }, set:function set(f) {
          var _this3 = this;
          if (this._onaddstream) {
            this.removeEventListener("addstream", this._onaddstream);
            this.removeEventListener("track", this._onaddstreampoly);
          }
          this.addEventListener("addstream", this._onaddstream = f);
          this.addEventListener("track", this._onaddstreampoly = function(e) {
            e.streams.forEach(function(stream) {
              if (!_this3._remoteStreams) {
                _this3._remoteStreams = [];
              }
              if (_this3._remoteStreams.includes(stream)) {
                return;
              }
              _this3._remoteStreams.push(stream);
              var event = new Event("addstream");
              event.stream = stream;
              _this3.dispatchEvent(event);
            });
          });
        }});
        var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
        window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
          var pc = this;
          if (!this._onaddstreampoly) {
            this.addEventListener("track", this._onaddstreampoly = function(e) {
              e.streams.forEach(function(stream) {
                if (!pc._remoteStreams) {
                  pc._remoteStreams = [];
                }
                if (pc._remoteStreams.indexOf(stream) >= 0) {
                  return;
                }
                pc._remoteStreams.push(stream);
                var event = new Event("addstream");
                event.stream = stream;
                pc.dispatchEvent(event);
              });
            });
          }
          return origSetRemoteDescription.apply(pc, arguments);
        };
      }
    }
    function shimCallbacksAPI(window) {
      if ((typeof window === "undefined" ? "undefined" : _typeof(window)) !== "object" || !window.RTCPeerConnection) {
        return;
      }
      var prototype = window.RTCPeerConnection.prototype;
      var origCreateOffer = prototype.createOffer;
      var origCreateAnswer = prototype.createAnswer;
      var setLocalDescription = prototype.setLocalDescription;
      var setRemoteDescription = prototype.setRemoteDescription;
      var addIceCandidate = prototype.addIceCandidate;
      prototype.createOffer = function createOffer(successCallback, failureCallback) {
        var options = arguments.length >= 2 ? arguments[2] : arguments[0];
        var promise = origCreateOffer.apply(this, [options]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
      prototype.createAnswer = function createAnswer(successCallback, failureCallback) {
        var options = arguments.length >= 2 ? arguments[2] : arguments[0];
        var promise = origCreateAnswer.apply(this, [options]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
      var withCallback = function withCallback(description, successCallback, failureCallback) {
        var promise = setLocalDescription.apply(this, [description]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
      prototype.setLocalDescription = withCallback;
      withCallback = function withCallback(description, successCallback, failureCallback) {
        var promise = setRemoteDescription.apply(this, [description]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
      prototype.setRemoteDescription = withCallback;
      withCallback = function withCallback(candidate, successCallback, failureCallback) {
        var promise = addIceCandidate.apply(this, [candidate]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
      prototype.addIceCandidate = withCallback;
    }
    function shimGetUserMedia(window) {
      var navigator = window && window.navigator;
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        var mediaDevices = navigator.mediaDevices;
        var _getUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);
        navigator.mediaDevices.getUserMedia = function(constraints) {
          return _getUserMedia(shimConstraints(constraints));
        };
      }
      if (!navigator.getUserMedia && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.getUserMedia = function getUserMedia(constraints, cb, errcb) {
          navigator.mediaDevices.getUserMedia(constraints).then(cb, errcb);
        }.bind(navigator);
      }
    }
    function shimConstraints(constraints) {
      if (constraints && constraints.video !== undefined) {
        return Object.assign({}, constraints, {video:utils.compactObject(constraints.video)});
      }
      return constraints;
    }
    function shimRTCIceServerUrls(window) {
      var OrigPeerConnection = window.RTCPeerConnection;
      window.RTCPeerConnection = function RTCPeerConnection(pcConfig, pcConstraints) {
        if (pcConfig && pcConfig.iceServers) {
          var newIceServers = [];
          for (var i = 0; i < pcConfig.iceServers.length; i++) {
            var server = pcConfig.iceServers[i];
            if (!server.hasOwnProperty("urls") && server.hasOwnProperty("url")) {
              utils.deprecated("RTCIceServer.url", "RTCIceServer.urls");
              server = JSON.parse(JSON.stringify(server));
              server.urls = server.url;
              delete server.url;
              newIceServers.push(server);
            } else {
              newIceServers.push(pcConfig.iceServers[i]);
            }
          }
          pcConfig.iceServers = newIceServers;
        }
        return new OrigPeerConnection(pcConfig, pcConstraints);
      };
      window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
      if ("generateCertificate" in window.RTCPeerConnection) {
        Object.defineProperty(window.RTCPeerConnection, "generateCertificate", {get:function get() {
          return OrigPeerConnection.generateCertificate;
        }});
      }
    }
    function shimTrackEventTransceiver(window) {
      if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" && window.RTCTrackEvent && "receiver" in window.RTCTrackEvent.prototype && !("transceiver" in window.RTCTrackEvent.prototype)) {
        Object.defineProperty(window.RTCTrackEvent.prototype, "transceiver", {get:function get() {
          return {receiver:this.receiver};
        }});
      }
    }
    function shimCreateOfferLegacy(window) {
      var origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
      window.RTCPeerConnection.prototype.createOffer = function createOffer(offerOptions) {
        if (offerOptions) {
          if (typeof offerOptions.offerToReceiveAudio !== "undefined") {
            offerOptions.offerToReceiveAudio = !!offerOptions.offerToReceiveAudio;
          }
          var audioTransceiver = this.getTransceivers().find(function(transceiver) {
            return transceiver.receiver.track.kind === "audio";
          });
          if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
            if (audioTransceiver.direction === "sendrecv") {
              if (audioTransceiver.setDirection) {
                audioTransceiver.setDirection("sendonly");
              } else {
                audioTransceiver.direction = "sendonly";
              }
            } else {
              if (audioTransceiver.direction === "recvonly") {
                if (audioTransceiver.setDirection) {
                  audioTransceiver.setDirection("inactive");
                } else {
                  audioTransceiver.direction = "inactive";
                }
              }
            }
          } else {
            if (offerOptions.offerToReceiveAudio === true && !audioTransceiver) {
              this.addTransceiver("audio");
            }
          }
          if (typeof offerOptions.offerToReceiveVideo !== "undefined") {
            offerOptions.offerToReceiveVideo = !!offerOptions.offerToReceiveVideo;
          }
          var videoTransceiver = this.getTransceivers().find(function(transceiver) {
            return transceiver.receiver.track.kind === "video";
          });
          if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
            if (videoTransceiver.direction === "sendrecv") {
              if (videoTransceiver.setDirection) {
                videoTransceiver.setDirection("sendonly");
              } else {
                videoTransceiver.direction = "sendonly";
              }
            } else {
              if (videoTransceiver.direction === "recvonly") {
                if (videoTransceiver.setDirection) {
                  videoTransceiver.setDirection("inactive");
                } else {
                  videoTransceiver.direction = "inactive";
                }
              }
            }
          } else {
            if (offerOptions.offerToReceiveVideo === true && !videoTransceiver) {
              this.addTransceiver("video");
            }
          }
        }
        return origCreateOffer.apply(this, arguments);
      };
    }
  }, {"../utils":15}], 15:[function(require, module, exports) {
    Object.defineProperty(exports, "__esModule", {value:true});
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    exports.extractVersion = extractVersion;
    exports.wrapPeerConnectionEvent = wrapPeerConnectionEvent;
    exports.disableLog = disableLog;
    exports.disableWarnings = disableWarnings;
    exports.log = log;
    exports.deprecated = deprecated;
    exports.detectBrowser = detectBrowser;
    exports.compactObject = compactObject;
    exports.walkStats = walkStats;
    exports.filterStats = filterStats;
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {value:value, enumerable:true, configurable:true, writable:true});
      } else {
        obj[key] = value;
      }
      return obj;
    }
    var logDisabled_ = true;
    var deprecationWarnings_ = true;
    function extractVersion(uastring, expr, pos) {
      var match = uastring.match(expr);
      return match && match.length >= pos && parseInt(match[pos], 10);
    }
    function wrapPeerConnectionEvent(window, eventNameToWrap, wrapper) {
      if (!window.RTCPeerConnection) {
        return;
      }
      var proto = window.RTCPeerConnection.prototype;
      var nativeAddEventListener = proto.addEventListener;
      proto.addEventListener = function(nativeEventName, cb) {
        if (nativeEventName !== eventNameToWrap) {
          return nativeAddEventListener.apply(this, arguments);
        }
        var wrappedCallback = function wrappedCallback(e) {
          var modifiedEvent = wrapper(e);
          if (modifiedEvent) {
            cb(modifiedEvent);
          }
        };
        this._eventMap = this._eventMap || {};
        this._eventMap[cb] = wrappedCallback;
        return nativeAddEventListener.apply(this, [nativeEventName, wrappedCallback]);
      };
      var nativeRemoveEventListener = proto.removeEventListener;
      proto.removeEventListener = function(nativeEventName, cb) {
        if (nativeEventName !== eventNameToWrap || !this._eventMap || !this._eventMap[cb]) {
          return nativeRemoveEventListener.apply(this, arguments);
        }
        var unwrappedCb = this._eventMap[cb];
        delete this._eventMap[cb];
        return nativeRemoveEventListener.apply(this, [nativeEventName, unwrappedCb]);
      };
      Object.defineProperty(proto, "on" + eventNameToWrap, {get:function get() {
        return this["_on" + eventNameToWrap];
      }, set:function set(cb) {
        if (this["_on" + eventNameToWrap]) {
          this.removeEventListener(eventNameToWrap, this["_on" + eventNameToWrap]);
          delete this["_on" + eventNameToWrap];
        }
        if (cb) {
          this.addEventListener(eventNameToWrap, this["_on" + eventNameToWrap] = cb);
        }
      }, enumerable:true, configurable:true});
    }
    function disableLog(bool) {
      if (typeof bool !== "boolean") {
        return new Error("Argument type: " + (typeof bool === "undefined" ? "undefined" : _typeof(bool)) + ". Please use a boolean.");
      }
      logDisabled_ = bool;
      return bool ? "adapter.js logging disabled" : "adapter.js logging enabled";
    }
    function disableWarnings(bool) {
      if (typeof bool !== "boolean") {
        return new Error("Argument type: " + (typeof bool === "undefined" ? "undefined" : _typeof(bool)) + ". Please use a boolean.");
      }
      deprecationWarnings_ = !bool;
      return "adapter.js deprecation warnings " + (bool ? "disabled" : "enabled");
    }
    function log() {
      if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") {
        if (logDisabled_) {
          return;
        }
        if (typeof console !== "undefined" && typeof console.log === "function") {
          console.log.apply(console, arguments);
        }
      }
    }
    function deprecated(oldMethod, newMethod) {
      if (!deprecationWarnings_) {
        return;
      }
      console.warn(oldMethod + " is deprecated, please use " + newMethod + " instead.");
    }
    function detectBrowser(window) {
      var navigator = window.navigator;
      var result = {browser:null, version:null};
      if (typeof window === "undefined" || !window.navigator) {
        result.browser = "Not a browser.";
        return result;
      }
      if (navigator.mozGetUserMedia) {
        result.browser = "firefox";
        result.version = extractVersion(navigator.userAgent, /Firefox\/(\d+)\./, 1);
      } else {
        if (navigator.webkitGetUserMedia || window.isSecureContext === false && window.webkitRTCPeerConnection && !window.RTCIceGatherer) {
          result.browser = "chrome";
          result.version = extractVersion(navigator.userAgent, /Chrom(e|ium)\/(\d+)\./, 2);
        } else {
          if (navigator.mediaDevices && navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) {
            result.browser = "edge";
            result.version = extractVersion(navigator.userAgent, /Edge\/(\d+).(\d+)$/, 2);
          } else {
            if (window.RTCPeerConnection && navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) {
              result.browser = "safari";
              result.version = extractVersion(navigator.userAgent, /AppleWebKit\/(\d+)\./, 1);
              result.supportsUnifiedPlan = window.RTCRtpTransceiver && "currentDirection" in window.RTCRtpTransceiver.prototype;
            } else {
              result.browser = "Not a supported browser.";
              return result;
            }
          }
        }
      }
      return result;
    }
    function isObject(val) {
      return Object.prototype.toString.call(val) === "[object Object]";
    }
    function compactObject(data) {
      if (!isObject(data)) {
        return data;
      }
      return Object.keys(data).reduce(function(accumulator, key) {
        var isObj = isObject(data[key]);
        var value = isObj ? compactObject(data[key]) : data[key];
        var isEmptyObject = isObj && !Object.keys(value).length;
        if (value === undefined || isEmptyObject) {
          return accumulator;
        }
        return Object.assign(accumulator, _defineProperty({}, key, value));
      }, {});
    }
    function walkStats(stats, base, resultSet) {
      if (!base || resultSet.has(base.id)) {
        return;
      }
      resultSet.set(base.id, base);
      Object.keys(base).forEach(function(name) {
        if (name.endsWith("Id")) {
          walkStats(stats, stats.get(base[name]), resultSet);
        } else {
          if (name.endsWith("Ids")) {
            base[name].forEach(function(id) {
              walkStats(stats, stats.get(id), resultSet);
            });
          }
        }
      });
    }
    function filterStats(result, track, outbound) {
      var streamStatsType = outbound ? "outbound-rtp" : "inbound-rtp";
      var filteredResult = new Map;
      if (track === null) {
        return filteredResult;
      }
      var trackStats = [];
      result.forEach(function(value) {
        if (value.type === "track" && value.trackIdentifier === track.id) {
          trackStats.push(value);
        }
      });
      trackStats.forEach(function(trackStat) {
        result.forEach(function(stats) {
          if (stats.type === streamStatsType && stats.trackId === trackStat.id) {
            walkStats(result, stats, filteredResult);
          }
        });
      });
      return filteredResult;
    }
  }, {}], 16:[function(require, module, exports) {
    var SDPUtils = require("sdp");
    function fixStatsType(stat) {
      return {inboundrtp:"inbound-rtp", outboundrtp:"outbound-rtp", candidatepair:"candidate-pair", localcandidate:"local-candidate", remotecandidate:"remote-candidate"}[stat.type] || stat.type;
    }
    function writeMediaSection(transceiver, caps, type, stream, dtlsRole) {
      var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);
      sdp += SDPUtils.writeIceParameters(transceiver.iceGatherer.getLocalParameters());
      sdp += SDPUtils.writeDtlsParameters(transceiver.dtlsTransport.getLocalParameters(), type === "offer" ? "actpass" : dtlsRole || "active");
      sdp += "a=mid:" + transceiver.mid + "\r\n";
      if (transceiver.rtpSender && transceiver.rtpReceiver) {
        sdp += "a=sendrecv\r\n";
      } else {
        if (transceiver.rtpSender) {
          sdp += "a=sendonly\r\n";
        } else {
          if (transceiver.rtpReceiver) {
            sdp += "a=recvonly\r\n";
          } else {
            sdp += "a=inactive\r\n";
          }
        }
      }
      if (transceiver.rtpSender) {
        var trackId = transceiver.rtpSender._initialTrackId || transceiver.rtpSender.track.id;
        transceiver.rtpSender._initialTrackId = trackId;
        var msid = "msid:" + (stream ? stream.id : "-") + " " + trackId + "\r\n";
        sdp += "a=" + msid;
        sdp += "a=ssrc:" + transceiver.sendEncodingParameters[0].ssrc + " " + msid;
        if (transceiver.sendEncodingParameters[0].rtx) {
          sdp += "a=ssrc:" + transceiver.sendEncodingParameters[0].rtx.ssrc + " " + msid;
          sdp += "a=ssrc-group:FID " + transceiver.sendEncodingParameters[0].ssrc + " " + transceiver.sendEncodingParameters[0].rtx.ssrc + "\r\n";
        }
      }
      sdp += "a=ssrc:" + transceiver.sendEncodingParameters[0].ssrc + " cname:" + SDPUtils.localCName + "\r\n";
      if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
        sdp += "a=ssrc:" + transceiver.sendEncodingParameters[0].rtx.ssrc + " cname:" + SDPUtils.localCName + "\r\n";
      }
      return sdp;
    }
    function filterIceServers(iceServers, edgeVersion) {
      var hasTurn = false;
      iceServers = JSON.parse(JSON.stringify(iceServers));
      return iceServers.filter(function(server) {
        if (server && (server.urls || server.url)) {
          var urls = server.urls || server.url;
          if (server.url && !server.urls) {
            console.warn("RTCIceServer.url is deprecated! Use urls instead.");
          }
          var isString = typeof urls === "string";
          if (isString) {
            urls = [urls];
          }
          urls = urls.filter(function(url) {
            var validTurn = url.indexOf("turn:") === 0 && url.indexOf("transport=udp") !== -1 && url.indexOf("turn:[") === -1 && !hasTurn;
            if (validTurn) {
              hasTurn = true;
              return true;
            }
            return url.indexOf("stun:") === 0 && edgeVersion >= 14393 && url.indexOf("?transport=udp") === -1;
          });
          delete server.url;
          server.urls = isString ? urls[0] : urls;
          return !!urls.length;
        }
      });
    }
    function getCommonCapabilities(localCapabilities, remoteCapabilities) {
      var commonCapabilities = {codecs:[], headerExtensions:[], fecMechanisms:[]};
      var findCodecByPayloadType = function(pt, codecs) {
        pt = parseInt(pt, 10);
        for (var i = 0; i < codecs.length; i++) {
          if (codecs[i].payloadType === pt || codecs[i].preferredPayloadType === pt) {
            return codecs[i];
          }
        }
      };
      var rtxCapabilityMatches = function(lRtx, rRtx, lCodecs, rCodecs) {
        var lCodec = findCodecByPayloadType(lRtx.parameters.apt, lCodecs);
        var rCodec = findCodecByPayloadType(rRtx.parameters.apt, rCodecs);
        return lCodec && rCodec && lCodec.name.toLowerCase() === rCodec.name.toLowerCase();
      };
      localCapabilities.codecs.forEach(function(lCodec) {
        for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
          var rCodec = remoteCapabilities.codecs[i];
          if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() && lCodec.clockRate === rCodec.clockRate) {
            if (lCodec.name.toLowerCase() === "rtx" && lCodec.parameters && rCodec.parameters.apt) {
              if (!rtxCapabilityMatches(lCodec, rCodec, localCapabilities.codecs, remoteCapabilities.codecs)) {
                continue;
              }
            }
            rCodec = JSON.parse(JSON.stringify(rCodec));
            rCodec.numChannels = Math.min(lCodec.numChannels, rCodec.numChannels);
            commonCapabilities.codecs.push(rCodec);
            rCodec.rtcpFeedback = rCodec.rtcpFeedback.filter(function(fb) {
              for (var j = 0; j < lCodec.rtcpFeedback.length; j++) {
                if (lCodec.rtcpFeedback[j].type === fb.type && lCodec.rtcpFeedback[j].parameter === fb.parameter) {
                  return true;
                }
              }
              return false;
            });
            break;
          }
        }
      });
      localCapabilities.headerExtensions.forEach(function(lHeaderExtension) {
        for (var i = 0; i < remoteCapabilities.headerExtensions.length; i++) {
          var rHeaderExtension = remoteCapabilities.headerExtensions[i];
          if (lHeaderExtension.uri === rHeaderExtension.uri) {
            commonCapabilities.headerExtensions.push(rHeaderExtension);
            break;
          }
        }
      });
      return commonCapabilities;
    }
    function isActionAllowedInSignalingState(action, type, signalingState) {
      return {offer:{setLocalDescription:["stable", "have-local-offer"], setRemoteDescription:["stable", "have-remote-offer"]}, answer:{setLocalDescription:["have-remote-offer", "have-local-pranswer"], setRemoteDescription:["have-local-offer", "have-remote-pranswer"]}}[type][action].indexOf(signalingState) !== -1;
    }
    function maybeAddCandidate(iceTransport, candidate) {
      var alreadyAdded = iceTransport.getRemoteCandidates().find(function(remoteCandidate) {
        return candidate.foundation === remoteCandidate.foundation && candidate.ip === remoteCandidate.ip && candidate.port === remoteCandidate.port && candidate.priority === remoteCandidate.priority && candidate.protocol === remoteCandidate.protocol && candidate.type === remoteCandidate.type;
      });
      if (!alreadyAdded) {
        iceTransport.addRemoteCandidate(candidate);
      }
      return !alreadyAdded;
    }
    function makeError(name, description) {
      var e = new Error(description);
      e.name = name;
      e.code = {NotSupportedError:9, InvalidStateError:11, InvalidAccessError:15, TypeError:undefined, OperationError:undefined}[name];
      return e;
    }
    module.exports = function(window, edgeVersion) {
      function addTrackToStreamAndFireEvent(track, stream) {
        stream.addTrack(track);
        stream.dispatchEvent(new window.MediaStreamTrackEvent("addtrack", {track:track}));
      }
      function removeTrackFromStreamAndFireEvent(track, stream) {
        stream.removeTrack(track);
        stream.dispatchEvent(new window.MediaStreamTrackEvent("removetrack", {track:track}));
      }
      function fireAddTrack(pc, track, receiver, streams) {
        var trackEvent = new Event("track");
        trackEvent.track = track;
        trackEvent.receiver = receiver;
        trackEvent.transceiver = {receiver:receiver};
        trackEvent.streams = streams;
        window.setTimeout(function() {
          pc._dispatchEvent("track", trackEvent);
        });
      }
      var RTCPeerConnection = function(config) {
        var pc = this;
        var _eventTarget = document.createDocumentFragment();
        ["addEventListener", "removeEventListener", "dispatchEvent"].forEach(function(method) {
          pc[method] = _eventTarget[method].bind(_eventTarget);
        });
        this.canTrickleIceCandidates = null;
        this.needNegotiation = false;
        this.localStreams = [];
        this.remoteStreams = [];
        this._localDescription = null;
        this._remoteDescription = null;
        this.signalingState = "stable";
        this.iceConnectionState = "new";
        this.connectionState = "new";
        this.iceGatheringState = "new";
        config = JSON.parse(JSON.stringify(config || {}));
        this.usingBundle = config.bundlePolicy === "max-bundle";
        if (config.rtcpMuxPolicy === "negotiate") {
          throw makeError("NotSupportedError", "rtcpMuxPolicy 'negotiate' is not supported");
        } else {
          if (!config.rtcpMuxPolicy) {
            config.rtcpMuxPolicy = "require";
          }
        }
        switch(config.iceTransportPolicy) {
          case "all":
          case "relay":
            break;
          default:
            config.iceTransportPolicy = "all";
            break;
        }
        switch(config.bundlePolicy) {
          case "balanced":
          case "max-compat":
          case "max-bundle":
            break;
          default:
            config.bundlePolicy = "balanced";
            break;
        }
        config.iceServers = filterIceServers(config.iceServers || [], edgeVersion);
        this._iceGatherers = [];
        if (config.iceCandidatePoolSize) {
          for (var i = config.iceCandidatePoolSize; i > 0; i--) {
            this._iceGatherers.push(new window.RTCIceGatherer({iceServers:config.iceServers, gatherPolicy:config.iceTransportPolicy}));
          }
        } else {
          config.iceCandidatePoolSize = 0;
        }
        this._config = config;
        this.transceivers = [];
        this._sdpSessionId = SDPUtils.generateSessionId();
        this._sdpSessionVersion = 0;
        this._dtlsRole = undefined;
        this._isClosed = false;
      };
      Object.defineProperty(RTCPeerConnection.prototype, "localDescription", {configurable:true, get:function() {
        return this._localDescription;
      }});
      Object.defineProperty(RTCPeerConnection.prototype, "remoteDescription", {configurable:true, get:function() {
        return this._remoteDescription;
      }});
      RTCPeerConnection.prototype.onicecandidate = null;
      RTCPeerConnection.prototype.onaddstream = null;
      RTCPeerConnection.prototype.ontrack = null;
      RTCPeerConnection.prototype.onremovestream = null;
      RTCPeerConnection.prototype.onsignalingstatechange = null;
      RTCPeerConnection.prototype.oniceconnectionstatechange = null;
      RTCPeerConnection.prototype.onconnectionstatechange = null;
      RTCPeerConnection.prototype.onicegatheringstatechange = null;
      RTCPeerConnection.prototype.onnegotiationneeded = null;
      RTCPeerConnection.prototype.ondatachannel = null;
      RTCPeerConnection.prototype._dispatchEvent = function(name, event) {
        if (this._isClosed) {
          return;
        }
        this.dispatchEvent(event);
        if (typeof this["on" + name] === "function") {
          this["on" + name](event);
        }
      };
      RTCPeerConnection.prototype._emitGatheringStateChange = function() {
        var event = new Event("icegatheringstatechange");
        this._dispatchEvent("icegatheringstatechange", event);
      };
      RTCPeerConnection.prototype.getConfiguration = function() {
        return this._config;
      };
      RTCPeerConnection.prototype.getLocalStreams = function() {
        return this.localStreams;
      };
      RTCPeerConnection.prototype.getRemoteStreams = function() {
        return this.remoteStreams;
      };
      RTCPeerConnection.prototype._createTransceiver = function(kind, doNotAdd) {
        var hasBundleTransport = this.transceivers.length > 0;
        var transceiver = {track:null, iceGatherer:null, iceTransport:null, dtlsTransport:null, localCapabilities:null, remoteCapabilities:null, rtpSender:null, rtpReceiver:null, kind:kind, mid:null, sendEncodingParameters:null, recvEncodingParameters:null, stream:null, associatedRemoteMediaStreams:[], wantReceive:true};
        if (this.usingBundle && hasBundleTransport) {
          transceiver.iceTransport = this.transceivers[0].iceTransport;
          transceiver.dtlsTransport = this.transceivers[0].dtlsTransport;
        } else {
          var transports = this._createIceAndDtlsTransports();
          transceiver.iceTransport = transports.iceTransport;
          transceiver.dtlsTransport = transports.dtlsTransport;
        }
        if (!doNotAdd) {
          this.transceivers.push(transceiver);
        }
        return transceiver;
      };
      RTCPeerConnection.prototype.addTrack = function(track, stream) {
        if (this._isClosed) {
          throw makeError("InvalidStateError", "Attempted to call addTrack on a closed peerconnection.");
        }
        var alreadyExists = this.transceivers.find(function(s) {
          return s.track === track;
        });
        if (alreadyExists) {
          throw makeError("InvalidAccessError", "Track already exists.");
        }
        var transceiver;
        for (var i = 0; i < this.transceivers.length; i++) {
          if (!this.transceivers[i].track && this.transceivers[i].kind === track.kind) {
            transceiver = this.transceivers[i];
          }
        }
        if (!transceiver) {
          transceiver = this._createTransceiver(track.kind);
        }
        this._maybeFireNegotiationNeeded();
        if (this.localStreams.indexOf(stream) === -1) {
          this.localStreams.push(stream);
        }
        transceiver.track = track;
        transceiver.stream = stream;
        transceiver.rtpSender = new window.RTCRtpSender(track, transceiver.dtlsTransport);
        return transceiver.rtpSender;
      };
      RTCPeerConnection.prototype.addStream = function(stream) {
        var pc = this;
        if (edgeVersion >= 15025) {
          stream.getTracks().forEach(function(track) {
            pc.addTrack(track, stream);
          });
        } else {
          var clonedStream = stream.clone();
          stream.getTracks().forEach(function(track, idx) {
            var clonedTrack = clonedStream.getTracks()[idx];
            track.addEventListener("enabled", function(event) {
              clonedTrack.enabled = event.enabled;
            });
          });
          clonedStream.getTracks().forEach(function(track) {
            pc.addTrack(track, clonedStream);
          });
        }
      };
      RTCPeerConnection.prototype.removeTrack = function(sender) {
        if (this._isClosed) {
          throw makeError("InvalidStateError", "Attempted to call removeTrack on a closed peerconnection.");
        }
        if (!(sender instanceof window.RTCRtpSender)) {
          throw new TypeError("Argument 1 of RTCPeerConnection.removeTrack " + "does not implement interface RTCRtpSender.");
        }
        var transceiver = this.transceivers.find(function(t) {
          return t.rtpSender === sender;
        });
        if (!transceiver) {
          throw makeError("InvalidAccessError", "Sender was not created by this connection.");
        }
        var stream = transceiver.stream;
        transceiver.rtpSender.stop();
        transceiver.rtpSender = null;
        transceiver.track = null;
        transceiver.stream = null;
        var localStreams = this.transceivers.map(function(t) {
          return t.stream;
        });
        if (localStreams.indexOf(stream) === -1 && this.localStreams.indexOf(stream) > -1) {
          this.localStreams.splice(this.localStreams.indexOf(stream), 1);
        }
        this._maybeFireNegotiationNeeded();
      };
      RTCPeerConnection.prototype.removeStream = function(stream) {
        var pc = this;
        stream.getTracks().forEach(function(track) {
          var sender = pc.getSenders().find(function(s) {
            return s.track === track;
          });
          if (sender) {
            pc.removeTrack(sender);
          }
        });
      };
      RTCPeerConnection.prototype.getSenders = function() {
        return this.transceivers.filter(function(transceiver) {
          return !!transceiver.rtpSender;
        }).map(function(transceiver) {
          return transceiver.rtpSender;
        });
      };
      RTCPeerConnection.prototype.getReceivers = function() {
        return this.transceivers.filter(function(transceiver) {
          return !!transceiver.rtpReceiver;
        }).map(function(transceiver) {
          return transceiver.rtpReceiver;
        });
      };
      RTCPeerConnection.prototype._createIceGatherer = function(sdpMLineIndex, usingBundle) {
        var pc = this;
        if (usingBundle && sdpMLineIndex > 0) {
          return this.transceivers[0].iceGatherer;
        } else {
          if (this._iceGatherers.length) {
            return this._iceGatherers.shift();
          }
        }
        var iceGatherer = new window.RTCIceGatherer({iceServers:this._config.iceServers, gatherPolicy:this._config.iceTransportPolicy});
        Object.defineProperty(iceGatherer, "state", {value:"new", writable:true});
        this.transceivers[sdpMLineIndex].bufferedCandidateEvents = [];
        this.transceivers[sdpMLineIndex].bufferCandidates = function(event) {
          var end = !event.candidate || Object.keys(event.candidate).length === 0;
          iceGatherer.state = end ? "completed" : "gathering";
          if (pc.transceivers[sdpMLineIndex].bufferedCandidateEvents !== null) {
            pc.transceivers[sdpMLineIndex].bufferedCandidateEvents.push(event);
          }
        };
        iceGatherer.addEventListener("localcandidate", this.transceivers[sdpMLineIndex].bufferCandidates);
        return iceGatherer;
      };
      RTCPeerConnection.prototype._gather = function(mid, sdpMLineIndex) {
        var pc = this;
        var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
        if (iceGatherer.onlocalcandidate) {
          return;
        }
        var bufferedCandidateEvents = this.transceivers[sdpMLineIndex].bufferedCandidateEvents;
        this.transceivers[sdpMLineIndex].bufferedCandidateEvents = null;
        iceGatherer.removeEventListener("localcandidate", this.transceivers[sdpMLineIndex].bufferCandidates);
        iceGatherer.onlocalcandidate = function(evt) {
          if (pc.usingBundle && sdpMLineIndex > 0) {
            return;
          }
          var event = new Event("icecandidate");
          event.candidate = {sdpMid:mid, sdpMLineIndex:sdpMLineIndex};
          var cand = evt.candidate;
          var end = !cand || Object.keys(cand).length === 0;
          if (end) {
            if (iceGatherer.state === "new" || iceGatherer.state === "gathering") {
              iceGatherer.state = "completed";
            }
          } else {
            if (iceGatherer.state === "new") {
              iceGatherer.state = "gathering";
            }
            cand.component = 1;
            cand.ufrag = iceGatherer.getLocalParameters().usernameFragment;
            var serializedCandidate = SDPUtils.writeCandidate(cand);
            event.candidate = Object.assign(event.candidate, SDPUtils.parseCandidate(serializedCandidate));
            event.candidate.candidate = serializedCandidate;
            event.candidate.toJSON = function() {
              return {candidate:event.candidate.candidate, sdpMid:event.candidate.sdpMid, sdpMLineIndex:event.candidate.sdpMLineIndex, usernameFragment:event.candidate.usernameFragment};
            };
          }
          var sections = SDPUtils.getMediaSections(pc._localDescription.sdp);
          if (!end) {
            sections[event.candidate.sdpMLineIndex] += "a=" + event.candidate.candidate + "\r\n";
          } else {
            sections[event.candidate.sdpMLineIndex] += "a=end-of-candidates\r\n";
          }
          pc._localDescription.sdp = SDPUtils.getDescription(pc._localDescription.sdp) + sections.join("");
          var complete = pc.transceivers.every(function(transceiver) {
            return transceiver.iceGatherer && transceiver.iceGatherer.state === "completed";
          });
          if (pc.iceGatheringState !== "gathering") {
            pc.iceGatheringState = "gathering";
            pc._emitGatheringStateChange();
          }
          if (!end) {
            pc._dispatchEvent("icecandidate", event);
          }
          if (complete) {
            pc._dispatchEvent("icecandidate", new Event("icecandidate"));
            pc.iceGatheringState = "complete";
            pc._emitGatheringStateChange();
          }
        };
        window.setTimeout(function() {
          bufferedCandidateEvents.forEach(function(e) {
            iceGatherer.onlocalcandidate(e);
          });
        }, 0);
      };
      RTCPeerConnection.prototype._createIceAndDtlsTransports = function() {
        var pc = this;
        var iceTransport = new window.RTCIceTransport(null);
        iceTransport.onicestatechange = function() {
          pc._updateIceConnectionState();
          pc._updateConnectionState();
        };
        var dtlsTransport = new window.RTCDtlsTransport(iceTransport);
        dtlsTransport.ondtlsstatechange = function() {
          pc._updateConnectionState();
        };
        dtlsTransport.onerror = function() {
          Object.defineProperty(dtlsTransport, "state", {value:"failed", writable:true});
          pc._updateConnectionState();
        };
        return {iceTransport:iceTransport, dtlsTransport:dtlsTransport};
      };
      RTCPeerConnection.prototype._disposeIceAndDtlsTransports = function(sdpMLineIndex) {
        var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
        if (iceGatherer) {
          delete iceGatherer.onlocalcandidate;
          delete this.transceivers[sdpMLineIndex].iceGatherer;
        }
        var iceTransport = this.transceivers[sdpMLineIndex].iceTransport;
        if (iceTransport) {
          delete iceTransport.onicestatechange;
          delete this.transceivers[sdpMLineIndex].iceTransport;
        }
        var dtlsTransport = this.transceivers[sdpMLineIndex].dtlsTransport;
        if (dtlsTransport) {
          delete dtlsTransport.ondtlsstatechange;
          delete dtlsTransport.onerror;
          delete this.transceivers[sdpMLineIndex].dtlsTransport;
        }
      };
      RTCPeerConnection.prototype._transceive = function(transceiver, send, recv) {
        var params = getCommonCapabilities(transceiver.localCapabilities, transceiver.remoteCapabilities);
        if (send && transceiver.rtpSender) {
          params.encodings = transceiver.sendEncodingParameters;
          params.rtcp = {cname:SDPUtils.localCName, compound:transceiver.rtcpParameters.compound};
          if (transceiver.recvEncodingParameters.length) {
            params.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc;
          }
          transceiver.rtpSender.send(params);
        }
        if (recv && transceiver.rtpReceiver && params.codecs.length > 0) {
          if (transceiver.kind === "video" && transceiver.recvEncodingParameters && edgeVersion < 15019) {
            transceiver.recvEncodingParameters.forEach(function(p) {
              delete p.rtx;
            });
          }
          if (transceiver.recvEncodingParameters.length) {
            params.encodings = transceiver.recvEncodingParameters;
          } else {
            params.encodings = [{}];
          }
          params.rtcp = {compound:transceiver.rtcpParameters.compound};
          if (transceiver.rtcpParameters.cname) {
            params.rtcp.cname = transceiver.rtcpParameters.cname;
          }
          if (transceiver.sendEncodingParameters.length) {
            params.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc;
          }
          transceiver.rtpReceiver.receive(params);
        }
      };
      RTCPeerConnection.prototype.setLocalDescription = function(description) {
        var pc = this;
        if (["offer", "answer"].indexOf(description.type) === -1) {
          return Promise.reject(makeError("TypeError", 'Unsupported type "' + description.type + '"'));
        }
        if (!isActionAllowedInSignalingState("setLocalDescription", description.type, pc.signalingState) || pc._isClosed) {
          return Promise.reject(makeError("InvalidStateError", "Can not set local " + description.type + " in state " + pc.signalingState));
        }
        var sections;
        var sessionpart;
        if (description.type === "offer") {
          sections = SDPUtils.splitSections(description.sdp);
          sessionpart = sections.shift();
          sections.forEach(function(mediaSection, sdpMLineIndex) {
            var caps = SDPUtils.parseRtpParameters(mediaSection);
            pc.transceivers[sdpMLineIndex].localCapabilities = caps;
          });
          pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
            pc._gather(transceiver.mid, sdpMLineIndex);
          });
        } else {
          if (description.type === "answer") {
            sections = SDPUtils.splitSections(pc._remoteDescription.sdp);
            sessionpart = sections.shift();
            var isIceLite = SDPUtils.matchPrefix(sessionpart, "a=ice-lite").length > 0;
            sections.forEach(function(mediaSection, sdpMLineIndex) {
              var transceiver = pc.transceivers[sdpMLineIndex];
              var iceGatherer = transceiver.iceGatherer;
              var iceTransport = transceiver.iceTransport;
              var dtlsTransport = transceiver.dtlsTransport;
              var localCapabilities = transceiver.localCapabilities;
              var remoteCapabilities = transceiver.remoteCapabilities;
              var rejected = SDPUtils.isRejected(mediaSection) && SDPUtils.matchPrefix(mediaSection, "a=bundle-only").length === 0;
              if (!rejected && !transceiver.rejected) {
                var remoteIceParameters = SDPUtils.getIceParameters(mediaSection, sessionpart);
                var remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection, sessionpart);
                if (isIceLite) {
                  remoteDtlsParameters.role = "server";
                }
                if (!pc.usingBundle || sdpMLineIndex === 0) {
                  pc._gather(transceiver.mid, sdpMLineIndex);
                  if (iceTransport.state === "new") {
                    iceTransport.start(iceGatherer, remoteIceParameters, isIceLite ? "controlling" : "controlled");
                  }
                  if (dtlsTransport.state === "new") {
                    dtlsTransport.start(remoteDtlsParameters);
                  }
                }
                var params = getCommonCapabilities(localCapabilities, remoteCapabilities);
                pc._transceive(transceiver, params.codecs.length > 0, false);
              }
            });
          }
        }
        pc._localDescription = {type:description.type, sdp:description.sdp};
        if (description.type === "offer") {
          pc._updateSignalingState("have-local-offer");
        } else {
          pc._updateSignalingState("stable");
        }
        return Promise.resolve();
      };
      RTCPeerConnection.prototype.setRemoteDescription = function(description) {
        var pc = this;
        if (["offer", "answer"].indexOf(description.type) === -1) {
          return Promise.reject(makeError("TypeError", 'Unsupported type "' + description.type + '"'));
        }
        if (!isActionAllowedInSignalingState("setRemoteDescription", description.type, pc.signalingState) || pc._isClosed) {
          return Promise.reject(makeError("InvalidStateError", "Can not set remote " + description.type + " in state " + pc.signalingState));
        }
        var streams = {};
        pc.remoteStreams.forEach(function(stream) {
          streams[stream.id] = stream;
        });
        var receiverList = [];
        var sections = SDPUtils.splitSections(description.sdp);
        var sessionpart = sections.shift();
        var isIceLite = SDPUtils.matchPrefix(sessionpart, "a=ice-lite").length > 0;
        var usingBundle = SDPUtils.matchPrefix(sessionpart, "a=group:BUNDLE ").length > 0;
        pc.usingBundle = usingBundle;
        var iceOptions = SDPUtils.matchPrefix(sessionpart, "a=ice-options:")[0];
        if (iceOptions) {
          pc.canTrickleIceCandidates = iceOptions.substr(14).split(" ").indexOf("trickle") >= 0;
        } else {
          pc.canTrickleIceCandidates = false;
        }
        sections.forEach(function(mediaSection, sdpMLineIndex) {
          var lines = SDPUtils.splitLines(mediaSection);
          var kind = SDPUtils.getKind(mediaSection);
          var rejected = SDPUtils.isRejected(mediaSection) && SDPUtils.matchPrefix(mediaSection, "a=bundle-only").length === 0;
          var protocol = lines[0].substr(2).split(" ")[2];
          var direction = SDPUtils.getDirection(mediaSection, sessionpart);
          var remoteMsid = SDPUtils.parseMsid(mediaSection);
          var mid = SDPUtils.getMid(mediaSection) || SDPUtils.generateIdentifier();
          if (rejected || kind === "application" && (protocol === "DTLS/SCTP" || protocol === "UDP/DTLS/SCTP")) {
            pc.transceivers[sdpMLineIndex] = {mid:mid, kind:kind, protocol:protocol, rejected:true};
            return;
          }
          if (!rejected && pc.transceivers[sdpMLineIndex] && pc.transceivers[sdpMLineIndex].rejected) {
            pc.transceivers[sdpMLineIndex] = pc._createTransceiver(kind, true);
          }
          var transceiver;
          var iceGatherer;
          var iceTransport;
          var dtlsTransport;
          var rtpReceiver;
          var sendEncodingParameters;
          var recvEncodingParameters;
          var localCapabilities;
          var track;
          var remoteCapabilities = SDPUtils.parseRtpParameters(mediaSection);
          var remoteIceParameters;
          var remoteDtlsParameters;
          if (!rejected) {
            remoteIceParameters = SDPUtils.getIceParameters(mediaSection, sessionpart);
            remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection, sessionpart);
            remoteDtlsParameters.role = "client";
          }
          recvEncodingParameters = SDPUtils.parseRtpEncodingParameters(mediaSection);
          var rtcpParameters = SDPUtils.parseRtcpParameters(mediaSection);
          var isComplete = SDPUtils.matchPrefix(mediaSection, "a=end-of-candidates", sessionpart).length > 0;
          var cands = SDPUtils.matchPrefix(mediaSection, "a=candidate:").map(function(cand) {
            return SDPUtils.parseCandidate(cand);
          }).filter(function(cand) {
            return cand.component === 1;
          });
          if ((description.type === "offer" || description.type === "answer") && !rejected && usingBundle && sdpMLineIndex > 0 && pc.transceivers[sdpMLineIndex]) {
            pc._disposeIceAndDtlsTransports(sdpMLineIndex);
            pc.transceivers[sdpMLineIndex].iceGatherer = pc.transceivers[0].iceGatherer;
            pc.transceivers[sdpMLineIndex].iceTransport = pc.transceivers[0].iceTransport;
            pc.transceivers[sdpMLineIndex].dtlsTransport = pc.transceivers[0].dtlsTransport;
            if (pc.transceivers[sdpMLineIndex].rtpSender) {
              pc.transceivers[sdpMLineIndex].rtpSender.setTransport(pc.transceivers[0].dtlsTransport);
            }
            if (pc.transceivers[sdpMLineIndex].rtpReceiver) {
              pc.transceivers[sdpMLineIndex].rtpReceiver.setTransport(pc.transceivers[0].dtlsTransport);
            }
          }
          if (description.type === "offer" && !rejected) {
            transceiver = pc.transceivers[sdpMLineIndex] || pc._createTransceiver(kind);
            transceiver.mid = mid;
            if (!transceiver.iceGatherer) {
              transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex, usingBundle);
            }
            if (cands.length && transceiver.iceTransport.state === "new") {
              if (isComplete && (!usingBundle || sdpMLineIndex === 0)) {
                transceiver.iceTransport.setRemoteCandidates(cands);
              } else {
                cands.forEach(function(candidate) {
                  maybeAddCandidate(transceiver.iceTransport, candidate);
                });
              }
            }
            localCapabilities = window.RTCRtpReceiver.getCapabilities(kind);
            if (edgeVersion < 15019) {
              localCapabilities.codecs = localCapabilities.codecs.filter(function(codec) {
                return codec.name !== "rtx";
              });
            }
            sendEncodingParameters = transceiver.sendEncodingParameters || [{ssrc:(2 * sdpMLineIndex + 2) * 1001}];
            var isNewTrack = false;
            if (direction === "sendrecv" || direction === "sendonly") {
              isNewTrack = !transceiver.rtpReceiver;
              rtpReceiver = transceiver.rtpReceiver || new window.RTCRtpReceiver(transceiver.dtlsTransport, kind);
              if (isNewTrack) {
                var stream;
                track = rtpReceiver.track;
                if (remoteMsid && remoteMsid.stream === "-") {
                } else {
                  if (remoteMsid) {
                    if (!streams[remoteMsid.stream]) {
                      streams[remoteMsid.stream] = new window.MediaStream;
                      Object.defineProperty(streams[remoteMsid.stream], "id", {get:function() {
                        return remoteMsid.stream;
                      }});
                    }
                    Object.defineProperty(track, "id", {get:function() {
                      return remoteMsid.track;
                    }});
                    stream = streams[remoteMsid.stream];
                  } else {
                    if (!streams.default) {
                      streams.default = new window.MediaStream;
                    }
                    stream = streams.default;
                  }
                }
                if (stream) {
                  addTrackToStreamAndFireEvent(track, stream);
                  transceiver.associatedRemoteMediaStreams.push(stream);
                }
                receiverList.push([track, rtpReceiver, stream]);
              }
            } else {
              if (transceiver.rtpReceiver && transceiver.rtpReceiver.track) {
                transceiver.associatedRemoteMediaStreams.forEach(function(s) {
                  var nativeTrack = s.getTracks().find(function(t) {
                    return t.id === transceiver.rtpReceiver.track.id;
                  });
                  if (nativeTrack) {
                    removeTrackFromStreamAndFireEvent(nativeTrack, s);
                  }
                });
                transceiver.associatedRemoteMediaStreams = [];
              }
            }
            transceiver.localCapabilities = localCapabilities;
            transceiver.remoteCapabilities = remoteCapabilities;
            transceiver.rtpReceiver = rtpReceiver;
            transceiver.rtcpParameters = rtcpParameters;
            transceiver.sendEncodingParameters = sendEncodingParameters;
            transceiver.recvEncodingParameters = recvEncodingParameters;
            pc._transceive(pc.transceivers[sdpMLineIndex], false, isNewTrack);
          } else {
            if (description.type === "answer" && !rejected) {
              transceiver = pc.transceivers[sdpMLineIndex];
              iceGatherer = transceiver.iceGatherer;
              iceTransport = transceiver.iceTransport;
              dtlsTransport = transceiver.dtlsTransport;
              rtpReceiver = transceiver.rtpReceiver;
              sendEncodingParameters = transceiver.sendEncodingParameters;
              localCapabilities = transceiver.localCapabilities;
              pc.transceivers[sdpMLineIndex].recvEncodingParameters = recvEncodingParameters;
              pc.transceivers[sdpMLineIndex].remoteCapabilities = remoteCapabilities;
              pc.transceivers[sdpMLineIndex].rtcpParameters = rtcpParameters;
              if (cands.length && iceTransport.state === "new") {
                if ((isIceLite || isComplete) && (!usingBundle || sdpMLineIndex === 0)) {
                  iceTransport.setRemoteCandidates(cands);
                } else {
                  cands.forEach(function(candidate) {
                    maybeAddCandidate(transceiver.iceTransport, candidate);
                  });
                }
              }
              if (!usingBundle || sdpMLineIndex === 0) {
                if (iceTransport.state === "new") {
                  iceTransport.start(iceGatherer, remoteIceParameters, "controlling");
                }
                if (dtlsTransport.state === "new") {
                  dtlsTransport.start(remoteDtlsParameters);
                }
              }
              var commonCapabilities = getCommonCapabilities(transceiver.localCapabilities, transceiver.remoteCapabilities);
              var hasRtx = commonCapabilities.codecs.filter(function(c) {
                return c.name.toLowerCase() === "rtx";
              }).length;
              if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
                delete transceiver.sendEncodingParameters[0].rtx;
              }
              pc._transceive(transceiver, direction === "sendrecv" || direction === "recvonly", direction === "sendrecv" || direction === "sendonly");
              if (rtpReceiver && (direction === "sendrecv" || direction === "sendonly")) {
                track = rtpReceiver.track;
                if (remoteMsid) {
                  if (!streams[remoteMsid.stream]) {
                    streams[remoteMsid.stream] = new window.MediaStream;
                  }
                  addTrackToStreamAndFireEvent(track, streams[remoteMsid.stream]);
                  receiverList.push([track, rtpReceiver, streams[remoteMsid.stream]]);
                } else {
                  if (!streams.default) {
                    streams.default = new window.MediaStream;
                  }
                  addTrackToStreamAndFireEvent(track, streams.default);
                  receiverList.push([track, rtpReceiver, streams.default]);
                }
              } else {
                delete transceiver.rtpReceiver;
              }
            }
          }
        });
        if (pc._dtlsRole === undefined) {
          pc._dtlsRole = description.type === "offer" ? "active" : "passive";
        }
        pc._remoteDescription = {type:description.type, sdp:description.sdp};
        if (description.type === "offer") {
          pc._updateSignalingState("have-remote-offer");
        } else {
          pc._updateSignalingState("stable");
        }
        Object.keys(streams).forEach(function(sid) {
          var stream = streams[sid];
          if (stream.getTracks().length) {
            if (pc.remoteStreams.indexOf(stream) === -1) {
              pc.remoteStreams.push(stream);
              var event = new Event("addstream");
              event.stream = stream;
              window.setTimeout(function() {
                pc._dispatchEvent("addstream", event);
              });
            }
            receiverList.forEach(function(item) {
              var track = item[0];
              var receiver = item[1];
              if (stream.id !== item[2].id) {
                return;
              }
              fireAddTrack(pc, track, receiver, [stream]);
            });
          }
        });
        receiverList.forEach(function(item) {
          if (item[2]) {
            return;
          }
          fireAddTrack(pc, item[0], item[1], []);
        });
        window.setTimeout(function() {
          if (!(pc && pc.transceivers)) {
            return;
          }
          pc.transceivers.forEach(function(transceiver) {
            if (transceiver.iceTransport && transceiver.iceTransport.state === "new" && transceiver.iceTransport.getRemoteCandidates().length > 0) {
              console.warn("Timeout for addRemoteCandidate. Consider sending " + "an end-of-candidates notification");
              transceiver.iceTransport.addRemoteCandidate({});
            }
          });
        }, 4000);
        return Promise.resolve();
      };
      RTCPeerConnection.prototype.close = function() {
        this.transceivers.forEach(function(transceiver) {
          if (transceiver.iceTransport) {
            transceiver.iceTransport.stop();
          }
          if (transceiver.dtlsTransport) {
            transceiver.dtlsTransport.stop();
          }
          if (transceiver.rtpSender) {
            transceiver.rtpSender.stop();
          }
          if (transceiver.rtpReceiver) {
            transceiver.rtpReceiver.stop();
          }
        });
        this._isClosed = true;
        this._updateSignalingState("closed");
      };
      RTCPeerConnection.prototype._updateSignalingState = function(newState) {
        this.signalingState = newState;
        var event = new Event("signalingstatechange");
        this._dispatchEvent("signalingstatechange", event);
      };
      RTCPeerConnection.prototype._maybeFireNegotiationNeeded = function() {
        var pc = this;
        if (this.signalingState !== "stable" || this.needNegotiation === true) {
          return;
        }
        this.needNegotiation = true;
        window.setTimeout(function() {
          if (pc.needNegotiation) {
            pc.needNegotiation = false;
            var event = new Event("negotiationneeded");
            pc._dispatchEvent("negotiationneeded", event);
          }
        }, 0);
      };
      RTCPeerConnection.prototype._updateIceConnectionState = function() {
        var newState;
        var states = {"new":0, closed:0, checking:0, connected:0, completed:0, disconnected:0, failed:0};
        this.transceivers.forEach(function(transceiver) {
          if (transceiver.iceTransport && !transceiver.rejected) {
            states[transceiver.iceTransport.state]++;
          }
        });
        newState = "new";
        if (states.failed > 0) {
          newState = "failed";
        } else {
          if (states.checking > 0) {
            newState = "checking";
          } else {
            if (states.disconnected > 0) {
              newState = "disconnected";
            } else {
              if (states.new > 0) {
                newState = "new";
              } else {
                if (states.connected > 0) {
                  newState = "connected";
                } else {
                  if (states.completed > 0) {
                    newState = "completed";
                  }
                }
              }
            }
          }
        }
        if (newState !== this.iceConnectionState) {
          this.iceConnectionState = newState;
          var event = new Event("iceconnectionstatechange");
          this._dispatchEvent("iceconnectionstatechange", event);
        }
      };
      RTCPeerConnection.prototype._updateConnectionState = function() {
        var newState;
        var states = {"new":0, closed:0, connecting:0, connected:0, completed:0, disconnected:0, failed:0};
        this.transceivers.forEach(function(transceiver) {
          if (transceiver.iceTransport && transceiver.dtlsTransport && !transceiver.rejected) {
            states[transceiver.iceTransport.state]++;
            states[transceiver.dtlsTransport.state]++;
          }
        });
        states.connected += states.completed;
        newState = "new";
        if (states.failed > 0) {
          newState = "failed";
        } else {
          if (states.connecting > 0) {
            newState = "connecting";
          } else {
            if (states.disconnected > 0) {
              newState = "disconnected";
            } else {
              if (states.new > 0) {
                newState = "new";
              } else {
                if (states.connected > 0) {
                  newState = "connected";
                }
              }
            }
          }
        }
        if (newState !== this.connectionState) {
          this.connectionState = newState;
          var event = new Event("connectionstatechange");
          this._dispatchEvent("connectionstatechange", event);
        }
      };
      RTCPeerConnection.prototype.createOffer = function() {
        var pc = this;
        if (pc._isClosed) {
          return Promise.reject(makeError("InvalidStateError", "Can not call createOffer after close"));
        }
        var numAudioTracks = pc.transceivers.filter(function(t) {
          return t.kind === "audio";
        }).length;
        var numVideoTracks = pc.transceivers.filter(function(t) {
          return t.kind === "video";
        }).length;
        var offerOptions = arguments[0];
        if (offerOptions) {
          if (offerOptions.mandatory || offerOptions.optional) {
            throw new TypeError("Legacy mandatory/optional constraints not supported.");
          }
          if (offerOptions.offerToReceiveAudio !== undefined) {
            if (offerOptions.offerToReceiveAudio === true) {
              numAudioTracks = 1;
            } else {
              if (offerOptions.offerToReceiveAudio === false) {
                numAudioTracks = 0;
              } else {
                numAudioTracks = offerOptions.offerToReceiveAudio;
              }
            }
          }
          if (offerOptions.offerToReceiveVideo !== undefined) {
            if (offerOptions.offerToReceiveVideo === true) {
              numVideoTracks = 1;
            } else {
              if (offerOptions.offerToReceiveVideo === false) {
                numVideoTracks = 0;
              } else {
                numVideoTracks = offerOptions.offerToReceiveVideo;
              }
            }
          }
        }
        pc.transceivers.forEach(function(transceiver) {
          if (transceiver.kind === "audio") {
            numAudioTracks--;
            if (numAudioTracks < 0) {
              transceiver.wantReceive = false;
            }
          } else {
            if (transceiver.kind === "video") {
              numVideoTracks--;
              if (numVideoTracks < 0) {
                transceiver.wantReceive = false;
              }
            }
          }
        });
        while (numAudioTracks > 0 || numVideoTracks > 0) {
          if (numAudioTracks > 0) {
            pc._createTransceiver("audio");
            numAudioTracks--;
          }
          if (numVideoTracks > 0) {
            pc._createTransceiver("video");
            numVideoTracks--;
          }
        }
        var sdp = SDPUtils.writeSessionBoilerplate(pc._sdpSessionId, pc._sdpSessionVersion++);
        pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
          var track = transceiver.track;
          var kind = transceiver.kind;
          var mid = transceiver.mid || SDPUtils.generateIdentifier();
          transceiver.mid = mid;
          if (!transceiver.iceGatherer) {
            transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex, pc.usingBundle);
          }
          var localCapabilities = window.RTCRtpSender.getCapabilities(kind);
          if (edgeVersion < 15019) {
            localCapabilities.codecs = localCapabilities.codecs.filter(function(codec) {
              return codec.name !== "rtx";
            });
          }
          localCapabilities.codecs.forEach(function(codec) {
            if (codec.name === "H264" && codec.parameters["level-asymmetry-allowed"] === undefined) {
              codec.parameters["level-asymmetry-allowed"] = "1";
            }
            if (transceiver.remoteCapabilities && transceiver.remoteCapabilities.codecs) {
              transceiver.remoteCapabilities.codecs.forEach(function(remoteCodec) {
                if (codec.name.toLowerCase() === remoteCodec.name.toLowerCase() && codec.clockRate === remoteCodec.clockRate) {
                  codec.preferredPayloadType = remoteCodec.payloadType;
                }
              });
            }
          });
          localCapabilities.headerExtensions.forEach(function(hdrExt) {
            var remoteExtensions = transceiver.remoteCapabilities && transceiver.remoteCapabilities.headerExtensions || [];
            remoteExtensions.forEach(function(rHdrExt) {
              if (hdrExt.uri === rHdrExt.uri) {
                hdrExt.id = rHdrExt.id;
              }
            });
          });
          var sendEncodingParameters = transceiver.sendEncodingParameters || [{ssrc:(2 * sdpMLineIndex + 1) * 1001}];
          if (track) {
            if (edgeVersion >= 15019 && kind === "video" && !sendEncodingParameters[0].rtx) {
              sendEncodingParameters[0].rtx = {ssrc:sendEncodingParameters[0].ssrc + 1};
            }
          }
          if (transceiver.wantReceive) {
            transceiver.rtpReceiver = new window.RTCRtpReceiver(transceiver.dtlsTransport, kind);
          }
          transceiver.localCapabilities = localCapabilities;
          transceiver.sendEncodingParameters = sendEncodingParameters;
        });
        if (pc._config.bundlePolicy !== "max-compat") {
          sdp += "a=group:BUNDLE " + pc.transceivers.map(function(t) {
            return t.mid;
          }).join(" ") + "\r\n";
        }
        sdp += "a=ice-options:trickle\r\n";
        pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
          sdp += writeMediaSection(transceiver, transceiver.localCapabilities, "offer", transceiver.stream, pc._dtlsRole);
          sdp += "a=rtcp-rsize\r\n";
          if (transceiver.iceGatherer && pc.iceGatheringState !== "new" && (sdpMLineIndex === 0 || !pc.usingBundle)) {
            transceiver.iceGatherer.getLocalCandidates().forEach(function(cand) {
              cand.component = 1;
              sdp += "a=" + SDPUtils.writeCandidate(cand) + "\r\n";
            });
            if (transceiver.iceGatherer.state === "completed") {
              sdp += "a=end-of-candidates\r\n";
            }
          }
        });
        var desc = new window.RTCSessionDescription({type:"offer", sdp:sdp});
        return Promise.resolve(desc);
      };
      RTCPeerConnection.prototype.createAnswer = function() {
        var pc = this;
        if (pc._isClosed) {
          return Promise.reject(makeError("InvalidStateError", "Can not call createAnswer after close"));
        }
        if (!(pc.signalingState === "have-remote-offer" || pc.signalingState === "have-local-pranswer")) {
          return Promise.reject(makeError("InvalidStateError", "Can not call createAnswer in signalingState " + pc.signalingState));
        }
        var sdp = SDPUtils.writeSessionBoilerplate(pc._sdpSessionId, pc._sdpSessionVersion++);
        if (pc.usingBundle) {
          sdp += "a=group:BUNDLE " + pc.transceivers.map(function(t) {
            return t.mid;
          }).join(" ") + "\r\n";
        }
        sdp += "a=ice-options:trickle\r\n";
        var mediaSectionsInOffer = SDPUtils.getMediaSections(pc._remoteDescription.sdp).length;
        pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
          if (sdpMLineIndex + 1 > mediaSectionsInOffer) {
            return;
          }
          if (transceiver.rejected) {
            if (transceiver.kind === "application") {
              if (transceiver.protocol === "DTLS/SCTP") {
                sdp += "m=application 0 DTLS/SCTP 5000\r\n";
              } else {
                sdp += "m=application 0 " + transceiver.protocol + " webrtc-datachannel\r\n";
              }
            } else {
              if (transceiver.kind === "audio") {
                sdp += "m=audio 0 UDP/TLS/RTP/SAVPF 0\r\n" + "a=rtpmap:0 PCMU/8000\r\n";
              } else {
                if (transceiver.kind === "video") {
                  sdp += "m=video 0 UDP/TLS/RTP/SAVPF 120\r\n" + "a=rtpmap:120 VP8/90000\r\n";
                }
              }
            }
            sdp += "c=IN IP4 0.0.0.0\r\n" + "a=inactive\r\n" + "a=mid:" + transceiver.mid + "\r\n";
            return;
          }
          if (transceiver.stream) {
            var localTrack;
            if (transceiver.kind === "audio") {
              localTrack = transceiver.stream.getAudioTracks()[0];
            } else {
              if (transceiver.kind === "video") {
                localTrack = transceiver.stream.getVideoTracks()[0];
              }
            }
            if (localTrack) {
              if (edgeVersion >= 15019 && transceiver.kind === "video" && !transceiver.sendEncodingParameters[0].rtx) {
                transceiver.sendEncodingParameters[0].rtx = {ssrc:transceiver.sendEncodingParameters[0].ssrc + 1};
              }
            }
          }
          var commonCapabilities = getCommonCapabilities(transceiver.localCapabilities, transceiver.remoteCapabilities);
          var hasRtx = commonCapabilities.codecs.filter(function(c) {
            return c.name.toLowerCase() === "rtx";
          }).length;
          if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
            delete transceiver.sendEncodingParameters[0].rtx;
          }
          sdp += writeMediaSection(transceiver, commonCapabilities, "answer", transceiver.stream, pc._dtlsRole);
          if (transceiver.rtcpParameters && transceiver.rtcpParameters.reducedSize) {
            sdp += "a=rtcp-rsize\r\n";
          }
        });
        var desc = new window.RTCSessionDescription({type:"answer", sdp:sdp});
        return Promise.resolve(desc);
      };
      RTCPeerConnection.prototype.addIceCandidate = function(candidate) {
        var pc = this;
        var sections;
        if (candidate && !(candidate.sdpMLineIndex !== undefined || candidate.sdpMid)) {
          return Promise.reject(new TypeError("sdpMLineIndex or sdpMid required"));
        }
        return new Promise(function(resolve, reject) {
          if (!pc._remoteDescription) {
            return reject(makeError("InvalidStateError", "Can not add ICE candidate without a remote description"));
          } else {
            if (!candidate || candidate.candidate === "") {
              for (var j = 0; j < pc.transceivers.length; j++) {
                if (pc.transceivers[j].rejected) {
                  continue;
                }
                pc.transceivers[j].iceTransport.addRemoteCandidate({});
                sections = SDPUtils.getMediaSections(pc._remoteDescription.sdp);
                sections[j] += "a=end-of-candidates\r\n";
                pc._remoteDescription.sdp = SDPUtils.getDescription(pc._remoteDescription.sdp) + sections.join("");
                if (pc.usingBundle) {
                  break;
                }
              }
            } else {
              var sdpMLineIndex = candidate.sdpMLineIndex;
              if (candidate.sdpMid) {
                for (var i = 0; i < pc.transceivers.length; i++) {
                  if (pc.transceivers[i].mid === candidate.sdpMid) {
                    sdpMLineIndex = i;
                    break;
                  }
                }
              }
              var transceiver = pc.transceivers[sdpMLineIndex];
              if (transceiver) {
                if (transceiver.rejected) {
                  return resolve();
                }
                var cand = Object.keys(candidate.candidate).length > 0 ? SDPUtils.parseCandidate(candidate.candidate) : {};
                if (cand.protocol === "tcp" && (cand.port === 0 || cand.port === 9)) {
                  return resolve();
                }
                if (cand.component && cand.component !== 1) {
                  return resolve();
                }
                if (sdpMLineIndex === 0 || sdpMLineIndex > 0 && transceiver.iceTransport !== pc.transceivers[0].iceTransport) {
                  if (!maybeAddCandidate(transceiver.iceTransport, cand)) {
                    return reject(makeError("OperationError", "Can not add ICE candidate"));
                  }
                }
                var candidateString = candidate.candidate.trim();
                if (candidateString.indexOf("a=") === 0) {
                  candidateString = candidateString.substr(2);
                }
                sections = SDPUtils.getMediaSections(pc._remoteDescription.sdp);
                sections[sdpMLineIndex] += "a=" + (cand.type ? candidateString : "end-of-candidates") + "\r\n";
                pc._remoteDescription.sdp = SDPUtils.getDescription(pc._remoteDescription.sdp) + sections.join("");
              } else {
                return reject(makeError("OperationError", "Can not add ICE candidate"));
              }
            }
          }
          resolve();
        });
      };
      RTCPeerConnection.prototype.getStats = function(selector) {
        if (selector && selector instanceof window.MediaStreamTrack) {
          var senderOrReceiver = null;
          this.transceivers.forEach(function(transceiver) {
            if (transceiver.rtpSender && transceiver.rtpSender.track === selector) {
              senderOrReceiver = transceiver.rtpSender;
            } else {
              if (transceiver.rtpReceiver && transceiver.rtpReceiver.track === selector) {
                senderOrReceiver = transceiver.rtpReceiver;
              }
            }
          });
          if (!senderOrReceiver) {
            throw makeError("InvalidAccessError", "Invalid selector.");
          }
          return senderOrReceiver.getStats();
        }
        var promises = [];
        this.transceivers.forEach(function(transceiver) {
          ["rtpSender", "rtpReceiver", "iceGatherer", "iceTransport", "dtlsTransport"].forEach(function(method) {
            if (transceiver[method]) {
              promises.push(transceiver[method].getStats());
            }
          });
        });
        return Promise.all(promises).then(function(allStats) {
          var results = new Map;
          allStats.forEach(function(stats) {
            stats.forEach(function(stat) {
              results.set(stat.id, stat);
            });
          });
          return results;
        });
      };
      var ortcObjects = ["RTCRtpSender", "RTCRtpReceiver", "RTCIceGatherer", "RTCIceTransport", "RTCDtlsTransport"];
      ortcObjects.forEach(function(ortcObjectName) {
        var obj = window[ortcObjectName];
        if (obj && obj.prototype && obj.prototype.getStats) {
          var nativeGetstats = obj.prototype.getStats;
          obj.prototype.getStats = function() {
            return nativeGetstats.apply(this).then(function(nativeStats) {
              var mapStats = new Map;
              Object.keys(nativeStats).forEach(function(id) {
                nativeStats[id].type = fixStatsType(nativeStats[id]);
                mapStats.set(id, nativeStats[id]);
              });
              return mapStats;
            });
          };
        }
      });
      var methods = ["createOffer", "createAnswer"];
      methods.forEach(function(method) {
        var nativeMethod = RTCPeerConnection.prototype[method];
        RTCPeerConnection.prototype[method] = function() {
          var args = arguments;
          if (typeof args[0] === "function" || typeof args[1] === "function") {
            return nativeMethod.apply(this, [arguments[2]]).then(function(description) {
              if (typeof args[0] === "function") {
                args[0].apply(null, [description]);
              }
            }, function(error) {
              if (typeof args[1] === "function") {
                args[1].apply(null, [error]);
              }
            });
          }
          return nativeMethod.apply(this, arguments);
        };
      });
      methods = ["setLocalDescription", "setRemoteDescription", "addIceCandidate"];
      methods.forEach(function(method) {
        var nativeMethod = RTCPeerConnection.prototype[method];
        RTCPeerConnection.prototype[method] = function() {
          var args = arguments;
          if (typeof args[1] === "function" || typeof args[2] === "function") {
            return nativeMethod.apply(this, arguments).then(function() {
              if (typeof args[1] === "function") {
                args[1].apply(null);
              }
            }, function(error) {
              if (typeof args[2] === "function") {
                args[2].apply(null, [error]);
              }
            });
          }
          return nativeMethod.apply(this, arguments);
        };
      });
      ["getStats"].forEach(function(method) {
        var nativeMethod = RTCPeerConnection.prototype[method];
        RTCPeerConnection.prototype[method] = function() {
          var args = arguments;
          if (typeof args[1] === "function") {
            return nativeMethod.apply(this, arguments).then(function() {
              if (typeof args[1] === "function") {
                args[1].apply(null);
              }
            });
          }
          return nativeMethod.apply(this, arguments);
        };
      });
      return RTCPeerConnection;
    };
  }, {"sdp":17}], 17:[function(require, module, exports) {
    var SDPUtils = {};
    SDPUtils.generateIdentifier = function() {
      return Math.random().toString(36).substr(2, 10);
    };
    SDPUtils.localCName = SDPUtils.generateIdentifier();
    SDPUtils.splitLines = function(blob) {
      return blob.trim().split("\n").map(function(line) {
        return line.trim();
      });
    };
    SDPUtils.splitSections = function(blob) {
      var parts = blob.split("\nm=");
      return parts.map(function(part, index) {
        return (index > 0 ? "m=" + part : part).trim() + "\r\n";
      });
    };
    SDPUtils.getDescription = function(blob) {
      var sections = SDPUtils.splitSections(blob);
      return sections && sections[0];
    };
    SDPUtils.getMediaSections = function(blob) {
      var sections = SDPUtils.splitSections(blob);
      sections.shift();
      return sections;
    };
    SDPUtils.matchPrefix = function(blob, prefix) {
      return SDPUtils.splitLines(blob).filter(function(line) {
        return line.indexOf(prefix) === 0;
      });
    };
    SDPUtils.parseCandidate = function(line) {
      var parts;
      if (line.indexOf("a=candidate:") === 0) {
        parts = line.substring(12).split(" ");
      } else {
        parts = line.substring(10).split(" ");
      }
      var candidate = {foundation:parts[0], component:parseInt(parts[1], 10), protocol:parts[2].toLowerCase(), priority:parseInt(parts[3], 10), ip:parts[4], address:parts[4], port:parseInt(parts[5], 10), type:parts[7]};
      for (var i = 8; i < parts.length; i += 2) {
        switch(parts[i]) {
          case "raddr":
            candidate.relatedAddress = parts[i + 1];
            break;
          case "rport":
            candidate.relatedPort = parseInt(parts[i + 1], 10);
            break;
          case "tcptype":
            candidate.tcpType = parts[i + 1];
            break;
          case "ufrag":
            candidate.ufrag = parts[i + 1];
            candidate.usernameFragment = parts[i + 1];
            break;
          default:
            candidate[parts[i]] = parts[i + 1];
            break;
        }
      }
      return candidate;
    };
    SDPUtils.writeCandidate = function(candidate) {
      var sdp = [];
      sdp.push(candidate.foundation);
      sdp.push(candidate.component);
      sdp.push(candidate.protocol.toUpperCase());
      sdp.push(candidate.priority);
      sdp.push(candidate.address || candidate.ip);
      sdp.push(candidate.port);
      var type = candidate.type;
      sdp.push("typ");
      sdp.push(type);
      if (type !== "host" && candidate.relatedAddress && candidate.relatedPort) {
        sdp.push("raddr");
        sdp.push(candidate.relatedAddress);
        sdp.push("rport");
        sdp.push(candidate.relatedPort);
      }
      if (candidate.tcpType && candidate.protocol.toLowerCase() === "tcp") {
        sdp.push("tcptype");
        sdp.push(candidate.tcpType);
      }
      if (candidate.usernameFragment || candidate.ufrag) {
        sdp.push("ufrag");
        sdp.push(candidate.usernameFragment || candidate.ufrag);
      }
      return "candidate:" + sdp.join(" ");
    };
    SDPUtils.parseIceOptions = function(line) {
      return line.substr(14).split(" ");
    };
    SDPUtils.parseRtpMap = function(line) {
      var parts = line.substr(9).split(" ");
      var parsed = {payloadType:parseInt(parts.shift(), 10)};
      parts = parts[0].split("/");
      parsed.name = parts[0];
      parsed.clockRate = parseInt(parts[1], 10);
      parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
      parsed.numChannels = parsed.channels;
      return parsed;
    };
    SDPUtils.writeRtpMap = function(codec) {
      var pt = codec.payloadType;
      if (codec.preferredPayloadType !== undefined) {
        pt = codec.preferredPayloadType;
      }
      var channels = codec.channels || codec.numChannels || 1;
      return "a=rtpmap:" + pt + " " + codec.name + "/" + codec.clockRate + (channels !== 1 ? "/" + channels : "") + "\r\n";
    };
    SDPUtils.parseExtmap = function(line) {
      var parts = line.substr(9).split(" ");
      return {id:parseInt(parts[0], 10), direction:parts[0].indexOf("/") > 0 ? parts[0].split("/")[1] : "sendrecv", uri:parts[1]};
    };
    SDPUtils.writeExtmap = function(headerExtension) {
      return "a=extmap:" + (headerExtension.id || headerExtension.preferredId) + (headerExtension.direction && headerExtension.direction !== "sendrecv" ? "/" + headerExtension.direction : "") + " " + headerExtension.uri + "\r\n";
    };
    SDPUtils.parseFmtp = function(line) {
      var parsed = {};
      var kv;
      var parts = line.substr(line.indexOf(" ") + 1).split(";");
      for (var j = 0; j < parts.length; j++) {
        kv = parts[j].trim().split("=");
        parsed[kv[0].trim()] = kv[1];
      }
      return parsed;
    };
    SDPUtils.writeFmtp = function(codec) {
      var line = "";
      var pt = codec.payloadType;
      if (codec.preferredPayloadType !== undefined) {
        pt = codec.preferredPayloadType;
      }
      if (codec.parameters && Object.keys(codec.parameters).length) {
        var params = [];
        Object.keys(codec.parameters).forEach(function(param) {
          if (codec.parameters[param]) {
            params.push(param + "=" + codec.parameters[param]);
          } else {
            params.push(param);
          }
        });
        line += "a=fmtp:" + pt + " " + params.join(";") + "\r\n";
      }
      return line;
    };
    SDPUtils.parseRtcpFb = function(line) {
      var parts = line.substr(line.indexOf(" ") + 1).split(" ");
      return {type:parts.shift(), parameter:parts.join(" ")};
    };
    SDPUtils.writeRtcpFb = function(codec) {
      var lines = "";
      var pt = codec.payloadType;
      if (codec.preferredPayloadType !== undefined) {
        pt = codec.preferredPayloadType;
      }
      if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
        codec.rtcpFeedback.forEach(function(fb) {
          lines += "a=rtcp-fb:" + pt + " " + fb.type + (fb.parameter && fb.parameter.length ? " " + fb.parameter : "") + "\r\n";
        });
      }
      return lines;
    };
    SDPUtils.parseSsrcMedia = function(line) {
      var sp = line.indexOf(" ");
      var parts = {ssrc:parseInt(line.substr(7, sp - 7), 10)};
      var colon = line.indexOf(":", sp);
      if (colon > -1) {
        parts.attribute = line.substr(sp + 1, colon - sp - 1);
        parts.value = line.substr(colon + 1);
      } else {
        parts.attribute = line.substr(sp + 1);
      }
      return parts;
    };
    SDPUtils.parseSsrcGroup = function(line) {
      var parts = line.substr(13).split(" ");
      return {semantics:parts.shift(), ssrcs:parts.map(function(ssrc) {
        return parseInt(ssrc, 10);
      })};
    };
    SDPUtils.getMid = function(mediaSection) {
      var mid = SDPUtils.matchPrefix(mediaSection, "a=mid:")[0];
      if (mid) {
        return mid.substr(6);
      }
    };
    SDPUtils.parseFingerprint = function(line) {
      var parts = line.substr(14).split(" ");
      return {algorithm:parts[0].toLowerCase(), value:parts[1]};
    };
    SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
      var lines = SDPUtils.matchPrefix(mediaSection + sessionpart, "a=fingerprint:");
      return {role:"auto", fingerprints:lines.map(SDPUtils.parseFingerprint)};
    };
    SDPUtils.writeDtlsParameters = function(params, setupType) {
      var sdp = "a=setup:" + setupType + "\r\n";
      params.fingerprints.forEach(function(fp) {
        sdp += "a=fingerprint:" + fp.algorithm + " " + fp.value + "\r\n";
      });
      return sdp;
    };
    SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
      var lines = SDPUtils.splitLines(mediaSection);
      lines = lines.concat(SDPUtils.splitLines(sessionpart));
      var iceParameters = {usernameFragment:lines.filter(function(line) {
        return line.indexOf("a=ice-ufrag:") === 0;
      })[0].substr(12), password:lines.filter(function(line) {
        return line.indexOf("a=ice-pwd:") === 0;
      })[0].substr(10)};
      return iceParameters;
    };
    SDPUtils.writeIceParameters = function(params) {
      return "a=ice-ufrag:" + params.usernameFragment + "\r\n" + "a=ice-pwd:" + params.password + "\r\n";
    };
    SDPUtils.parseRtpParameters = function(mediaSection) {
      var description = {codecs:[], headerExtensions:[], fecMechanisms:[], rtcp:[]};
      var lines = SDPUtils.splitLines(mediaSection);
      var mline = lines[0].split(" ");
      for (var i = 3; i < mline.length; i++) {
        var pt = mline[i];
        var rtpmapline = SDPUtils.matchPrefix(mediaSection, "a=rtpmap:" + pt + " ")[0];
        if (rtpmapline) {
          var codec = SDPUtils.parseRtpMap(rtpmapline);
          var fmtps = SDPUtils.matchPrefix(mediaSection, "a=fmtp:" + pt + " ");
          codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
          codec.rtcpFeedback = SDPUtils.matchPrefix(mediaSection, "a=rtcp-fb:" + pt + " ").map(SDPUtils.parseRtcpFb);
          description.codecs.push(codec);
          switch(codec.name.toUpperCase()) {
            case "RED":
            case "ULPFEC":
              description.fecMechanisms.push(codec.name.toUpperCase());
              break;
            default:
              break;
          }
        }
      }
      SDPUtils.matchPrefix(mediaSection, "a=extmap:").forEach(function(line) {
        description.headerExtensions.push(SDPUtils.parseExtmap(line));
      });
      return description;
    };
    SDPUtils.writeRtpDescription = function(kind, caps) {
      var sdp = "";
      sdp += "m=" + kind + " ";
      sdp += caps.codecs.length > 0 ? "9" : "0";
      sdp += " UDP/TLS/RTP/SAVPF ";
      sdp += caps.codecs.map(function(codec) {
        if (codec.preferredPayloadType !== undefined) {
          return codec.preferredPayloadType;
        }
        return codec.payloadType;
      }).join(" ") + "\r\n";
      sdp += "c=IN IP4 0.0.0.0\r\n";
      sdp += "a=rtcp:9 IN IP4 0.0.0.0\r\n";
      caps.codecs.forEach(function(codec) {
        sdp += SDPUtils.writeRtpMap(codec);
        sdp += SDPUtils.writeFmtp(codec);
        sdp += SDPUtils.writeRtcpFb(codec);
      });
      var maxptime = 0;
      caps.codecs.forEach(function(codec) {
        if (codec.maxptime > maxptime) {
          maxptime = codec.maxptime;
        }
      });
      if (maxptime > 0) {
        sdp += "a=maxptime:" + maxptime + "\r\n";
      }
      sdp += "a=rtcp-mux\r\n";
      if (caps.headerExtensions) {
        caps.headerExtensions.forEach(function(extension) {
          sdp += SDPUtils.writeExtmap(extension);
        });
      }
      return sdp;
    };
    SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
      var encodingParameters = [];
      var description = SDPUtils.parseRtpParameters(mediaSection);
      var hasRed = description.fecMechanisms.indexOf("RED") !== -1;
      var hasUlpfec = description.fecMechanisms.indexOf("ULPFEC") !== -1;
      var ssrcs = SDPUtils.matchPrefix(mediaSection, "a=ssrc:").map(function(line) {
        return SDPUtils.parseSsrcMedia(line);
      }).filter(function(parts) {
        return parts.attribute === "cname";
      });
      var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
      var secondarySsrc;
      var flows = SDPUtils.matchPrefix(mediaSection, "a=ssrc-group:FID").map(function(line) {
        var parts = line.substr(17).split(" ");
        return parts.map(function(part) {
          return parseInt(part, 10);
        });
      });
      if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
        secondarySsrc = flows[0][1];
      }
      description.codecs.forEach(function(codec) {
        if (codec.name.toUpperCase() === "RTX" && codec.parameters.apt) {
          var encParam = {ssrc:primarySsrc, codecPayloadType:parseInt(codec.parameters.apt, 10)};
          if (primarySsrc && secondarySsrc) {
            encParam.rtx = {ssrc:secondarySsrc};
          }
          encodingParameters.push(encParam);
          if (hasRed) {
            encParam = JSON.parse(JSON.stringify(encParam));
            encParam.fec = {ssrc:primarySsrc, mechanism:hasUlpfec ? "red+ulpfec" : "red"};
            encodingParameters.push(encParam);
          }
        }
      });
      if (encodingParameters.length === 0 && primarySsrc) {
        encodingParameters.push({ssrc:primarySsrc});
      }
      var bandwidth = SDPUtils.matchPrefix(mediaSection, "b=");
      if (bandwidth.length) {
        if (bandwidth[0].indexOf("b=TIAS:") === 0) {
          bandwidth = parseInt(bandwidth[0].substr(7), 10);
        } else {
          if (bandwidth[0].indexOf("b=AS:") === 0) {
            bandwidth = parseInt(bandwidth[0].substr(5), 10) * 1000 * 0.95 - 50 * 40 * 8;
          } else {
            bandwidth = undefined;
          }
        }
        encodingParameters.forEach(function(params) {
          params.maxBitrate = bandwidth;
        });
      }
      return encodingParameters;
    };
    SDPUtils.parseRtcpParameters = function(mediaSection) {
      var rtcpParameters = {};
      var remoteSsrc = SDPUtils.matchPrefix(mediaSection, "a=ssrc:").map(function(line) {
        return SDPUtils.parseSsrcMedia(line);
      }).filter(function(obj) {
        return obj.attribute === "cname";
      })[0];
      if (remoteSsrc) {
        rtcpParameters.cname = remoteSsrc.value;
        rtcpParameters.ssrc = remoteSsrc.ssrc;
      }
      var rsize = SDPUtils.matchPrefix(mediaSection, "a=rtcp-rsize");
      rtcpParameters.reducedSize = rsize.length > 0;
      rtcpParameters.compound = rsize.length === 0;
      var mux = SDPUtils.matchPrefix(mediaSection, "a=rtcp-mux");
      rtcpParameters.mux = mux.length > 0;
      return rtcpParameters;
    };
    SDPUtils.parseMsid = function(mediaSection) {
      var parts;
      var spec = SDPUtils.matchPrefix(mediaSection, "a=msid:");
      if (spec.length === 1) {
        parts = spec[0].substr(7).split(" ");
        return {stream:parts[0], track:parts[1]};
      }
      var planB = SDPUtils.matchPrefix(mediaSection, "a=ssrc:").map(function(line) {
        return SDPUtils.parseSsrcMedia(line);
      }).filter(function(msidParts) {
        return msidParts.attribute === "msid";
      });
      if (planB.length > 0) {
        parts = planB[0].value.split(" ");
        return {stream:parts[0], track:parts[1]};
      }
    };
    SDPUtils.parseSctpDescription = function(mediaSection) {
      var mline = SDPUtils.parseMLine(mediaSection);
      var maxSizeLine = SDPUtils.matchPrefix(mediaSection, "a=max-message-size:");
      var maxMessageSize;
      if (maxSizeLine.length > 0) {
        maxMessageSize = parseInt(maxSizeLine[0].substr(19), 10);
      }
      if (isNaN(maxMessageSize)) {
        maxMessageSize = 65536;
      }
      var sctpPort = SDPUtils.matchPrefix(mediaSection, "a=sctp-port:");
      if (sctpPort.length > 0) {
        return {port:parseInt(sctpPort[0].substr(12), 10), protocol:mline.fmt, maxMessageSize:maxMessageSize};
      }
      var sctpMapLines = SDPUtils.matchPrefix(mediaSection, "a=sctpmap:");
      if (sctpMapLines.length > 0) {
        var parts = SDPUtils.matchPrefix(mediaSection, "a=sctpmap:")[0].substr(10).split(" ");
        return {port:parseInt(parts[0], 10), protocol:parts[1], maxMessageSize:maxMessageSize};
      }
    };
    SDPUtils.writeSctpDescription = function(media, sctp) {
      var output = [];
      if (media.protocol !== "DTLS/SCTP") {
        output = ["m=" + media.kind + " 9 " + media.protocol + " " + sctp.protocol + "\r\n", "c=IN IP4 0.0.0.0\r\n", "a=sctp-port:" + sctp.port + "\r\n"];
      } else {
        output = ["m=" + media.kind + " 9 " + media.protocol + " " + sctp.port + "\r\n", "c=IN IP4 0.0.0.0\r\n", "a=sctpmap:" + sctp.port + " " + sctp.protocol + " 65535\r\n"];
      }
      if (sctp.maxMessageSize !== undefined) {
        output.push("a=max-message-size:" + sctp.maxMessageSize + "\r\n");
      }
      return output.join("");
    };
    SDPUtils.generateSessionId = function() {
      return Math.random().toString().substr(2, 21);
    };
    SDPUtils.writeSessionBoilerplate = function(sessId, sessVer, sessUser) {
      var sessionId;
      var version = sessVer !== undefined ? sessVer : 2;
      if (sessId) {
        sessionId = sessId;
      } else {
        sessionId = SDPUtils.generateSessionId();
      }
      var user = sessUser || "thisisadapterortc";
      return "v=0\r\n" + "o=" + user + " " + sessionId + " " + version + " IN IP4 127.0.0.1\r\n" + "s=-\r\n" + "t=0 0\r\n";
    };
    SDPUtils.writeMediaSection = function(transceiver, caps, type, stream) {
      var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);
      sdp += SDPUtils.writeIceParameters(transceiver.iceGatherer.getLocalParameters());
      sdp += SDPUtils.writeDtlsParameters(transceiver.dtlsTransport.getLocalParameters(), type === "offer" ? "actpass" : "active");
      sdp += "a=mid:" + transceiver.mid + "\r\n";
      if (transceiver.direction) {
        sdp += "a=" + transceiver.direction + "\r\n";
      } else {
        if (transceiver.rtpSender && transceiver.rtpReceiver) {
          sdp += "a=sendrecv\r\n";
        } else {
          if (transceiver.rtpSender) {
            sdp += "a=sendonly\r\n";
          } else {
            if (transceiver.rtpReceiver) {
              sdp += "a=recvonly\r\n";
            } else {
              sdp += "a=inactive\r\n";
            }
          }
        }
      }
      if (transceiver.rtpSender) {
        var msid = "msid:" + stream.id + " " + transceiver.rtpSender.track.id + "\r\n";
        sdp += "a=" + msid;
        sdp += "a=ssrc:" + transceiver.sendEncodingParameters[0].ssrc + " " + msid;
        if (transceiver.sendEncodingParameters[0].rtx) {
          sdp += "a=ssrc:" + transceiver.sendEncodingParameters[0].rtx.ssrc + " " + msid;
          sdp += "a=ssrc-group:FID " + transceiver.sendEncodingParameters[0].ssrc + " " + transceiver.sendEncodingParameters[0].rtx.ssrc + "\r\n";
        }
      }
      sdp += "a=ssrc:" + transceiver.sendEncodingParameters[0].ssrc + " cname:" + SDPUtils.localCName + "\r\n";
      if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
        sdp += "a=ssrc:" + transceiver.sendEncodingParameters[0].rtx.ssrc + " cname:" + SDPUtils.localCName + "\r\n";
      }
      return sdp;
    };
    SDPUtils.getDirection = function(mediaSection, sessionpart) {
      var lines = SDPUtils.splitLines(mediaSection);
      for (var i = 0; i < lines.length; i++) {
        switch(lines[i]) {
          case "a=sendrecv":
          case "a=sendonly":
          case "a=recvonly":
          case "a=inactive":
            return lines[i].substr(2);
          default:
        }
      }
      if (sessionpart) {
        return SDPUtils.getDirection(sessionpart);
      }
      return "sendrecv";
    };
    SDPUtils.getKind = function(mediaSection) {
      var lines = SDPUtils.splitLines(mediaSection);
      var mline = lines[0].split(" ");
      return mline[0].substr(2);
    };
    SDPUtils.isRejected = function(mediaSection) {
      return mediaSection.split(" ", 2)[1] === "0";
    };
    SDPUtils.parseMLine = function(mediaSection) {
      var lines = SDPUtils.splitLines(mediaSection);
      var parts = lines[0].substr(2).split(" ");
      return {kind:parts[0], port:parseInt(parts[1], 10), protocol:parts[2], fmt:parts.slice(3).join(" ")};
    };
    SDPUtils.parseOLine = function(mediaSection) {
      var line = SDPUtils.matchPrefix(mediaSection, "o=")[0];
      var parts = line.substr(2).split(" ");
      return {username:parts[0], sessionId:parts[1], sessionVersion:parseInt(parts[2], 10), netType:parts[3], addressType:parts[4], address:parts[5]};
    };
    SDPUtils.isValidSDP = function(blob) {
      if (typeof blob !== "string" || blob.length === 0) {
        return false;
      }
      var lines = SDPUtils.splitLines(blob);
      for (var i = 0; i < lines.length; i++) {
        if (lines[i].length < 2 || lines[i].charAt(1) !== "=") {
          return false;
        }
      }
      return true;
    };
    if (typeof module === "object") {
      module.exports = SDPUtils;
    }
  }, {}]}, {}, [1])(1);
});
var Analytics = function(roomServer) {
  this.analyticsPath_ = roomServer + "/a/";
};
Analytics.EventObject_ = {};
Analytics.prototype.reportEvent = function(eventType, roomId, flowId) {
  var eventObj = {};
  eventObj[enums.RequestField.EventField.EVENT_TYPE] = eventType;
  eventObj[enums.RequestField.EventField.EVENT_TIME_MS] = Date.now();
  if (roomId) {
    eventObj[enums.RequestField.EventField.ROOM_ID] = roomId;
  }
  if (flowId) {
    eventObj[enums.RequestField.EventField.FLOW_ID] = flowId;
  }
  this.sendEventRequest_(eventObj);
};
Analytics.prototype.sendEventRequest_ = function(eventObj) {
  var request = {};
  request[enums.RequestField.TYPE] = enums.RequestField.MessageType.EVENT;
  request[enums.RequestField.REQUEST_TIME_MS] = Date.now();
  request[enums.RequestField.EVENT] = eventObj;
  sendAsyncUrlRequest("POST", this.analyticsPath_, JSON.stringify(request)).then(function() {
  }.bind(this), function(error) {
    trace("Failed to send event request: " + error.message);
  }.bind(this));
};
var enums = {"EventType":{"ICE_CONNECTION_STATE_CONNECTED":3, "ROOM_SIZE_2":2}, "RequestField":{"MessageType":{"EVENT":"event"}, "CLIENT_TYPE":"client_type", "EventField":{"EVENT_TIME_MS":"event_time_ms", "ROOM_ID":"room_id", "EVENT_TYPE":"event_type", "FLOW_ID":"flow_id"}, "TYPE":"type", "EVENT":"event", "REQUEST_TIME_MS":"request_time_ms"}, "ClientType":{"UNKNOWN":0, "ANDROID":4, "DESKTOP":2, "IOS":3, "JS":1}};
var remoteVideo = $("#remote-video");
var UI_CONSTANTS = {confirmJoinButton:"#confirm-join-button", confirmJoinDiv:"#confirm-join-div", confirmJoinRoomSpan:"#confirm-join-room-span", fullscreenSvg:"#fullscreen", hangupSvg:"#hangup", icons:"#icons", infoDiv:"#info-div", localVideo:"#local-video", miniVideo:"#mini-video", muteAudioSvg:"#mute-audio", muteVideoSvg:"#mute-video", newRoomButton:"#new-room-button", newRoomLink:"#new-room-link", privacyLinks:"#privacy", remoteVideo:"#remote-video", rejoinButton:"#rejoin-button", rejoinDiv:"#rejoin-div", 
rejoinLink:"#rejoin-link", roomLinkHref:"#room-link-href", roomSelectionDiv:"#room-selection", roomSelectionInput:"#room-id-input", roomSelectionInputLabel:"#room-id-input-label", roomSelectionJoinButton:"#join-button", roomSelectionRandomButton:"#random-button", roomSelectionRecentList:"#recent-rooms-list", sharingDiv:"#sharing-div", statusDiv:"#status-div", videosDiv:"#videos"};
var AppController = function(loadingParams) {
  trace("Initializing; server= " + loadingParams.roomServer + ".");
  trace("Initializing; room=" + loadingParams.roomId + ".");
  this.hangupSvg_ = $(UI_CONSTANTS.hangupSvg);
  this.icons_ = $(UI_CONSTANTS.icons);
  this.localVideo_ = $(UI_CONSTANTS.localVideo);
  this.miniVideo_ = $(UI_CONSTANTS.miniVideo);
  this.sharingDiv_ = $(UI_CONSTANTS.sharingDiv);
  this.statusDiv_ = $(UI_CONSTANTS.statusDiv);
  this.remoteVideo_ = $(UI_CONSTANTS.remoteVideo);
  this.videosDiv_ = $(UI_CONSTANTS.videosDiv);
  this.roomLinkHref_ = $(UI_CONSTANTS.roomLinkHref);
  this.rejoinDiv_ = $(UI_CONSTANTS.rejoinDiv);
  this.rejoinLink_ = $(UI_CONSTANTS.rejoinLink);
  this.newRoomLink_ = $(UI_CONSTANTS.newRoomLink);
  this.rejoinButton_ = $(UI_CONSTANTS.rejoinButton);
  this.newRoomButton_ = $(UI_CONSTANTS.newRoomButton);
  this.newRoomButton_.addEventListener("click", this.onNewRoomClick_.bind(this), false);
  this.rejoinButton_.addEventListener("click", this.onRejoinClick_.bind(this), false);
  this.muteAudioIconSet_ = new AppController.IconSet_(UI_CONSTANTS.muteAudioSvg);
  this.muteVideoIconSet_ = new AppController.IconSet_(UI_CONSTANTS.muteVideoSvg);
  this.fullscreenIconSet_ = new AppController.IconSet_(UI_CONSTANTS.fullscreenSvg);
  this.loadingParams_ = loadingParams;
  this.loadUrlParams_();
  var paramsPromise = Promise.resolve({});
  if (this.loadingParams_.paramsFunction) {
    paramsPromise = this.loadingParams_.paramsFunction();
  }
  Promise.resolve(paramsPromise).then(function(newParams) {
    if (newParams) {
      Object.keys(newParams).forEach(function(key) {
        this.loadingParams_[key] = newParams[key];
      }.bind(this));
    }
    this.roomLink_ = "";
    this.roomSelection_ = null;
    this.localStream_ = null;
    this.remoteVideoResetTimer_ = null;
    if (this.loadingParams_.roomId) {
      this.createCall_();
      if (!RoomSelection.matchRandomRoomPattern(this.loadingParams_.roomId)) {
        $(UI_CONSTANTS.confirmJoinRoomSpan).textContent = ' "' + this.loadingParams_.roomId + '"';
      }
      var confirmJoinDiv = $(UI_CONSTANTS.confirmJoinDiv);
      this.show_(confirmJoinDiv);
      $(UI_CONSTANTS.confirmJoinButton).onclick = function() {
        this.hide_(confirmJoinDiv);
        var recentlyUsedList = new RoomSelection.RecentlyUsedList;
        recentlyUsedList.pushRecentRoom(this.loadingParams_.roomId);
        this.finishCallSetup_(this.loadingParams_.roomId);
      }.bind(this);
      if (this.loadingParams_.bypassJoinConfirmation) {
        $(UI_CONSTANTS.confirmJoinButton).onclick();
      }
    } else {
      this.showRoomSelection_();
    }
  }.bind(this)).catch(function(error) {
    trace("Error initializing: " + error.message);
  }.bind(this));
};
AppController.prototype.createCall_ = function() {
  var privacyLinks = $(UI_CONSTANTS.privacyLinks);
  this.hide_(privacyLinks);
  this.call_ = new Call(this.loadingParams_);
  this.infoBox_ = new InfoBox($(UI_CONSTANTS.infoDiv), this.call_, this.loadingParams_.versionInfo);
  var roomErrors = this.loadingParams_.errorMessages;
  var roomWarnings = this.loadingParams_.warningMessages;
  if (roomErrors && roomErrors.length > 0) {
    for (var i = 0; i < roomErrors.length; ++i) {
      this.infoBox_.pushErrorMessage(roomErrors[i]);
    }
    return;
  } else {
    if (roomWarnings && roomWarnings.length > 0) {
      for (var j = 0; j < roomWarnings.length; ++j) {
        this.infoBox_.pushWarningMessage(roomWarnings[j]);
      }
    }
  }
  this.call_.onremotehangup = this.onRemoteHangup_.bind(this);
  this.call_.onremotesdpset = this.onRemoteSdpSet_.bind(this);
  this.call_.onremotestreamadded = this.onRemoteStreamAdded_.bind(this);
  this.call_.onlocalstreamadded = this.onLocalStreamAdded_.bind(this);
  this.call_.onsignalingstatechange = this.infoBox_.updateInfoDiv.bind(this.infoBox_);
  this.call_.oniceconnectionstatechange = this.infoBox_.updateInfoDiv.bind(this.infoBox_);
  this.call_.onnewicecandidate = this.infoBox_.recordIceCandidateTypes.bind(this.infoBox_);
  this.call_.onerror = this.displayError_.bind(this);
  this.call_.onstatusmessage = this.displayStatus_.bind(this);
  this.call_.oncallerstarted = this.displaySharingInfo_.bind(this);
};
AppController.prototype.showRoomSelection_ = function() {
  var roomSelectionDiv = $(UI_CONSTANTS.roomSelectionDiv);
  this.roomSelection_ = new RoomSelection(roomSelectionDiv, UI_CONSTANTS);
  this.show_(roomSelectionDiv);
  this.roomSelection_.onRoomSelected = function(roomName) {
    this.hide_(roomSelectionDiv);
    this.createCall_();
    this.finishCallSetup_(roomName);
    this.roomSelection_.removeEventListeners();
    this.roomSelection_ = null;
    if (this.localStream_) {
      this.attachLocalStream_();
    }
  }.bind(this);
};
AppController.prototype.setupUi_ = function() {
  this.iconEventSetup_();
  document.onkeypress = this.onKeyPress_.bind(this);
  window.onmousemove = this.showIcons_.bind(this);
  $(UI_CONSTANTS.muteAudioSvg).onclick = this.toggleAudioMute_.bind(this);
  $(UI_CONSTANTS.muteVideoSvg).onclick = this.toggleVideoMute_.bind(this);
  $(UI_CONSTANTS.fullscreenSvg).onclick = this.toggleFullScreen_.bind(this);
  $(UI_CONSTANTS.hangupSvg).onclick = this.hangup_.bind(this);
  setUpFullScreen();
};
AppController.prototype.finishCallSetup_ = function(roomId) {
  this.call_.start(roomId);
  this.setupUi_();
  if (!isChromeApp()) {
    window.onbeforeunload = function() {
      this.call_.hangup(false);
    }.bind(this);
    window.onpopstate = function(event) {
      if (!event.state) {
        trace("Reloading main page.");
        location.href = location.origin;
      } else {
        if (event.state.roomLink) {
          location.href = event.state.roomLink;
        }
      }
    };
  }
};
AppController.prototype.hangup_ = function() {
  trace("Hanging up.");
  this.hide_(this.icons_);
  this.displayStatus_("Hanging up");
  this.transitionToDone_();
  this.call_.hangup(true);
  document.onkeypress = null;
  window.onmousemove = null;
};
AppController.prototype.onRemoteHangup_ = function() {
  this.displayStatus_("The remote side hung up.");
  this.transitionToWaiting_();
  this.call_.onRemoteHangup();
};
AppController.prototype.onRemoteSdpSet_ = function(hasRemoteVideo) {
  if (hasRemoteVideo) {
    trace("Waiting for remote video.");
    this.waitForRemoteVideo_();
  } else {
    trace("No remote video stream; not waiting for media to arrive.");
    this.transitionToActive_();
  }
};
AppController.prototype.waitForRemoteVideo_ = function() {
  if (this.remoteVideo_.readyState >= 2) {
    trace("Remote video started; currentTime: " + this.remoteVideo_.currentTime);
    this.transitionToActive_();
  } else {
    this.remoteVideo_.oncanplay = this.waitForRemoteVideo_.bind(this);
  }
};
AppController.prototype.onRemoteStreamAdded_ = function(stream) {
  this.deactivate_(this.sharingDiv_);
  trace("Remote stream added.");
  this.remoteVideo_.srcObject = stream;
  this.infoBox_.getRemoteTrackIds(stream);
  if (this.remoteVideoResetTimer_) {
    clearTimeout(this.remoteVideoResetTimer_);
    this.remoteVideoResetTimer_ = null;
  }
};
AppController.prototype.onLocalStreamAdded_ = function(stream) {
  trace("User has granted access to local media.");
  this.localStream_ = stream;
  this.infoBox_.getLocalTrackIds(this.localStream_);
  if (!this.roomSelection_) {
    this.attachLocalStream_();
  }
};
AppController.prototype.attachLocalStream_ = function() {
  trace("Attaching local stream.");
  this.localVideo_.srcObject = this.localStream_;
  this.displayStatus_("");
  this.activate_(this.localVideo_);
  this.show_(this.icons_);
  if (this.localStream_.getVideoTracks().length === 0) {
    this.hide_($(UI_CONSTANTS.muteVideoSvg));
  }
  if (this.localStream_.getAudioTracks().length === 0) {
    this.hide_($(UI_CONSTANTS.muteAudioSvg));
  }
};
AppController.prototype.transitionToActive_ = function() {
  this.remoteVideo_.oncanplay = undefined;
  var connectTime = window.performance.now();
  this.infoBox_.setSetupTimes(this.call_.startTime, connectTime);
  this.infoBox_.updateInfoDiv();
  trace("Call setup time: " + (connectTime - this.call_.startTime).toFixed(0) + "ms.");
  trace("reattachMediaStream: " + this.localVideo_.srcObject);
  this.miniVideo_.srcObject = this.localVideo_.srcObject;
  this.activate_(this.remoteVideo_);
  this.activate_(this.miniVideo_);
  this.deactivate_(this.localVideo_);
  this.localVideo_.srcObject = null;
  this.activate_(this.videosDiv_);
  this.show_(this.hangupSvg_);
  this.displayStatus_("");
};
AppController.prototype.transitionToWaiting_ = function() {
  this.remoteVideo_.oncanplay = undefined;
  this.hide_(this.hangupSvg_);
  this.deactivate_(this.videosDiv_);
  if (!this.remoteVideoResetTimer_) {
    this.remoteVideoResetTimer_ = setTimeout(function() {
      this.remoteVideoResetTimer_ = null;
      trace("Resetting remoteVideo src after transitioning to waiting.");
      this.remoteVideo_.srcObject = null;
    }.bind(this), 800);
  }
  this.localVideo_.srcObject = this.miniVideo_.srcObject;
  this.activate_(this.localVideo_);
  this.deactivate_(this.remoteVideo_);
  this.deactivate_(this.miniVideo_);
};
AppController.prototype.transitionToDone_ = function() {
  this.remoteVideo_.oncanplay = undefined;
  this.deactivate_(this.localVideo_);
  this.deactivate_(this.remoteVideo_);
  this.deactivate_(this.miniVideo_);
  this.hide_(this.hangupSvg_);
  this.activate_(this.rejoinDiv_);
  this.show_(this.rejoinDiv_);
  this.displayStatus_("");
};
AppController.prototype.onRejoinClick_ = function() {
  this.deactivate_(this.rejoinDiv_);
  this.hide_(this.rejoinDiv_);
  this.call_.restart();
  this.setupUi_();
};
AppController.prototype.onNewRoomClick_ = function() {
  this.deactivate_(this.rejoinDiv_);
  this.hide_(this.rejoinDiv_);
  this.showRoomSelection_();
};
AppController.prototype.onKeyPress_ = function(event) {
  switch(String.fromCharCode(event.charCode)) {
    case " ":
    case "m":
      if (this.call_) {
        this.call_.toggleAudioMute();
        this.muteAudioIconSet_.toggle();
      }
      return false;
    case "c":
      if (this.call_) {
        this.call_.toggleVideoMute();
        this.muteVideoIconSet_.toggle();
      }
      return false;
    case "f":
      this.toggleFullScreen_();
      return false;
    case "i":
      this.infoBox_.toggleInfoDiv();
      return false;
    case "q":
      this.hangup_();
      return false;
    case "l":
      this.toggleMiniVideo_();
      return false;
    default:
      return;
  }
};
AppController.prototype.pushCallNavigation_ = function(roomId, roomLink) {
  if (!isChromeApp()) {
    window.history.pushState({"roomId":roomId, "roomLink":roomLink}, roomId, roomLink);
  }
};
AppController.prototype.displaySharingInfo_ = function(roomId, roomLink) {
  this.roomLinkHref_.href = roomLink;
  this.roomLinkHref_.text = roomLink;
  this.roomLink_ = roomLink;
  this.pushCallNavigation_(roomId, roomLink);
  this.activate_(this.sharingDiv_);
};
AppController.prototype.displayStatus_ = function(status) {
  if (status === "") {
    this.deactivate_(this.statusDiv_);
  } else {
    this.activate_(this.statusDiv_);
  }
  this.statusDiv_.innerHTML = status;
};
AppController.prototype.displayError_ = function(error) {
  trace(error);
  this.infoBox_.pushErrorMessage(error);
};
AppController.prototype.toggleAudioMute_ = function() {
  this.call_.toggleAudioMute();
  this.muteAudioIconSet_.toggle();
};
AppController.prototype.toggleVideoMute_ = function() {
  this.call_.toggleVideoMute();
  this.muteVideoIconSet_.toggle();
};
AppController.prototype.toggleFullScreen_ = function() {
  if (isFullScreen()) {
    trace("Exiting fullscreen.");
    document.querySelector("svg#fullscreen title").textContent = "Enter fullscreen";
    document.cancelFullScreen();
  } else {
    trace("Entering fullscreen.");
    document.querySelector("svg#fullscreen title").textContent = "Exit fullscreen";
    document.body.requestFullScreen();
  }
  this.fullscreenIconSet_.toggle();
};
AppController.prototype.toggleMiniVideo_ = function() {
  if (this.miniVideo_.classList.contains("active")) {
    this.deactivate_(this.miniVideo_);
  } else {
    this.activate_(this.miniVideo_);
  }
};
AppController.prototype.hide_ = function(element) {
  element.classList.add("hidden");
};
AppController.prototype.show_ = function(element) {
  element.classList.remove("hidden");
};
AppController.prototype.activate_ = function(element) {
  element.classList.add("active");
};
AppController.prototype.deactivate_ = function(element) {
  element.classList.remove("active");
};
AppController.prototype.showIcons_ = function() {
  if (!this.icons_.classList.contains("active")) {
    this.activate_(this.icons_);
    this.setIconTimeout_();
  }
};
AppController.prototype.hideIcons_ = function() {
  if (this.icons_.classList.contains("active")) {
    this.deactivate_(this.icons_);
  }
};
AppController.prototype.setIconTimeout_ = function() {
  if (this.hideIconsAfterTimeout) {
    window.clearTimeout.bind(this, this.hideIconsAfterTimeout);
  }
  this.hideIconsAfterTimeout = window.setTimeout(function() {
    this.hideIcons_();
  }.bind(this), 5000);
};
AppController.prototype.iconEventSetup_ = function() {
  this.icons_.onmouseenter = function() {
    window.clearTimeout(this.hideIconsAfterTimeout);
  }.bind(this);
  this.icons_.onmouseleave = function() {
    this.setIconTimeout_();
  }.bind(this);
};
AppController.prototype.loadUrlParams_ = function() {
  var DEFAULT_VIDEO_CODEC = "VP9";
  var urlParams = queryStringToDictionary(window.location.search);
  this.loadingParams_.audioSendBitrate = urlParams["asbr"];
  this.loadingParams_.audioSendCodec = urlParams["asc"];
  this.loadingParams_.audioRecvBitrate = urlParams["arbr"];
  this.loadingParams_.audioRecvCodec = urlParams["arc"];
  this.loadingParams_.opusMaxPbr = urlParams["opusmaxpbr"];
  this.loadingParams_.opusFec = urlParams["opusfec"];
  this.loadingParams_.opusDtx = urlParams["opusdtx"];
  this.loadingParams_.opusStereo = urlParams["stereo"];
  this.loadingParams_.videoSendBitrate = urlParams["vsbr"];
  this.loadingParams_.videoSendInitialBitrate = urlParams["vsibr"];
  this.loadingParams_.videoSendCodec = urlParams["vsc"];
  this.loadingParams_.videoRecvBitrate = urlParams["vrbr"];
  this.loadingParams_.videoRecvCodec = urlParams["vrc"] || DEFAULT_VIDEO_CODEC;
  this.loadingParams_.videoFec = urlParams["videofec"];
};
AppController.IconSet_ = function(iconSelector) {
  this.iconElement = document.querySelector(iconSelector);
};
AppController.IconSet_.prototype.toggle = function() {
  if (this.iconElement.classList.contains("on")) {
    this.iconElement.classList.remove("on");
  } else {
    this.iconElement.classList.add("on");
  }
};
var Call = function(params) {
  this.params_ = params;
  this.roomServer_ = params.roomServer || "";
  this.channel_ = new SignalingChannel(params.wssUrl, params.wssPostUrl);
  this.channel_.onmessage = this.onRecvSignalingChannelMessage_.bind(this);
  this.pcClient_ = null;
  this.localStream_ = null;
  this.errorMessageQueue_ = [];
  this.startTime = null;
  this.oncallerstarted = null;
  this.onerror = null;
  this.oniceconnectionstatechange = null;
  this.onlocalstreamadded = null;
  this.onnewicecandidate = null;
  this.onremotehangup = null;
  this.onremotesdpset = null;
  this.onremotestreamadded = null;
  this.onsignalingstatechange = null;
  this.onstatusmessage = null;
  this.getMediaPromise_ = null;
  this.getIceServersPromise_ = null;
  this.requestMediaAndIceServers_();
};
Call.prototype.requestMediaAndIceServers_ = function() {
  this.getMediaPromise_ = this.maybeGetMedia_();
  this.getIceServersPromise_ = this.maybeGetIceServers_();
};
Call.prototype.isInitiator = function() {
  return this.params_.isInitiator;
};
Call.prototype.start = function(roomId) {
  this.connectToRoom_(roomId);
  if (this.params_.isLoopback) {
    setupLoopback(this.params_.wssUrl, roomId);
  }
};
Call.prototype.queueCleanupMessages_ = function() {
  apprtc.windowPort.sendMessage({action:Constants.QUEUEADD_ACTION, queueMessage:{action:Constants.XHR_ACTION, method:"POST", url:this.getLeaveUrl_(), body:null}});
  apprtc.windowPort.sendMessage({action:Constants.QUEUEADD_ACTION, queueMessage:{action:Constants.WS_ACTION, wsAction:Constants.WS_SEND_ACTION, data:JSON.stringify({cmd:"send", msg:JSON.stringify({type:"bye"})})}});
  apprtc.windowPort.sendMessage({action:Constants.QUEUEADD_ACTION, queueMessage:{action:Constants.XHR_ACTION, method:"DELETE", url:this.channel_.getWssPostUrl(), body:null}});
};
Call.prototype.clearCleanupQueue_ = function() {
  apprtc.windowPort.sendMessage({action:Constants.QUEUECLEAR_ACTION});
};
Call.prototype.restart = function() {
  this.requestMediaAndIceServers_();
  this.start(this.params_.previousRoomId);
};
Call.prototype.hangup = function(async) {
  this.startTime = null;
  if (isChromeApp()) {
    this.clearCleanupQueue_();
  }
  if (this.localStream_) {
    if (typeof this.localStream_.getTracks === "undefined") {
      this.localStream_.stop();
    } else {
      this.localStream_.getTracks().forEach(function(track) {
        track.stop();
      });
    }
    this.localStream_ = null;
  }
  if (!this.params_.roomId) {
    return;
  }
  if (this.pcClient_) {
    this.pcClient_.close();
    this.pcClient_ = null;
  }
  var steps = [];
  steps.push({step:function() {
    var path = this.getLeaveUrl_();
    return sendUrlRequest("POST", path, async);
  }.bind(this), errorString:"Error sending /leave:"});
  steps.push({step:function() {
    this.channel_.send(JSON.stringify({type:"bye"}));
  }.bind(this), errorString:"Error sending bye:"});
  steps.push({step:function() {
    return this.channel_.close(async);
  }.bind(this), errorString:"Error closing signaling channel:"});
  steps.push({step:function() {
    this.params_.previousRoomId = this.params_.roomId;
    this.params_.roomId = null;
    this.params_.clientId = null;
  }.bind(this), errorString:"Error setting params:"});
  if (async) {
    var errorHandler = function(errorString, error) {
      trace(errorString + " " + error.message);
    };
    var promise = Promise.resolve();
    for (var i = 0; i < steps.length; ++i) {
      promise = promise.then(steps[i].step).catch(errorHandler.bind(this, steps[i].errorString));
    }
    return promise;
  }
  var executeStep = function(executor, errorString) {
    try {
      executor();
    } catch (ex) {
      trace(errorString + " " + ex);
    }
  };
  for (var j = 0; j < steps.length; ++j) {
    executeStep(steps[j].step, steps[j].errorString);
  }
  if (this.params_.roomId !== null || this.params_.clientId !== null) {
    trace("ERROR: sync cleanup tasks did not complete successfully.");
  } else {
    trace("Cleanup completed.");
  }
  return Promise.resolve();
};
Call.prototype.getLeaveUrl_ = function() {
  return this.roomServer_ + "/leave/" + this.params_.roomId + "/" + this.params_.clientId;
};
Call.prototype.onRemoteHangup = function() {
  this.startTime = null;
  this.params_.isInitiator = true;
  if (this.pcClient_) {
    this.pcClient_.close();
    this.pcClient_ = null;
  }
  this.startSignaling_();
};
Call.prototype.getPeerConnectionStates = function() {
  if (!this.pcClient_) {
    return null;
  }
  return this.pcClient_.getPeerConnectionStates();
};
Call.prototype.getPeerConnectionStats = function(callback) {
  if (!this.pcClient_) {
    return;
  }
  this.pcClient_.getPeerConnectionStats(callback);
};
Call.prototype.toggleVideoMute = function() {
  var videoTracks = this.localStream_.getVideoTracks();
  if (videoTracks.length === 0) {
    trace("No local video available.");
    return;
  }
  trace("Toggling video mute state.");
  for (var i = 0; i < videoTracks.length; ++i) {
    videoTracks[i].enabled = !videoTracks[i].enabled;
  }
  trace("Video " + (videoTracks[0].enabled ? "unmuted." : "muted."));
};
Call.prototype.toggleAudioMute = function() {
  var audioTracks = this.localStream_.getAudioTracks();
  if (audioTracks.length === 0) {
    trace("No local audio available.");
    return;
  }
  trace("Toggling audio mute state.");
  for (var i = 0; i < audioTracks.length; ++i) {
    audioTracks[i].enabled = !audioTracks[i].enabled;
  }
  trace("Audio " + (audioTracks[0].enabled ? "unmuted." : "muted."));
};
Call.prototype.connectToRoom_ = function(roomId) {
  this.params_.roomId = roomId;
  var channelPromise = this.channel_.open().catch(function(error) {
    this.onError_("WebSocket open error: " + error.message);
    return Promise.reject(error);
  }.bind(this));
  var joinPromise = this.joinRoom_().then(function(roomParams) {
    this.params_.clientId = roomParams.client_id;
    this.params_.roomId = roomParams.room_id;
    this.params_.roomLink = roomParams.room_link;
    this.params_.isInitiator = roomParams.is_initiator === "true";
    this.params_.messages = roomParams.messages;
  }.bind(this)).catch(function(error) {
    this.onError_("Room server join error: " + error.message);
    return Promise.reject(error);
  }.bind(this));
  Promise.all([channelPromise, joinPromise]).then(function() {
    this.channel_.register(this.params_.roomId, this.params_.clientId);
    Promise.all([this.getIceServersPromise_, this.getMediaPromise_]).then(function() {
      this.startSignaling_();
      if (isChromeApp()) {
        this.queueCleanupMessages_();
      }
    }.bind(this)).catch(function(error) {
      this.onError_("Failed to start signaling: " + error.message);
    }.bind(this));
  }.bind(this)).catch(function(error) {
    this.onError_("WebSocket register error: " + error.message);
  }.bind(this));
};
Call.prototype.maybeGetMedia_ = function() {
  var needStream = this.params_.mediaConstraints.audio !== false || this.params_.mediaConstraints.video !== false;
  var mediaPromise = null;
  if (needStream) {
    var mediaConstraints = this.params_.mediaConstraints;
    mediaPromise = navigator.mediaDevices.getUserMedia(mediaConstraints).catch(function(error) {
      if (error.name !== "NotFoundError") {
        throw error;
      }
      return navigator.mediaDevices.enumerateDevices().then(function(devices) {
        var cam = devices.find(function(device) {
          return device.kind === "videoinput";
        });
        var mic = devices.find(function(device) {
          return device.kind === "audioinput";
        });
        var constraints = {video:cam && mediaConstraints.video, audio:mic && mediaConstraints.audio};
        return navigator.mediaDevices.getUserMedia(constraints);
      });
    }).then(function(stream) {
      trace("Got access to local media with mediaConstraints:\n" + "  '" + JSON.stringify(mediaConstraints) + "'");
      this.onUserMediaSuccess_(stream);
    }.bind(this)).catch(function(error) {
      this.onError_("Error getting user media: " + error.message);
      this.onUserMediaError_(error);
    }.bind(this));
  } else {
    mediaPromise = Promise.resolve();
  }
  return mediaPromise;
};
Call.prototype.maybeGetIceServers_ = function() {
  var shouldRequestIceServers = this.params_.iceServerRequestUrl && this.params_.iceServerRequestUrl.length > 0 && this.params_.peerConnectionConfig.iceServers && this.params_.peerConnectionConfig.iceServers.length === 0;
  var iceServerPromise = null;
  if (shouldRequestIceServers) {
    var requestUrl = this.params_.iceServerRequestUrl;
    iceServerPromise = requestIceServers(requestUrl, this.params_.iceServerTransports).then(function(iceServers) {
      var servers = this.params_.peerConnectionConfig.iceServers;
      this.params_.peerConnectionConfig.iceServers = servers.concat(iceServers);
    }.bind(this)).catch(function(error) {
      if (this.onstatusmessage) {
        var subject = encodeURIComponent("AppRTC demo ICE servers not working");
        this.onstatusmessage("No TURN server; unlikely that media will traverse networks. " + "If this persists please " + '<a href="mailto:discuss-webrtc@googlegroups.com?' + "subject=" + subject + '">' + "report it to discuss-webrtc@googlegroups.com</a>.");
      }
      trace(error.message);
    }.bind(this));
  } else {
    iceServerPromise = Promise.resolve();
  }
  return iceServerPromise;
};
Call.prototype.onUserMediaSuccess_ = function(stream) {
  this.localStream_ = stream;
  if (this.onlocalstreamadded) {
    this.onlocalstreamadded(stream);
  }
};
Call.prototype.onUserMediaError_ = function(error) {
  var errorMessage = "Failed to get access to local media. Error name was " + error.name + ". Continuing without sending a stream.";
  this.onError_("getUserMedia error: " + errorMessage);
  this.errorMessageQueue_.push(error);
  alert(errorMessage);
};
Call.prototype.maybeCreatePcClientAsync_ = function() {
  return new Promise(function(resolve, reject) {
    if (this.pcClient_) {
      resolve();
      return;
    }
    if (typeof RTCPeerConnection.generateCertificate === "function") {
      var certParams = {name:"ECDSA", namedCurve:"P-256"};
      RTCPeerConnection.generateCertificate(certParams).then(function(cert) {
        trace("ECDSA certificate generated successfully.");
        this.params_.peerConnectionConfig.certificates = [cert];
        this.createPcClient_();
        resolve();
      }.bind(this)).catch(function(error) {
        trace("ECDSA certificate generation failed.");
        reject(error);
      });
    } else {
      this.createPcClient_();
      resolve();
    }
  }.bind(this));
};
Call.prototype.createPcClient_ = function() {
  this.pcClient_ = new PeerConnectionClient(this.params_, this.startTime);
  this.pcClient_.onsignalingmessage = this.sendSignalingMessage_.bind(this);
  this.pcClient_.onremotehangup = this.onremotehangup;
  this.pcClient_.onremotesdpset = this.onremotesdpset;
  this.pcClient_.onremotestreamadded = this.onremotestreamadded;
  this.pcClient_.onsignalingstatechange = this.onsignalingstatechange;
  this.pcClient_.oniceconnectionstatechange = this.oniceconnectionstatechange;
  this.pcClient_.onnewicecandidate = this.onnewicecandidate;
  this.pcClient_.onerror = this.onerror;
  trace("Created PeerConnectionClient");
};
Call.prototype.startSignaling_ = function() {
  trace("Starting signaling.");
  if (this.isInitiator() && this.oncallerstarted) {
    this.oncallerstarted(this.params_.roomId, this.params_.roomLink);
  }
  this.startTime = window.performance.now();
  this.maybeCreatePcClientAsync_().then(function() {
    if (this.localStream_) {
      trace("Adding local stream.");
      this.pcClient_.addStream(this.localStream_);
    }
    if (this.params_.isInitiator) {
      this.pcClient_.startAsCaller(this.params_.offerOptions);
    } else {
      this.pcClient_.startAsCallee(this.params_.messages);
    }
  }.bind(this)).catch(function(e) {
    this.onError_("Create PeerConnection exception: " + e);
    alert("Cannot create RTCPeerConnection: " + e.message);
  }.bind(this));
};
Call.prototype.joinRoom_ = function() {
  return new Promise(function(resolve, reject) {
    if (!this.params_.roomId) {
      reject(Error("Missing room id."));
    }
    var path = this.roomServer_ + "/join/" + this.params_.roomId + window.location.search;
    sendAsyncUrlRequest("POST", path).then(function(response) {
      var responseObj = parseJSON(response);
      if (!responseObj) {
        reject(Error("Error parsing response JSON."));
        return;
      }
      if (responseObj.result !== "SUCCESS") {
        reject(Error("Registration error: " + responseObj.result));
        if (responseObj.result === "FULL") {
          var getPath = this.roomServer_ + "/r/" + this.params_.roomId + window.location.search;
          window.location.assign(getPath);
        }
        return;
      }
      trace("Joined the room.");
      resolve(responseObj.params);
    }.bind(this)).catch(function(error) {
      reject(Error("Failed to join the room: " + error.message));
      return;
    }.bind(this));
  }.bind(this));
};
Call.prototype.onRecvSignalingChannelMessage_ = function(msg) {
  this.maybeCreatePcClientAsync_().then(this.pcClient_.receiveSignalingMessage(msg));
};
Call.prototype.sendSignalingMessage_ = function(message) {
  var msgString = JSON.stringify(message);
  if (this.params_.isInitiator) {
    var path = this.roomServer_ + "/message/" + this.params_.roomId + "/" + this.params_.clientId + window.location.search;
    var xhr = new XMLHttpRequest;
    xhr.open("POST", path, true);
    xhr.send(msgString);
    trace("C->GAE: " + msgString);
  } else {
    this.channel_.send(msgString);
  }
};
Call.prototype.onError_ = function(message) {
  if (this.onerror) {
    this.onerror(message);
  }
};
var Constants = {WS_ACTION:"ws", XHR_ACTION:"xhr", QUEUEADD_ACTION:"addToQueue", QUEUECLEAR_ACTION:"clearQueue", EVENT_ACTION:"event", WS_CREATE_ACTION:"create", WS_EVENT_ONERROR:"onerror", WS_EVENT_ONMESSAGE:"onmessage", WS_EVENT_ONOPEN:"onopen", WS_EVENT_ONCLOSE:"onclose", WS_EVENT_SENDERROR:"onsenderror", WS_SEND_ACTION:"send", WS_CLOSE_ACTION:"close"};
var InfoBox = function(infoDiv, call, versionInfo) {
  this.infoDiv_ = infoDiv;
  this.remoteVideo_ = document.getElementById("remote-video");
  this.localVideo_ = document.getElementById("mini-video");
  this.call_ = call;
  this.versionInfo_ = versionInfo;
  this.errorMessages_ = [];
  this.warningMessages_ = [];
  this.startTime_ = null;
  this.connectTime_ = null;
  this.stats_ = null;
  this.prevStats_ = null;
  this.getStatsTimer_ = null;
  this.localTrackIds_ = {video:"", audio:""};
  this.remoteTrackIds_ = {video:"", audio:""};
  this.iceCandidateTypes_ = {Local:{}, Remote:{}};
  this.localDecodedFrames_ = 0;
  this.localStartTime_ = 0;
  this.localVideo_.addEventListener("playing", function(event) {
    this.localDecodedFrames_ = event.target.webkitDecodedFrameCount;
    this.localStartTime_ = (new Date).getTime();
  }.bind(this));
  this.remoteDecodedFrames_ = 0;
  this.remoteStartTime_ = 0;
  this.remoteVideo_.addEventListener("playing", function(event) {
    this.remoteDecodedFrames_ = event.target.webkitDecodedFrameCount;
    this.remoteStartTime_ = (new Date).getTime();
  }.bind(this));
};
InfoBox.prototype.getLocalTrackIds = function(stream) {
  stream.getTracks().forEach(function(track) {
    if (track.kind === "audio") {
      this.localTrackIds_.audio = track.id;
    } else {
      if (track.kind === "video") {
        this.localTrackIds_.video = track.id;
      }
    }
  }.bind(this));
};
InfoBox.prototype.getRemoteTrackIds = function(stream) {
  stream.getTracks().forEach(function(track) {
    if (track.kind === "audio") {
      this.remoteTrackIds_.audio = track.id;
    } else {
      if (track.kind === "video") {
        this.remoteTrackIds_.video = track.id;
      }
    }
  }.bind(this));
};
InfoBox.prototype.recordIceCandidateTypes = function(location, candidate) {
  var type = iceCandidateType(candidate);
  var types = this.iceCandidateTypes_[location];
  if (!types[type]) {
    types[type] = 1;
  } else {
    ++types[type];
  }
  this.updateInfoDiv();
};
InfoBox.prototype.pushErrorMessage = function(msg) {
  this.errorMessages_.push(msg);
  this.updateInfoDiv();
  this.showInfoDiv();
};
InfoBox.prototype.pushWarningMessage = function(msg) {
  this.warningMessages_.push(msg);
  this.updateInfoDiv();
  this.showInfoDiv();
};
InfoBox.prototype.setSetupTimes = function(startTime, connectTime) {
  this.startTime_ = startTime;
  this.connectTime_ = connectTime;
};
InfoBox.prototype.showInfoDiv = function() {
  this.getStatsTimer_ = setInterval(this.refreshStats_.bind(this), 1000);
  this.refreshStats_();
  this.infoDiv_.classList.add("active");
};
InfoBox.prototype.toggleInfoDiv = function() {
  if (this.infoDiv_.classList.contains("active")) {
    clearInterval(this.getStatsTimer_);
    this.infoDiv_.classList.remove("active");
  } else {
    this.showInfoDiv();
  }
};
InfoBox.prototype.refreshStats_ = function() {
  this.call_.getPeerConnectionStats(function(response) {
    this.prevStats_ = this.stats_;
    this.stats_ = response;
    this.updateInfoDiv();
  }.bind(this));
};
InfoBox.prototype.updateInfoDiv = function() {
  var contents = '<pre id="info-box-stats" style="line-height: initial">';
  if (this.stats_) {
    var states = this.call_.getPeerConnectionStates();
    if (!states) {
      return;
    }
    contents += this.buildLine_("States");
    contents += this.buildLine_("Signaling", states.signalingState);
    contents += this.buildLine_("Gathering", states.iceGatheringState);
    contents += this.buildLine_("Connection", states.iceConnectionState);
    for (var endpoint in this.iceCandidateTypes_) {
      var types = [];
      for (var type in this.iceCandidateTypes_[endpoint]) {
        types.push(type + ":" + this.iceCandidateTypes_[endpoint][type]);
      }
      contents += this.buildLine_(endpoint, types.join(" "));
    }
    var statReport = enumerateStats(this.stats_, this.localTrackIds_, this.remoteTrackIds_);
    var connectionStats = statReport.connection;
    var localAddr;
    var remoteAddr;
    var localAddrType;
    var remoteAddrType;
    var localPort;
    var remotePort;
    if (connectionStats) {
      localAddr = connectionStats.localIp;
      remoteAddr = connectionStats.remoteIp;
      localAddrType = connectionStats.localType;
      remoteAddrType = connectionStats.remoteType;
      localPort = connectionStats.localPort;
      remotePort = connectionStats.remotePort;
    }
    if (localAddr && remoteAddr) {
      var relayProtocol = connectionStats.localRelayProtocol;
      contents += this.buildLine_("LocalAddr", localAddr + " (" + localAddrType + (typeof relayProtocol !== undefined ? "" + "TURN/" + relayProtocol.toUpperCase() : "") + ")");
      contents += this.buildLine_("LocalPort", localPort);
      contents += this.buildLine_("RemoteAddr", remoteAddr + " (" + remoteAddrType + ")");
      contents += this.buildLine_("RemotePort", remotePort);
    }
    contents += this.buildLine_();
    contents += this.buildStatsSection_();
  }
  if (this.errorMessages_.length > 0 || this.warningMessages_.length > 0) {
    contents += this.buildLine_("\nMessages");
    if (this.errorMessages_.length) {
      this.infoDiv_.classList.add("warning");
      for (var i = 0; i !== this.errorMessages_.length; ++i) {
        contents += this.errorMessages_[i] + "\n";
      }
    } else {
      this.infoDiv_.classList.add("active");
      for (var j = 0; j !== this.warningMessages_.length; ++j) {
        contents += this.warningMessages_[j] + "\n";
      }
    }
  } else {
    this.infoDiv_.classList.remove("warning");
  }
  if (this.versionInfo_) {
    contents += this.buildLine_();
    contents += this.buildLine_("Version");
    for (var key in this.versionInfo_) {
      contents += this.buildLine_(key, this.versionInfo_[key]);
    }
  }
  contents += "</pre>";
  if (this.infoDiv_.innerHTML !== contents) {
    this.infoDiv_.innerHTML = contents;
  }
};
InfoBox.prototype.buildStatsSection_ = function() {
  var contents = this.buildLine_("Stats");
  var statReport = enumerateStats(this.stats_, this.localTrackIds_, this.remoteTrackIds_);
  var prevStatReport = enumerateStats(this.prevStats_, this.localTrackIds_, this.remoteTrackIds_);
  var totalRtt = statReport.connection.totalRoundTripTime * 1000;
  var currentRtt = statReport.connection.currentRoundTripTime * 1000;
  if (this.endTime_ !== null) {
    contents += this.buildLine_("Call time", InfoBox.formatInterval_(window.performance.now() - this.connectTime_));
    contents += this.buildLine_("Setup time", InfoBox.formatMsec_(this.connectTime_ - this.startTime_));
  }
  if (statReport.connection.remoteIp !== "") {
    contents += this.buildLine_("TotalRtt", InfoBox.formatMsec_(totalRtt));
    contents += this.buildLine_("CurrentRtt", InfoBox.formatMsec_(currentRtt));
  }
  var rxAudio = statReport.audio.remote;
  var rxPrevAudio = prevStatReport.audio.remote;
  var rxPrevVideo = prevStatReport.video.remote;
  var rxVideo = statReport.video.remote;
  var txAudio = statReport.audio.local;
  var txPrevAudio = prevStatReport.audio.local;
  var txPrevVideo = prevStatReport.video.local;
  var txVideo = statReport.video.local;
  var rxAudioBitrate;
  var rxAudioClockRate;
  var rxAudioCodec;
  var rxAudioJitter;
  var rxAudioLevel;
  var rxAudioPacketRate;
  var rxAudioPlType;
  var rxVideoBitrate;
  var rxVideoCodec;
  var rxVideoDroppedFrames;
  var rxVideoFirCount;
  var rxVideoFps;
  var rxVideoHeight;
  var rxVideoNackCount;
  var rxVideoPacketRate;
  var rxVideoPliCount;
  var rxVideoPlType;
  var txAudioBitrate;
  var txAudioClockRate;
  var txAudioCodec;
  var txAudioLevel;
  var txAudioPacketRate;
  var txAudioPlType;
  var txVideoBitrate;
  var txVideoCodec;
  var txVideoFirCount;
  var txVideoFps;
  var txVideoHeight;
  var txVideoNackCount;
  var txVideoPacketRate;
  var txVideoPliCount;
  var txVideoPlType;
  if (txAudio.codecId !== "" && txAudio.payloadType !== 0) {
    txAudioCodec = txAudio.mimeType;
    txAudioLevel = parseFloat(txAudio.audioLevel).toFixed(3);
    txAudioClockRate = txAudio.clockRate;
    txAudioPlType = txAudio.payloadType;
    txAudioBitrate = computeBitrate(txAudio, txPrevAudio, "bytesSent");
    txAudioPacketRate = computeRate(txAudio, txPrevAudio, "packetsSent");
    contents += this.buildLine_("Audio Tx", txAudioCodec + "/" + txAudioPlType + ", " + "rate " + txAudioClockRate + ", " + InfoBox.formatBitrate_(txAudioBitrate) + ", " + InfoBox.formatPacketRate_(txAudioPacketRate) + ", inputLevel " + txAudioLevel);
  }
  if (rxAudio.codecId !== "" && rxAudio.payloadType !== 0) {
    rxAudioCodec = rxAudio.mimeType;
    rxAudioLevel = parseFloat(rxAudio.audioLevel).toFixed(3);
    rxAudioJitter = parseFloat(rxAudio.jitter).toFixed(3);
    rxAudioClockRate = rxAudio.clockRate;
    rxAudioPlType = rxAudio.payloadType;
    rxAudioBitrate = computeBitrate(rxAudio, rxPrevAudio, "bytesReceived");
    rxAudioPacketRate = computeRate(rxAudio, rxPrevAudio, "packetsReceived");
    contents += this.buildLine_("Audio Rx", rxAudioCodec + "/" + rxAudioPlType + ", " + "rate " + rxAudioClockRate + ", " + "jitter " + rxAudioJitter + ", " + InfoBox.formatBitrate_(rxAudioBitrate) + ", " + InfoBox.formatPacketRate_(rxAudioPacketRate) + ", outputLevel " + rxAudioLevel);
  }
  if (txVideo.codecId !== "" && txVideo.payloadType !== 0 && txVideo.frameHeight !== 0) {
    txVideoCodec = txVideo.mimeType;
    txVideoHeight = txVideo.frameHeight;
    txVideoPlType = txVideo.payloadType;
    txVideoPliCount = txVideo.pliCount;
    txVideoFirCount = txVideo.firCount;
    txVideoNackCount = txVideo.nackCount;
    txVideoFps = calculateFps(this.remoteVideo_, this.remoteDecodedFrames_, this.remoteStartTime_, "local", this.updateDecodedFramesCallback_);
    txVideoBitrate = computeBitrate(txVideo, txPrevVideo, "bytesSent");
    txVideoPacketRate = computeRate(txVideo, txPrevVideo, "packetsSent");
    contents += this.buildLine_("Video Tx", txVideoCodec + "/" + txVideoPlType + ", " + txVideoHeight.toString() + "p" + txVideoFps.toString() + ", " + "firCount " + txVideoFirCount + ", " + "pliCount " + txVideoPliCount + ", " + "nackCount " + txVideoNackCount + ", " + InfoBox.formatBitrate_(txVideoBitrate) + ", " + InfoBox.formatPacketRate_(txVideoPacketRate));
  }
  if (rxVideo.codecId !== "" && rxVideo.payloadType !== 0 && txVideo.frameHeight !== 0) {
    rxVideoCodec = rxVideo.mimeType;
    rxVideoHeight = rxVideo.frameHeight;
    rxVideoPlType = rxVideo.payloadType;
    rxVideoDroppedFrames = rxVideo.framesDropped;
    rxVideoPliCount = rxVideo.pliCount;
    rxVideoFirCount = rxVideo.firCount;
    rxVideoNackCount = rxVideo.nackCount;
    rxVideoFps = calculateFps(this.remoteVideo_, this.remoteDecodedFrames_, this.remoteStartTime_, "remote", this.updateDecodedFramesCallback_);
    rxVideoBitrate = computeBitrate(rxVideo, rxPrevVideo, "bytesReceived");
    rxVideoPacketRate = computeRate(rxVideo, rxPrevVideo, "packetsReceived");
    contents += this.buildLine_("Video Rx", rxVideoCodec + "/" + rxVideoPlType + ", " + rxVideoHeight.toString() + "p" + rxVideoFps.toString() + ", " + "firCount " + rxVideoFirCount + ", " + "pliCount " + rxVideoPliCount + ", " + "nackCount " + rxVideoNackCount + ", " + "droppedFrames " + rxVideoDroppedFrames + ", " + InfoBox.formatBitrate_(rxVideoBitrate) + ", " + InfoBox.formatPacketRate_(rxVideoPacketRate));
  }
  return contents;
};
InfoBox.prototype.updateDecodedFramesCallback_ = function(decodedFrames_, startTime_, remoteOrLocal) {
  if (remoteOrLocal === "local") {
    this.localDecodedFrames_ = decodedFrames_;
    this.localStartTime_ = startTime_;
  } else {
    if (remoteOrLocal === "remote") {
      this.remoteDecodedFrames_ = decodedFrames_;
      this.remoteStartTime_ = startTime_;
    }
  }
};
InfoBox.prototype.buildLine_ = function(label, value) {
  var columnWidth = 12;
  var line = "";
  if (label) {
    line += label + ":";
    while (line.length < columnWidth) {
      line += " ";
    }
    if (value) {
      line += value;
    }
  }
  line += "\n";
  return line;
};
InfoBox.formatInterval_ = function(value) {
  var result = "";
  var seconds = Math.floor(value / 1000);
  var minutes = Math.floor(seconds / 60);
  var hours = Math.floor(minutes / 60);
  var formatTwoDigit = function(twodigit) {
    return (twodigit < 10 ? "0" : "") + twodigit.toString();
  };
  if (hours > 0) {
    result += formatTwoDigit(hours) + ":";
  }
  result += formatTwoDigit(minutes - hours * 60) + ":";
  result += formatTwoDigit(seconds - minutes * 60);
  return result;
};
InfoBox.formatMsec_ = function(value) {
  return value.toFixed(0).toString() + " ms";
};
InfoBox.formatBitrate_ = function(value) {
  if (!value) {
    return "- bps";
  }
  var suffix;
  if (value < 1000) {
    suffix = "bps";
  } else {
    if (value < 1000000) {
      suffix = "kbps";
      value /= 1000;
    } else {
      suffix = "Mbps";
      value /= 1000000;
    }
  }
  var str = value.toPrecision(3) + " " + suffix;
  return str;
};
InfoBox.formatPacketRate_ = function(value) {
  if (!value) {
    return "- pps";
  }
  return value.toPrecision(3) + " " + "pps";
};
var PeerConnectionClient = function(params, startTime) {
  this.params_ = params;
  this.startTime_ = startTime;
  trace("Creating RTCPeerConnnection with:\n" + "  config: '" + JSON.stringify(params.peerConnectionConfig) + "';\n" + "  constraints: '" + JSON.stringify(params.peerConnectionConstraints) + "'.");
  this.pc_ = new RTCPeerConnection(params.peerConnectionConfig, params.peerConnectionConstraints);
  this.pc_.onicecandidate = this.onIceCandidate_.bind(this);
  this.pc_.ontrack = this.onRemoteStreamAdded_.bind(this);
  this.pc_.onremovestream = trace.bind(null, "Remote stream removed.");
  this.pc_.onsignalingstatechange = this.onSignalingStateChanged_.bind(this);
  this.pc_.oniceconnectionstatechange = this.onIceConnectionStateChanged_.bind(this);
  window.dispatchEvent(new CustomEvent("pccreated", {detail:{pc:this, time:new Date, userId:this.params_.roomId + (this.isInitiator_ ? "-0" : "-1"), sessionId:this.params_.roomId}}));
  this.hasRemoteSdp_ = false;
  this.messageQueue_ = [];
  this.isInitiator_ = false;
  this.started_ = false;
  this.onerror = null;
  this.oniceconnectionstatechange = null;
  this.onnewicecandidate = null;
  this.onremotehangup = null;
  this.onremotesdpset = null;
  this.onremotestreamadded = null;
  this.onsignalingmessage = null;
  this.onsignalingstatechange = null;
};
PeerConnectionClient.DEFAULT_SDP_OFFER_OPTIONS_ = {offerToReceiveAudio:1, offerToReceiveVideo:1, voiceActivityDetection:false};
PeerConnectionClient.prototype.addStream = function(stream) {
  if (!this.pc_) {
    return;
  }
  this.pc_.addStream(stream);
};
PeerConnectionClient.prototype.startAsCaller = function(offerOptions) {
  if (!this.pc_) {
    return false;
  }
  if (this.started_) {
    return false;
  }
  this.isInitiator_ = true;
  this.started_ = true;
  var constraints = mergeConstraints(PeerConnectionClient.DEFAULT_SDP_OFFER_OPTIONS_, offerOptions);
  trace("Sending offer to peer, with constraints: \n'" + JSON.stringify(constraints) + "'.");
  this.pc_.createOffer(constraints).then(this.setLocalSdpAndNotify_.bind(this)).catch(this.onError_.bind(this, "createOffer"));
  return true;
};
PeerConnectionClient.prototype.startAsCallee = function(initialMessages) {
  if (!this.pc_) {
    return false;
  }
  if (this.started_) {
    return false;
  }
  this.isInitiator_ = false;
  this.started_ = true;
  if (initialMessages && initialMessages.length > 0) {
    for (var i = 0, len = initialMessages.length; i < len; i++) {
      this.receiveSignalingMessage(initialMessages[i]);
    }
    return true;
  }
  if (this.messageQueue_.length > 0) {
    this.drainMessageQueue_();
  }
  return true;
};
PeerConnectionClient.prototype.receiveSignalingMessage = function(message) {
  var messageObj = parseJSON(message);
  if (!messageObj) {
    return;
  }
  if (this.isInitiator_ && messageObj.type === "answer" || !this.isInitiator_ && messageObj.type === "offer") {
    this.hasRemoteSdp_ = true;
    this.messageQueue_.unshift(messageObj);
  } else {
    if (messageObj.type === "candidate") {
      this.messageQueue_.push(messageObj);
    } else {
      if (messageObj.type === "bye") {
        if (this.onremotehangup) {
          this.onremotehangup();
        }
      }
    }
  }
  this.drainMessageQueue_();
};
PeerConnectionClient.prototype.close = function() {
  if (!this.pc_) {
    return;
  }
  this.pc_.close();
  window.dispatchEvent(new CustomEvent("pcclosed", {detail:{pc:this, time:new Date}}));
  this.pc_ = null;
};
PeerConnectionClient.prototype.getPeerConnectionStates = function() {
  if (!this.pc_) {
    return null;
  }
  return {"signalingState":this.pc_.signalingState, "iceGatheringState":this.pc_.iceGatheringState, "iceConnectionState":this.pc_.iceConnectionState};
};
PeerConnectionClient.prototype.getPeerConnectionStats = function(callback) {
  if (!this.pc_) {
    return;
  }
  this.pc_.getStats(null).then(callback);
};
PeerConnectionClient.prototype.doAnswer_ = function() {
  trace("Sending answer to peer.");
  this.pc_.createAnswer().then(this.setLocalSdpAndNotify_.bind(this)).catch(this.onError_.bind(this, "createAnswer"));
};
PeerConnectionClient.prototype.setLocalSdpAndNotify_ = function(sessionDescription) {
  sessionDescription.sdp = maybeSetOpusOptions(sessionDescription.sdp, this.params_);
  sessionDescription.sdp = maybePreferAudioReceiveCodec(sessionDescription.sdp, this.params_);
  sessionDescription.sdp = maybePreferVideoReceiveCodec(sessionDescription.sdp, this.params_);
  sessionDescription.sdp = maybeSetAudioReceiveBitRate(sessionDescription.sdp, this.params_);
  sessionDescription.sdp = maybeSetVideoReceiveBitRate(sessionDescription.sdp, this.params_);
  sessionDescription.sdp = maybeRemoveVideoFec(sessionDescription.sdp, this.params_);
  this.pc_.setLocalDescription(sessionDescription).then(trace.bind(null, "Set session description success.")).catch(this.onError_.bind(this, "setLocalDescription"));
  if (this.onsignalingmessage) {
    this.onsignalingmessage({sdp:sessionDescription.sdp, type:sessionDescription.type});
  }
};
PeerConnectionClient.prototype.setRemoteSdp_ = function(message) {
  message.sdp = maybeSetOpusOptions(message.sdp, this.params_);
  message.sdp = maybePreferAudioSendCodec(message.sdp, this.params_);
  message.sdp = maybePreferVideoSendCodec(message.sdp, this.params_);
  message.sdp = maybeSetAudioSendBitRate(message.sdp, this.params_);
  message.sdp = maybeSetVideoSendBitRate(message.sdp, this.params_);
  message.sdp = maybeSetVideoSendInitialBitRate(message.sdp, this.params_);
  message.sdp = maybeRemoveVideoFec(message.sdp, this.params_);
  this.pc_.setRemoteDescription(new RTCSessionDescription(message)).then(this.onSetRemoteDescriptionSuccess_.bind(this)).catch(this.onError_.bind(this, "setRemoteDescription"));
};
PeerConnectionClient.prototype.onSetRemoteDescriptionSuccess_ = function() {
  trace("Set remote session description success.");
  var remoteStreams = this.pc_.getRemoteStreams();
  if (this.onremotesdpset) {
    this.onremotesdpset(remoteStreams.length > 0 && remoteStreams[0].getVideoTracks().length > 0);
  }
};
PeerConnectionClient.prototype.processSignalingMessage_ = function(message) {
  if (message.type === "offer" && !this.isInitiator_) {
    if (this.pc_.signalingState !== "stable") {
      trace("ERROR: remote offer received in unexpected state: " + this.pc_.signalingState);
      return;
    }
    this.setRemoteSdp_(message);
    this.doAnswer_();
  } else {
    if (message.type === "answer" && this.isInitiator_) {
      if (this.pc_.signalingState !== "have-local-offer") {
        trace("ERROR: remote answer received in unexpected state: " + this.pc_.signalingState);
        return;
      }
      this.setRemoteSdp_(message);
    } else {
      if (message.type === "candidate") {
        var candidate = new RTCIceCandidate({sdpMLineIndex:message.label, candidate:message.candidate});
        this.recordIceCandidate_("Remote", candidate);
        this.pc_.addIceCandidate(candidate).then(trace.bind(null, "Remote candidate added successfully.")).catch(this.onError_.bind(this, "addIceCandidate"));
      } else {
        trace("WARNING: unexpected message: " + JSON.stringify(message));
      }
    }
  }
};
PeerConnectionClient.prototype.drainMessageQueue_ = function() {
  if (!this.pc_ || !this.started_ || !this.hasRemoteSdp_) {
    return;
  }
  for (var i = 0, len = this.messageQueue_.length; i < len; i++) {
    this.processSignalingMessage_(this.messageQueue_[i]);
  }
  this.messageQueue_ = [];
};
PeerConnectionClient.prototype.onIceCandidate_ = function(event) {
  if (event.candidate) {
    if (this.filterIceCandidate_(event.candidate)) {
      var message = {type:"candidate", label:event.candidate.sdpMLineIndex, id:event.candidate.sdpMid, candidate:event.candidate.candidate};
      if (this.onsignalingmessage) {
        this.onsignalingmessage(message);
      }
      this.recordIceCandidate_("Local", event.candidate);
    }
  } else {
    trace("End of candidates.");
  }
};
PeerConnectionClient.prototype.onSignalingStateChanged_ = function() {
  if (!this.pc_) {
    return;
  }
  trace("Signaling state changed to: " + this.pc_.signalingState);
  if (this.onsignalingstatechange) {
    this.onsignalingstatechange();
  }
};
PeerConnectionClient.prototype.onIceConnectionStateChanged_ = function() {
  if (!this.pc_) {
    return;
  }
  trace("ICE connection state changed to: " + this.pc_.iceConnectionState);
  if (this.pc_.iceConnectionState === "completed") {
    trace("ICE complete time: " + (window.performance.now() - this.startTime_).toFixed(0) + "ms.");
  }
  if (this.oniceconnectionstatechange) {
    this.oniceconnectionstatechange();
  }
};
PeerConnectionClient.prototype.filterIceCandidate_ = function(candidateObj) {
  var candidateStr = candidateObj.candidate;
  if (candidateStr.indexOf("tcp") !== -1) {
    return false;
  }
  if (this.params_.peerConnectionConfig.iceTransports === "relay" && iceCandidateType(candidateStr) !== "relay") {
    return false;
  }
  return true;
};
PeerConnectionClient.prototype.recordIceCandidate_ = function(location, candidateObj) {
  if (this.onnewicecandidate) {
    this.onnewicecandidate(location, candidateObj.candidate);
  }
};
PeerConnectionClient.prototype.onRemoteStreamAdded_ = function(event) {
  if (this.onremotestreamadded) {
    this.onremotestreamadded(event.streams[0]);
  }
};
PeerConnectionClient.prototype.onError_ = function(tag, error) {
  if (this.onerror) {
    this.onerror(tag + ": " + error.toString());
  }
};
var RemoteWebSocket = function(wssUrl, wssPostUrl) {
  this.wssUrl_ = wssUrl;
  apprtc.windowPort.addMessageListener(this.handleMessage_.bind(this));
  this.sendMessage_({action:Constants.WS_ACTION, wsAction:Constants.WS_CREATE_ACTION, wssUrl:wssUrl, wssPostUrl:wssPostUrl});
  this.readyState = WebSocket.CONNECTING;
};
RemoteWebSocket.prototype.sendMessage_ = function(message) {
  apprtc.windowPort.sendMessage(message);
};
RemoteWebSocket.prototype.send = function(data) {
  if (this.readyState !== WebSocket.OPEN) {
    throw "Web socket is not in OPEN state: " + this.readyState;
  }
  this.sendMessage_({action:Constants.WS_ACTION, wsAction:Constants.WS_SEND_ACTION, data:data});
};
RemoteWebSocket.prototype.close = function() {
  if (this.readyState === WebSocket.CLOSING || this.readyState === WebSocket.CLOSED) {
    return;
  }
  this.readyState = WebSocket.CLOSING;
  this.sendMessage_({action:Constants.WS_ACTION, wsAction:Constants.WS_CLOSE_ACTION});
};
RemoteWebSocket.prototype.handleMessage_ = function(message) {
  if (message.action === Constants.WS_ACTION && message.wsAction === Constants.EVENT_ACTION) {
    if (message.wsEvent === Constants.WS_EVENT_ONOPEN) {
      this.readyState = WebSocket.OPEN;
      if (this.onopen) {
        this.onopen();
      }
    } else {
      if (message.wsEvent === Constants.WS_EVENT_ONCLOSE) {
        this.readyState = WebSocket.CLOSED;
        if (this.onclose) {
          this.onclose(message.data);
        }
      } else {
        if (message.wsEvent === Constants.WS_EVENT_ONERROR) {
          if (this.onerror) {
            this.onerror(message.data);
          }
        } else {
          if (message.wsEvent === Constants.WS_EVENT_ONMESSAGE) {
            if (this.onmessage) {
              this.onmessage(message.data);
            }
          } else {
            if (message.wsEvent === Constants.WS_EVENT_SENDERROR) {
              if (this.onsenderror) {
                this.onsenderror(message.data);
              }
              trace("ERROR: web socket send failed: " + message.data);
            }
          }
        }
      }
    }
  }
};
var RoomSelection = function(roomSelectionDiv, uiConstants, recentRoomsKey, setupCompletedCallback) {
  this.roomSelectionDiv_ = roomSelectionDiv;
  this.setupCompletedCallback_ = setupCompletedCallback;
  this.roomIdInput_ = this.roomSelectionDiv_.querySelector(uiConstants.roomSelectionInput);
  this.roomIdInputLabel_ = this.roomSelectionDiv_.querySelector(uiConstants.roomSelectionInputLabel);
  this.roomJoinButton_ = this.roomSelectionDiv_.querySelector(uiConstants.roomSelectionJoinButton);
  this.roomRandomButton_ = this.roomSelectionDiv_.querySelector(uiConstants.roomSelectionRandomButton);
  this.roomRecentList_ = this.roomSelectionDiv_.querySelector(uiConstants.roomSelectionRecentList);
  this.roomIdInput_.value = randomString(9);
  this.onRoomIdInput_();
  this.roomIdInputListener_ = this.onRoomIdInput_.bind(this);
  this.roomIdInput_.addEventListener("input", this.roomIdInputListener_, false);
  this.roomIdKeyupListener_ = this.onRoomIdKeyPress_.bind(this);
  this.roomIdInput_.addEventListener("keyup", this.roomIdKeyupListener_, false);
  this.roomRandomButtonListener_ = this.onRandomButton_.bind(this);
  this.roomRandomButton_.addEventListener("click", this.roomRandomButtonListener_, false);
  this.roomJoinButtonListener_ = this.onJoinButton_.bind(this);
  this.roomJoinButton_.addEventListener("click", this.roomJoinButtonListener_, false);
  this.onRoomSelected = null;
  this.recentlyUsedList_ = new RoomSelection.RecentlyUsedList(recentRoomsKey);
  this.startBuildingRecentRoomList_();
};
RoomSelection.matchRandomRoomPattern = function(input) {
  return input.match(/^\d{9}$/) !== null;
};
RoomSelection.prototype.removeEventListeners = function() {
  this.roomIdInput_.removeEventListener("input", this.roomIdInputListener_);
  this.roomIdInput_.removeEventListener("keyup", this.roomIdKeyupListener_);
  this.roomRandomButton_.removeEventListener("click", this.roomRandomButtonListener_);
  this.roomJoinButton_.removeEventListener("click", this.roomJoinButtonListener_);
};
RoomSelection.prototype.startBuildingRecentRoomList_ = function() {
  this.recentlyUsedList_.getRecentRooms().then(function(recentRooms) {
    this.buildRecentRoomList_(recentRooms);
    if (this.setupCompletedCallback_) {
      this.setupCompletedCallback_();
    }
  }.bind(this)).catch(function(error) {
    trace("Error building recent rooms list: " + error.message);
  }.bind(this));
};
RoomSelection.prototype.buildRecentRoomList_ = function(recentRooms) {
  var lastChild = this.roomRecentList_.lastChild;
  while (lastChild) {
    this.roomRecentList_.removeChild(lastChild);
    lastChild = this.roomRecentList_.lastChild;
  }
  for (var i = 0; i < recentRooms.length; ++i) {
    var li = document.createElement("li");
    var href = document.createElement("a");
    var linkText = document.createTextNode(recentRooms[i]);
    href.appendChild(linkText);
    href.href = location.origin + "/r/" + encodeURIComponent(recentRooms[i]);
    li.appendChild(href);
    this.roomRecentList_.appendChild(li);
    href.addEventListener("click", this.makeRecentlyUsedClickHandler_(recentRooms[i]).bind(this), false);
  }
};
RoomSelection.prototype.onRoomIdInput_ = function() {
  var room = this.roomIdInput_.value;
  var valid = room.length >= 5;
  var re = /^([a-zA-Z0-9-_]+)+$/;
  valid = valid && re.exec(room);
  if (valid) {
    this.roomJoinButton_.disabled = false;
    this.roomIdInput_.classList.remove("invalid");
    this.roomIdInputLabel_.classList.add("hidden");
  } else {
    this.roomJoinButton_.disabled = true;
    this.roomIdInput_.classList.add("invalid");
    this.roomIdInputLabel_.classList.remove("hidden");
  }
};
RoomSelection.prototype.onRoomIdKeyPress_ = function(event) {
  if (event.which !== 13 || this.roomJoinButton_.disabled) {
    return;
  }
  this.onJoinButton_();
};
RoomSelection.prototype.onRandomButton_ = function() {
  this.roomIdInput_.value = randomString(9);
  this.onRoomIdInput_();
};
RoomSelection.prototype.onJoinButton_ = function() {
  this.loadRoom_(this.roomIdInput_.value);
};
RoomSelection.prototype.makeRecentlyUsedClickHandler_ = function(roomName) {
  return function(e) {
    e.preventDefault();
    this.loadRoom_(roomName);
  };
};
RoomSelection.prototype.loadRoom_ = function(roomName) {
  this.recentlyUsedList_.pushRecentRoom(roomName);
  if (this.onRoomSelected) {
    this.onRoomSelected(roomName);
  }
};
RoomSelection.RecentlyUsedList = function(key) {
  this.LISTLENGTH_ = 10;
  this.RECENTROOMSKEY_ = key || "recentRooms";
  this.storage_ = new Storage;
};
RoomSelection.RecentlyUsedList.prototype.pushRecentRoom = function(roomId) {
  return new Promise(function(resolve, reject) {
    if (!roomId) {
      resolve();
      return;
    }
    this.getRecentRooms().then(function(recentRooms) {
      recentRooms = [roomId].concat(recentRooms);
      recentRooms = recentRooms.filter(function(value, index, self) {
        return self.indexOf(value) === index;
      });
      recentRooms = recentRooms.slice(0, this.LISTLENGTH_);
      this.storage_.setStorage(this.RECENTROOMSKEY_, JSON.stringify(recentRooms), function() {
        resolve();
      });
    }.bind(this)).catch(function(err) {
      reject(err);
    }.bind(this));
  }.bind(this));
};
RoomSelection.RecentlyUsedList.prototype.getRecentRooms = function() {
  return new Promise(function(resolve) {
    this.storage_.getStorage(this.RECENTROOMSKEY_, function(value) {
      var recentRooms = parseJSON(value);
      if (!recentRooms) {
        recentRooms = [];
      }
      resolve(recentRooms);
    });
  }.bind(this));
};
function mergeConstraints(cons1, cons2) {
  if (!cons1 || !cons2) {
    return cons1 || cons2;
  }
  var merged = cons1;
  for (var key in cons2) {
    merged[key] = cons2[key];
  }
  return merged;
}
function iceCandidateType(candidateStr) {
  return candidateStr.split(" ")[7];
}
function maybeSetOpusOptions(sdp, params) {
  if (params.opusStereo === "true") {
    sdp = setCodecParam(sdp, "opus/48000", "stereo", "1");
  } else {
    if (params.opusStereo === "false") {
      sdp = removeCodecParam(sdp, "opus/48000", "stereo");
    }
  }
  if (params.opusFec === "true") {
    sdp = setCodecParam(sdp, "opus/48000", "useinbandfec", "1");
  } else {
    if (params.opusFec === "false") {
      sdp = removeCodecParam(sdp, "opus/48000", "useinbandfec");
    }
  }
  if (params.opusDtx === "true") {
    sdp = setCodecParam(sdp, "opus/48000", "usedtx", "1");
  } else {
    if (params.opusDtx === "false") {
      sdp = removeCodecParam(sdp, "opus/48000", "usedtx");
    }
  }
  if (params.opusMaxPbr) {
    sdp = setCodecParam(sdp, "opus/48000", "maxplaybackrate", params.opusMaxPbr);
  }
  return sdp;
}
function maybeSetAudioSendBitRate(sdp, params) {
  if (!params.audioSendBitrate) {
    return sdp;
  }
  trace("Prefer audio send bitrate: " + params.audioSendBitrate);
  return preferBitRate(sdp, params.audioSendBitrate, "audio");
}
function maybeSetAudioReceiveBitRate(sdp, params) {
  if (!params.audioRecvBitrate) {
    return sdp;
  }
  trace("Prefer audio receive bitrate: " + params.audioRecvBitrate);
  return preferBitRate(sdp, params.audioRecvBitrate, "audio");
}
function maybeSetVideoSendBitRate(sdp, params) {
  if (!params.videoSendBitrate) {
    return sdp;
  }
  trace("Prefer video send bitrate: " + params.videoSendBitrate);
  return preferBitRate(sdp, params.videoSendBitrate, "video");
}
function maybeSetVideoReceiveBitRate(sdp, params) {
  if (!params.videoRecvBitrate) {
    return sdp;
  }
  trace("Prefer video receive bitrate: " + params.videoRecvBitrate);
  return preferBitRate(sdp, params.videoRecvBitrate, "video");
}
function preferBitRate(sdp, bitrate, mediaType) {
  var sdpLines = sdp.split("\r\n");
  var mLineIndex = findLine(sdpLines, "m=", mediaType);
  if (mLineIndex === null) {
    trace("Failed to add bandwidth line to sdp, as no m-line found");
    return sdp;
  }
  var nextMLineIndex = findLineInRange(sdpLines, mLineIndex + 1, -1, "m=");
  if (nextMLineIndex === null) {
    nextMLineIndex = sdpLines.length;
  }
  var cLineIndex = findLineInRange(sdpLines, mLineIndex + 1, nextMLineIndex, "c=");
  if (cLineIndex === null) {
    trace("Failed to add bandwidth line to sdp, as no c-line found");
    return sdp;
  }
  var bLineIndex = findLineInRange(sdpLines, cLineIndex + 1, nextMLineIndex, "b=AS");
  if (bLineIndex) {
    sdpLines.splice(bLineIndex, 1);
  }
  var bwLine = "b=AS:" + bitrate;
  sdpLines.splice(cLineIndex + 1, 0, bwLine);
  sdp = sdpLines.join("\r\n");
  return sdp;
}
function maybeSetVideoSendInitialBitRate(sdp, params) {
  var initialBitrate = parseInt(params.videoSendInitialBitrate);
  if (!initialBitrate) {
    return sdp;
  }
  var maxBitrate = parseInt(initialBitrate);
  var bitrate = parseInt(params.videoSendBitrate);
  if (bitrate) {
    if (initialBitrate > bitrate) {
      trace("Clamping initial bitrate to max bitrate of " + bitrate + " kbps.");
      initialBitrate = bitrate;
      params.videoSendInitialBitrate = initialBitrate;
    }
    maxBitrate = bitrate;
  }
  var sdpLines = sdp.split("\r\n");
  var mLineIndex = findLine(sdpLines, "m=", "video");
  if (mLineIndex === null) {
    trace("Failed to find video m-line");
    return sdp;
  }
  var videoMLine = sdpLines[mLineIndex];
  var pattern = new RegExp("m=video\\s\\d+\\s[A-Z/]+\\s");
  var sendPayloadType = videoMLine.split(pattern)[1].split(" ")[0];
  var fmtpLine = sdpLines[findLine(sdpLines, "a=rtpmap", sendPayloadType)];
  var codecName = fmtpLine.split("a=rtpmap:" + sendPayloadType)[1].split("/")[0];
  var codec = params.videoSendCodec || codecName;
  sdp = setCodecParam(sdp, codec, "x-google-min-bitrate", params.videoSendInitialBitrate.toString());
  sdp = setCodecParam(sdp, codec, "x-google-max-bitrate", maxBitrate.toString());
  return sdp;
}
function removePayloadTypeFromMline(mLine, payloadType) {
  mLine = mLine.split(" ");
  for (var i = 0; i < mLine.length; ++i) {
    if (mLine[i] === payloadType.toString()) {
      mLine.splice(i, 1);
    }
  }
  return mLine.join(" ");
}
function removeCodecByName(sdpLines, codec) {
  var index = findLine(sdpLines, "a=rtpmap", codec);
  if (index === null) {
    return sdpLines;
  }
  var payloadType = getCodecPayloadTypeFromLine(sdpLines[index]);
  sdpLines.splice(index, 1);
  var mLineIndex = findLine(sdpLines, "m=", "video");
  if (mLineIndex === null) {
    return sdpLines;
  }
  sdpLines[mLineIndex] = removePayloadTypeFromMline(sdpLines[mLineIndex], payloadType);
  return sdpLines;
}
function removeCodecByPayloadType(sdpLines, payloadType) {
  var index = findLine(sdpLines, "a=rtpmap", payloadType.toString());
  if (index === null) {
    return sdpLines;
  }
  sdpLines.splice(index, 1);
  var mLineIndex = findLine(sdpLines, "m=", "video");
  if (mLineIndex === null) {
    return sdpLines;
  }
  sdpLines[mLineIndex] = removePayloadTypeFromMline(sdpLines[mLineIndex], payloadType);
  return sdpLines;
}
function maybeRemoveVideoFec(sdp, params) {
  if (params.videoFec !== "false") {
    return sdp;
  }
  var sdpLines = sdp.split("\r\n");
  var index = findLine(sdpLines, "a=rtpmap", "red");
  if (index === null) {
    return sdp;
  }
  var redPayloadType = getCodecPayloadTypeFromLine(sdpLines[index]);
  sdpLines = removeCodecByPayloadType(sdpLines, redPayloadType);
  sdpLines = removeCodecByName(sdpLines, "ulpfec");
  index = findLine(sdpLines, "a=fmtp", redPayloadType.toString());
  if (index === null) {
    return sdp;
  }
  var fmtpLine = parseFmtpLine(sdpLines[index]);
  var rtxPayloadType = fmtpLine.pt;
  if (rtxPayloadType === null) {
    return sdp;
  }
  sdpLines.splice(index, 1);
  sdpLines = removeCodecByPayloadType(sdpLines, rtxPayloadType);
  return sdpLines.join("\r\n");
}
function maybePreferAudioSendCodec(sdp, params) {
  return maybePreferCodec(sdp, "audio", "send", params.audioSendCodec);
}
function maybePreferAudioReceiveCodec(sdp, params) {
  return maybePreferCodec(sdp, "audio", "receive", params.audioRecvCodec);
}
function maybePreferVideoSendCodec(sdp, params) {
  return maybePreferCodec(sdp, "video", "send", params.videoSendCodec);
}
function maybePreferVideoReceiveCodec(sdp, params) {
  return maybePreferCodec(sdp, "video", "receive", params.videoRecvCodec);
}
function maybePreferCodec(sdp, type, dir, codec) {
  var str = type + " " + dir + " codec";
  if (!codec) {
    trace("No preference on " + str + ".");
    return sdp;
  }
  trace("Prefer " + str + ": " + codec);
  var sdpLines = sdp.split("\r\n");
  var mLineIndex = findLine(sdpLines, "m=", type);
  if (mLineIndex === null) {
    return sdp;
  }
  var payload = null;
  for (var i = sdpLines.length - 1; i >= 0; --i) {
    var index = findLineInRange(sdpLines, i, 0, "a=rtpmap", codec, "desc");
    if (index !== null) {
      i = index;
      payload = getCodecPayloadTypeFromLine(sdpLines[index]);
      if (payload) {
        sdpLines[mLineIndex] = setDefaultCodec(sdpLines[mLineIndex], payload);
      }
    } else {
      break;
    }
  }
  sdp = sdpLines.join("\r\n");
  return sdp;
}
function setCodecParam(sdp, codec, param, value) {
  var sdpLines = sdp.split("\r\n");
  var fmtpLineIndex = findFmtpLine(sdpLines, codec);
  var fmtpObj = {};
  if (fmtpLineIndex === null) {
    var index = findLine(sdpLines, "a=rtpmap", codec);
    if (index === null) {
      return sdp;
    }
    var payload = getCodecPayloadTypeFromLine(sdpLines[index]);
    fmtpObj.pt = payload.toString();
    fmtpObj.params = {};
    fmtpObj.params[param] = value;
    sdpLines.splice(index + 1, 0, writeFmtpLine(fmtpObj));
  } else {
    fmtpObj = parseFmtpLine(sdpLines[fmtpLineIndex]);
    fmtpObj.params[param] = value;
    sdpLines[fmtpLineIndex] = writeFmtpLine(fmtpObj);
  }
  sdp = sdpLines.join("\r\n");
  return sdp;
}
function removeCodecParam(sdp, codec, param) {
  var sdpLines = sdp.split("\r\n");
  var fmtpLineIndex = findFmtpLine(sdpLines, codec);
  if (fmtpLineIndex === null) {
    return sdp;
  }
  var map = parseFmtpLine(sdpLines[fmtpLineIndex]);
  delete map.params[param];
  var newLine = writeFmtpLine(map);
  if (newLine === null) {
    sdpLines.splice(fmtpLineIndex, 1);
  } else {
    sdpLines[fmtpLineIndex] = newLine;
  }
  sdp = sdpLines.join("\r\n");
  return sdp;
}
function parseFmtpLine(fmtpLine) {
  var fmtpObj = {};
  var spacePos = fmtpLine.indexOf(" ");
  var keyValues = fmtpLine.substring(spacePos + 1).split(";");
  var pattern = new RegExp("a=fmtp:(\\d+)");
  var result = fmtpLine.match(pattern);
  if (result && result.length === 2) {
    fmtpObj.pt = result[1];
  } else {
    return null;
  }
  var params = {};
  for (var i = 0; i < keyValues.length; ++i) {
    var pair = keyValues[i].split("=");
    if (pair.length === 2) {
      params[pair[0]] = pair[1];
    }
  }
  fmtpObj.params = params;
  return fmtpObj;
}
function writeFmtpLine(fmtpObj) {
  if (!fmtpObj.hasOwnProperty("pt") || !fmtpObj.hasOwnProperty("params")) {
    return null;
  }
  var pt = fmtpObj.pt;
  var params = fmtpObj.params;
  var keyValues = [];
  var i = 0;
  for (var key in params) {
    keyValues[i] = key + "=" + params[key];
    ++i;
  }
  if (i === 0) {
    return null;
  }
  return "a=fmtp:" + pt.toString() + " " + keyValues.join(";");
}
function findFmtpLine(sdpLines, codec) {
  var payload = getCodecPayloadType(sdpLines, codec);
  return payload ? findLine(sdpLines, "a=fmtp:" + payload.toString()) : null;
}
function findLine(sdpLines, prefix, substr) {
  return findLineInRange(sdpLines, 0, -1, prefix, substr);
}
function findLineInRange(sdpLines, startLine, endLine, prefix, substr, direction) {
  if (direction === undefined) {
    direction = "asc";
  }
  direction = direction || "asc";
  if (direction === "asc") {
    var realEndLine = endLine !== -1 ? endLine : sdpLines.length;
    for (var i = startLine; i < realEndLine; ++i) {
      if (sdpLines[i].indexOf(prefix) === 0) {
        if (!substr || sdpLines[i].toLowerCase().indexOf(substr.toLowerCase()) !== -1) {
          return i;
        }
      }
    }
  } else {
    var realStartLine = startLine !== -1 ? startLine : sdpLines.length - 1;
    for (var j = realStartLine; j >= 0; --j) {
      if (sdpLines[j].indexOf(prefix) === 0) {
        if (!substr || sdpLines[j].toLowerCase().indexOf(substr.toLowerCase()) !== -1) {
          return j;
        }
      }
    }
  }
  return null;
}
function getCodecPayloadType(sdpLines, codec) {
  var index = findLine(sdpLines, "a=rtpmap", codec);
  return index ? getCodecPayloadTypeFromLine(sdpLines[index]) : null;
}
function getCodecPayloadTypeFromLine(sdpLine) {
  var pattern = new RegExp("a=rtpmap:(\\d+) [a-zA-Z0-9-]+\\/\\d+");
  var result = sdpLine.match(pattern);
  return result && result.length === 2 ? result[1] : null;
}
function setDefaultCodec(mLine, payload) {
  var elements = mLine.split(" ");
  var newLine = elements.slice(0, 3);
  newLine.push(payload);
  for (var i = 3; i < elements.length; i++) {
    if (elements[i] !== payload) {
      newLine.push(elements[i]);
    }
  }
  return newLine.join(" ");
}
;var SignalingChannel = function(wssUrl, wssPostUrl) {
  this.wssUrl_ = wssUrl;
  this.wssPostUrl_ = wssPostUrl;
  this.roomId_ = null;
  this.clientId_ = null;
  this.websocket_ = null;
  this.registered_ = false;
  this.onerror = null;
  this.onmessage = null;
};
SignalingChannel.prototype.open = function() {
  if (this.websocket_) {
    trace("ERROR: SignalingChannel has already opened.");
    return;
  }
  trace("Opening signaling channel.");
  return new Promise(function(resolve, reject) {
    if (isChromeApp()) {
      this.websocket_ = new RemoteWebSocket(this.wssUrl_, this.wssPostUrl_);
    } else {
      this.websocket_ = new WebSocket(this.wssUrl_);
    }
    this.websocket_.onopen = function() {
      trace("Signaling channel opened.");
      this.websocket_.onerror = function() {
        trace("Signaling channel error.");
      };
      this.websocket_.onclose = function(event) {
        trace("Channel closed with code:" + event.code + " reason:" + event.reason);
        this.websocket_ = null;
        this.registered_ = false;
      };
      if (this.clientId_ && this.roomId_) {
        this.register(this.roomId_, this.clientId_);
      }
      resolve();
    }.bind(this);
    this.websocket_.onmessage = function(event) {
      trace("WSS->C: " + event.data);
      var message = parseJSON(event.data);
      if (!message) {
        trace("Failed to parse WSS message: " + event.data);
        return;
      }
      if (message.error) {
        trace("Signaling server error message: " + message.error);
        return;
      }
      this.onmessage(message.msg);
    }.bind(this);
    this.websocket_.onerror = function() {
      reject(Error("WebSocket error."));
    };
  }.bind(this));
};
SignalingChannel.prototype.register = function(roomId, clientId) {
  if (this.registered_) {
    trace("ERROR: SignalingChannel has already registered.");
    return;
  }
  this.roomId_ = roomId;
  this.clientId_ = clientId;
  if (!this.roomId_) {
    trace("ERROR: missing roomId.");
  }
  if (!this.clientId_) {
    trace("ERROR: missing clientId.");
  }
  if (!this.websocket_ || this.websocket_.readyState !== WebSocket.OPEN) {
    trace("WebSocket not open yet; saving the IDs to register later.");
    return;
  }
  trace("Registering signaling channel.");
  var registerMessage = {cmd:"register", roomid:this.roomId_, clientid:this.clientId_};
  this.websocket_.send(JSON.stringify(registerMessage));
  this.registered_ = true;
  trace("Signaling channel registered.");
};
SignalingChannel.prototype.close = function(async) {
  if (this.websocket_) {
    this.websocket_.close();
    this.websocket_ = null;
  }
  if (!this.clientId_ || !this.roomId_) {
    return;
  }
  var path = this.getWssPostUrl();
  return sendUrlRequest("DELETE", path, async).catch(function(error) {
    trace("Error deleting web socket connection: " + error.message);
  }.bind(this)).then(function() {
    this.clientId_ = null;
    this.roomId_ = null;
    this.registered_ = false;
  }.bind(this));
};
SignalingChannel.prototype.send = function(message) {
  if (!this.roomId_ || !this.clientId_) {
    trace("ERROR: SignalingChannel has not registered.");
    return;
  }
  trace("C->WSS: " + message);
  var wssMessage = {cmd:"send", msg:message};
  var msgString = JSON.stringify(wssMessage);
  if (this.websocket_ && this.websocket_.readyState === WebSocket.OPEN) {
    this.websocket_.send(msgString);
  } else {
    var path = this.getWssPostUrl();
    var xhr = new XMLHttpRequest;
    xhr.open("POST", path, true);
    xhr.send(wssMessage.msg);
  }
};
SignalingChannel.prototype.getWssPostUrl = function() {
  return this.wssPostUrl_ + "/" + this.roomId_ + "/" + this.clientId_;
};
function extractStatAsInt(stats, statObj, statName) {
  var str = extractStat(stats, statObj, statName);
  if (str) {
    var val = parseInt(str);
    if (val !== -1) {
      return val;
    }
  }
  return null;
}
function extractStat(stats, statObj, statName) {
  var report = getStatsReport(stats, statObj, statName);
  if (report && report[statName] !== -1) {
    return report[statName];
  }
  return null;
}
function getStatsReport(stats, statObj, statName, statVal) {
  var result = null;
  if (stats) {
    stats.forEach(function(report, stat) {
      if (report.type === statObj) {
        var found = true;
        if (statName) {
          var val = statName === "id" ? report.id : report[statName];
          found = statVal !== undefined ? val === statVal : val;
        }
        if (found) {
          result = report;
        }
      }
    });
  }
  return result;
}
function enumerateStats(stats, localTrackIds, remoteTrackIds) {
  var statsObject = {audio:{local:{audioLevel:0.0, bytesSent:0, clockRate:0, codecId:"", mimeType:"", packetsSent:0, payloadType:0, timestamp:0.0, trackId:"", transportId:""}, remote:{audioLevel:0.0, bytesReceived:0, clockRate:0, codecId:"", fractionLost:0, jitter:0, mimeType:"", packetsLost:0, packetsReceived:0, payloadType:0, timestamp:0.0, trackId:"", transportId:""}}, video:{local:{bytesSent:0, clockRate:0, codecId:"", firCount:0, framesEncoded:0, frameHeight:0, framesSent:0, frameWidth:0, nackCount:0, 
  packetsSent:0, payloadType:0, pliCount:0, qpSum:0, timestamp:0.0, trackId:"", transportId:""}, remote:{bytesReceived:0, clockRate:0, codecId:"", firCount:0, fractionLost:0, frameHeight:0, framesDecoded:0, framesDropped:0, framesReceived:0, frameWidth:0, nackCount:0, packetsLost:0, packetsReceived:0, payloadType:0, pliCount:0, qpSum:0, timestamp:0.0, trackId:"", transportId:""}}, connection:{availableOutgoingBitrate:0, bytesReceived:0, bytesSent:0, consentRequestsSent:0, currentRoundTripTime:0.0, 
  localCandidateId:"", localCandidateType:"", localIp:"", localPort:0, localPriority:0, localProtocol:"", localRelayProtocol:undefined, remoteCandidateId:"", remoteCandidateType:"", remoteIp:"", remotePort:0, remotePriority:0, remoteProtocol:"", requestsReceived:0, requestsSent:0, responsesReceived:0, responsesSent:0, timestamp:0.0, totalRoundTripTime:0.0}};
  if (stats) {
    stats.forEach(function(report, stat) {
      switch(report.type) {
        case "outbound-rtp":
          if (report.hasOwnProperty("trackId")) {
            if (report.trackId.indexOf(localTrackIds.audio) !== -1) {
              statsObject.audio.local.bytesSent = report.bytesSent;
              statsObject.audio.local.codecId = report.codecId;
              statsObject.audio.local.packetsSent = report.packetsSent;
              statsObject.audio.local.timestamp = report.timestamp;
              statsObject.audio.local.trackId = report.trackId;
              statsObject.audio.local.transportId = report.transportId;
            }
            if (report.trackId.indexOf(localTrackIds.video) !== -1) {
              statsObject.video.local.bytesSent = report.bytesSent;
              statsObject.video.local.codecId = report.codecId;
              statsObject.video.local.firCount = report.firCount;
              statsObject.video.local.framesEncoded = report.frameEncoded;
              statsObject.video.local.framesSent = report.framesSent;
              statsObject.video.local.packetsSent = report.packetsSent;
              statsObject.video.local.pliCount = report.pliCount;
              statsObject.video.local.qpSum = report.qpSum;
              statsObject.video.local.timestamp = report.timestamp;
              statsObject.video.local.trackId = report.trackId;
              statsObject.video.local.transportId = report.transportId;
            }
          }
          break;
        case "inbound-rtp":
          if (report.hasOwnProperty("trackId")) {
            if (report.trackId.indexOf(remoteTrackIds.audio) !== -1) {
              statsObject.audio.remote.bytesReceived = report.bytesReceived;
              statsObject.audio.remote.codecId = report.codecId;
              statsObject.audio.remote.fractionLost = report.fractionLost;
              statsObject.audio.remote.jitter = report.jitter;
              statsObject.audio.remote.packetsLost = report.packetsLost;
              statsObject.audio.remote.packetsReceived = report.packetsReceived;
              statsObject.audio.remote.timestamp = report.timestamp;
              statsObject.audio.remote.trackId = report.trackId;
              statsObject.audio.remote.transportId = report.transportId;
            }
            if (report.trackId.indexOf(remoteTrackIds.video) !== -1) {
              statsObject.video.remote.bytesReceived = report.bytesReceived;
              statsObject.video.remote.codecId = report.codecId;
              statsObject.video.remote.firCount = report.firCount;
              statsObject.video.remote.fractionLost = report.fractionLost;
              statsObject.video.remote.nackCount = report.nackCount;
              statsObject.video.remote.packetsLost = report.patsLost;
              statsObject.video.remote.packetsReceived = report.packetsReceived;
              statsObject.video.remote.pliCount = report.pliCount;
              statsObject.video.remote.qpSum = report.qpSum;
              statsObject.video.remote.timestamp = report.timestamp;
              statsObject.video.remote.trackId = report.trackId;
              statsObject.video.remote.transportId = report.transportId;
            }
          }
          break;
        case "candidate-pair":
          if (report.hasOwnProperty("availableOutgoingBitrate")) {
            statsObject.connection.availableOutgoingBitrate = report.availableOutgoingBitrate;
            statsObject.connection.bytesReceived = report.bytesReceived;
            statsObject.connection.bytesSent = report.bytesSent;
            statsObject.connection.consentRequestsSent = report.consentRequestsSent;
            statsObject.connection.currentRoundTripTime = report.currentRoundTripTime;
            statsObject.connection.localCandidateId = report.localCandidateId;
            statsObject.connection.remoteCandidateId = report.remoteCandidateId;
            statsObject.connection.requestsReceived = report.requestsReceived;
            statsObject.connection.requestsSent = report.requestsSent;
            statsObject.connection.responsesReceived = report.responsesReceived;
            statsObject.connection.responsesSent = report.responsesSent;
            statsObject.connection.timestamp = report.timestamp;
            statsObject.connection.totalRoundTripTime = report.totalRoundTripTime;
          }
          break;
        default:
          return;
      }
    }.bind());
    stats.forEach(function(report) {
      switch(report.type) {
        case "track":
          if (report.hasOwnProperty("trackIdentifier")) {
            if (report.trackIdentifier.indexOf(localTrackIds.video) !== -1) {
              statsObject.video.local.frameHeight = report.frameHeight;
              statsObject.video.local.framesSent = report.framesSent;
              statsObject.video.local.frameWidth = report.frameWidth;
            }
            if (report.trackIdentifier.indexOf(remoteTrackIds.video) !== -1) {
              statsObject.video.remote.frameHeight = report.frameHeight;
              statsObject.video.remote.framesDecoded = report.framesDecoded;
              statsObject.video.remote.framesDropped = report.framesDropped;
              statsObject.video.remote.framesReceived = report.framesReceived;
              statsObject.video.remote.frameWidth = report.frameWidth;
            }
            if (report.trackIdentifier.indexOf(localTrackIds.audio) !== -1) {
              statsObject.audio.local.audioLevel = report.audioLevel;
            }
            if (report.trackIdentifier.indexOf(remoteTrackIds.audio) !== -1) {
              statsObject.audio.remote.audioLevel = report.audioLevel;
            }
          }
          break;
        case "codec":
          if (report.hasOwnProperty("id")) {
            if (report.id.indexOf(statsObject.audio.local.codecId) !== -1) {
              statsObject.audio.local.clockRate = report.clockRate;
              statsObject.audio.local.mimeType = report.mimeType;
              statsObject.audio.local.payloadType = report.payloadType;
            }
            if (report.id.indexOf(statsObject.audio.remote.codecId) !== -1) {
              statsObject.audio.remote.clockRate = report.clockRate;
              statsObject.audio.remote.mimeType = report.mimeType;
              statsObject.audio.remote.payloadType = report.payloadType;
            }
            if (report.id.indexOf(statsObject.video.local.codecId) !== -1) {
              statsObject.video.local.clockRate = report.clockRate;
              statsObject.video.local.mimeType = report.mimeType;
              statsObject.video.local.payloadType = report.payloadType;
            }
            if (report.id.indexOf(statsObject.video.remote.codecId) !== -1) {
              statsObject.video.remote.clockRate = report.clockRate;
              statsObject.video.remote.mimeType = report.mimeType;
              statsObject.video.remote.payloadType = report.payloadType;
            }
          }
          break;
        case "local-candidate":
          if (report.hasOwnProperty("id")) {
            if (report.id.indexOf(statsObject.connection.localCandidateId) !== -1) {
              statsObject.connection.localIp = report.ip;
              statsObject.connection.localPort = report.port;
              statsObject.connection.localPriority = report.priority;
              statsObject.connection.localProtocol = report.protocol;
              statsObject.connection.localType = report.candidateType;
              statsObject.connection.localRelayProtocol = report.relayProtocol;
            }
          }
          break;
        case "remote-candidate":
          if (report.hasOwnProperty("id")) {
            if (report.id.indexOf(statsObject.connection.remoteCandidateId) !== -1) {
              statsObject.connection.remoteIp = report.ip;
              statsObject.connection.remotePort = report.port;
              statsObject.connection.remotePriority = report.priority;
              statsObject.connection.remoteProtocol = report.protocol;
              statsObject.connection.remoteType = report.candidateType;
            }
          }
          break;
        default:
          return;
      }
    }.bind());
  }
  return statsObject;
}
function computeRate(newReport, oldReport, statName) {
  var newVal = newReport[statName];
  var oldVal = oldReport ? oldReport[statName] : null;
  if (newVal === null || oldVal === null) {
    return null;
  }
  return (newVal - oldVal) / (newReport.timestamp - oldReport.timestamp) * 1000;
}
function computeBitrate(newReport, oldReport, statName) {
  return computeRate(newReport, oldReport, statName) * 8;
}
function computeE2EDelay(captureStart, remoteVideoCurrentTime) {
  if (!captureStart) {
    return null;
  }
  var nowNTP = Date.now() + 2208988800000;
  return nowNTP - captureStart - remoteVideoCurrentTime * 1000;
}
;var Storage = function() {
};
Storage.prototype.getStorage = function(key, callback) {
  if (isChromeApp()) {
    chrome.storage.local.get(key, function(values) {
      if (callback) {
        window.setTimeout(function() {
          callback(values[key]);
        }, 0);
      }
    });
  } else {
    var value = localStorage.getItem(key);
    if (callback) {
      window.setTimeout(function() {
        callback(value);
      }, 0);
    }
  }
};
Storage.prototype.setStorage = function(key, value, callback) {
  if (isChromeApp()) {
    var data = {};
    data[key] = value;
    chrome.storage.local.set(data, callback);
  } else {
    localStorage.setItem(key, value);
    if (callback) {
      window.setTimeout(callback, 0);
    }
  }
};
function $(selector) {
  return document.querySelector(selector);
}
function queryStringToDictionary(queryString) {
  var pairs = queryString.slice(1).split("&");
  var result = {};
  pairs.forEach(function(pair) {
    if (pair) {
      pair = pair.split("=");
      if (pair[0]) {
        result[pair[0]] = decodeURIComponent(pair[1] || "");
      }
    }
  });
  return result;
}
function sendAsyncUrlRequest(method, url, body) {
  return sendUrlRequest(method, url, true, body);
}
function sendUrlRequest(method, url, async, body) {
  return new Promise(function(resolve, reject) {
    var xhr;
    var reportResults = function() {
      if (xhr.status !== 200) {
        reject(Error("Status=" + xhr.status + ", response=" + xhr.responseText));
        return;
      }
      resolve(xhr.responseText);
    };
    xhr = new XMLHttpRequest;
    if (async) {
      xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) {
          return;
        }
        reportResults();
      };
    }
    xhr.open(method, url, async);
    xhr.send(body);
    if (!async) {
      reportResults();
    }
  });
}
function requestIceServers(iceServerRequestUrl, iceTransports) {
  return new Promise(function(resolve, reject) {
    sendAsyncUrlRequest("POST", iceServerRequestUrl).then(function(response) {
      var iceServerRequestResponse = parseJSON(response);
      if (!iceServerRequestResponse) {
        reject(Error("Error parsing response JSON: " + response));
        return;
      }
      if (iceTransports !== "") {
        filterIceServersUrls(iceServerRequestResponse, iceTransports);
      }
      trace("Retrieved ICE server information.");
      resolve(iceServerRequestResponse.iceServers);
    }).catch(function(error) {
      reject(Error("ICE server request error: " + error.message));
      return;
    });
  });
}
function parseJSON(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    trace("Error parsing json: " + json);
  }
  return null;
}
function filterIceServersUrls(config, protocol) {
  var transport = "transport=" + protocol;
  var newIceServers = [];
  for (var i = 0; i < config.iceServers.length; ++i) {
    var iceServer = config.iceServers[i];
    var newUrls = [];
    for (var j = 0; j < iceServer.urls.length; ++j) {
      var url = iceServer.urls[j];
      if (url.indexOf(transport) !== -1) {
        newUrls.push(url);
      } else {
        if (url.indexOf("?transport=") === -1) {
          newUrls.push(url + "?" + transport);
        }
      }
    }
    if (newUrls.length !== 0) {
      iceServer.urls = newUrls;
      newIceServers.push(iceServer);
    }
  }
  config.iceServers = newIceServers;
}
function setUpFullScreen() {
  if (isChromeApp()) {
    document.cancelFullScreen = function() {
      chrome.app.window.current().restore();
    };
  } else {
    document.cancelFullScreen = document.webkitCancelFullScreen || document.mozCancelFullScreen || document.cancelFullScreen;
  }
  if (isChromeApp()) {
    document.body.requestFullScreen = function() {
      chrome.app.window.current().fullscreen();
    };
  } else {
    document.body.requestFullScreen = document.body.webkitRequestFullScreen || document.body.mozRequestFullScreen || document.body.requestFullScreen;
  }
  document.onfullscreenchange = document.onfullscreenchange || document.onwebkitfullscreenchange || document.onmozfullscreenchange;
}
function isFullScreen() {
  if (isChromeApp()) {
    return chrome.app.window.current().isFullscreen();
  }
  return !!(document.webkitIsFullScreen || document.mozFullScreen || document.isFullScreen);
}
function fullScreenElement() {
  return document.webkitFullScreenElement || document.webkitCurrentFullScreenElement || document.mozFullScreenElement || document.fullScreenElement;
}
function randomString(strLength) {
  var result = [];
  strLength = strLength || 5;
  var charSet = "0123456789";
  while (strLength--) {
    result.push(charSet.charAt(Math.floor(Math.random() * charSet.length)));
  }
  return result.join("");
}
function isChromeApp() {
  return typeof chrome !== "undefined" && typeof chrome.storage !== "undefined" && typeof chrome.storage.local !== "undefined";
}
function calculateFps(videoElement, decodedFrames, startTime, remoteOrLocal, callback) {
  var fps = 0;
  if (videoElement && typeof videoElement.webkitDecodedFrameCount !== undefined) {
    if (videoElement.readyState >= videoElement.HAVE_CURRENT_DATA) {
      var currentTime = (new Date).getTime();
      var deltaTime = (currentTime - startTime) / 1000;
      var startTimeToReturn = currentTime;
      fps = (videoElement.webkitDecodedFrameCount - decodedFrames) / deltaTime;
      callback(videoElement.webkitDecodedFrameCount, startTimeToReturn, remoteOrLocal);
    }
  }
  return parseInt(fps);
}
function trace(text) {
  if (text[text.length - 1] === "\n") {
    text = text.substring(0, text.length - 1);
  }
  if (window.performance) {
    var now = (window.performance.now() / 1000).toFixed(3);
    console.log(now + ": " + text);
  } else {
    console.log(text);
  }
}
;var apprtc = apprtc || {};
apprtc.windowPort = apprtc.windowPort || {};
(function() {
  var port_;
  apprtc.windowPort.sendMessage = function(message) {
    var port = getPort_();
    try {
      port.postMessage(message);
    } catch (ex) {
      trace("Error sending message via port: " + ex);
    }
  };
  apprtc.windowPort.addMessageListener = function(listener) {
    var port = getPort_();
    port.onMessage.addListener(listener);
  };
  var getPort_ = function() {
    if (!port_) {
      port_ = chrome.runtime.connect();
    }
    return port_;
  };
})();

