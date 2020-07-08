var render = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c("div", {
    attrs: {
      id: "confusing"
    }
  }, [_c("div", {
    staticClass: "col"
  }, [_vm._v("\r\n      " + _vm._s(_vm.message) + "\r\n  ")])]);
};

//
//
//
//
//
//
//
//
shuttle_exports.default = {
  data: function data() {
    return {
      message: 'Hello From Vortex and Vue.js (File Component) SCOPED'
    };
  },
  render: render
};

if (!gLOBAL_STYLES.includes("style1")) {
  var style = document.createElement('style');
  style.innerHTML = "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\r\n\r\n#confusing .col{\r\n    font-family: Avenir;\r\n    font-size: 50px;\r\n    color:red;\r\n}\r\n\r\n";
  document.head.appendChild(style);
  gLOBAL_STYLES.push("style1");
}