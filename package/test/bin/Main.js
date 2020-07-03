import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import React, { Component, Suspense } from 'react';
import ReactDOM from 'react-dom';
var OtherThing = /*#__PURE__*/React.lazy(function () {
  return import('./Com.jsx');
});
import './styles.css';
import Logo from '../img/1200px-React-icon.png';

var MainComponent = /*#__PURE__*/function (_Component) {
  _inherits(MainComponent, _Component);

  var _super = _createSuper(MainComponent);

  function MainComponent() {
    _classCallCheck(this, MainComponent);

    return _super.apply(this, arguments);
  }

  _createClass(MainComponent, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Test WebApp"), /*#__PURE__*/React.createElement("p", null, "I am a Paragraph Describing Stuff!"), /*#__PURE__*/React.createElement(Suspense, {
        fallback: /*#__PURE__*/React.createElement("h1", null, "Loading...")
      }, /*#__PURE__*/React.createElement(OtherThing, null)), /*#__PURE__*/React.createElement("img", {
        src: Logo
      }));
    }
  }]);

  return MainComponent;
}(Component);

ReactDOM.render( /*#__PURE__*/React.createElement(MainComponent, null), document.getElementById('root'));