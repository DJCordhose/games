var util = {};
(function () {
    "use strict";
    function _extends(_sub, _super) {
        _sub.prototype = Object.create(_super.prototype);
        _sub.prototype.constructor = _sub;
        _sub._super = _super.prototype;
    }

    function _mixin(_sub, _super) {
        for (var p in _super.prototype) {
            if (p === 'constructor') {
                continue;
            }
            _sub.prototype[p] = _super.prototype[p];
        }
    }

    util._extends = _extends;
    util._mixin = _mixin;
})();
