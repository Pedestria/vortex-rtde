import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import React, { Component } from 'react';

var OtherThing = /*#__PURE__*/function (_Component) {
  _inherits(OtherThing, _Component);

  var _super = _createSuper(OtherThing);

  function OtherThing() {
    _classCallCheck(this, OtherThing);

    return _super.apply(this, arguments);
  }

  _createClass(OtherThing, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("h2", null, "Hello From Other Thing!!!");
    }
  }]);

  return OtherThing;
}(Component);

export { OtherThing as default };