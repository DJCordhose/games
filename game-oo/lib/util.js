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
        if (typeof _sub._mixins === 'undefined') {
            _sub._mixins = [];
        }
        _sub._mixins.push(_super);
    }

    function _hasMixin(_sub, _super) {
        return typeof _sub._mixins !== 'undefined' && _sub._mixins.indexOf(_super) !== -1;
    }

    function _isSubtype(_sub, _super) {
        return _sub instanceof _super || _hasMixin(_sub, _super);
    }

    util._extends = _extends;
    util._mixin = _mixin;
    util._hasMixin = _hasMixin;
    util._isSubtype = _isSubtype;
})();
