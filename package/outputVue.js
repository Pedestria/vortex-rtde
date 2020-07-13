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
  }, [_vm._v("\n   " + _vm._s(_vm.message) + "\n  ")]), _vm._v(" "), _c("button", {
    on: {
      click: _vm.handleClick
    }
  }, [_vm._v("Vue Button")]), _vm._v(" "), _c("img", {
    attrs: {
      src: require("./img/1200px-React-icon.png")
    }
  })]);
};

//
//
//
//
//
//
//
//
//
//
import NewComponent from './newComponent';
export default {
  data: function data() {
    return {
      message: 'Hello From Vortex and Vue.js (File Component) SCOPED'
    };
  },
  methods: {
    handleClick: function handleClick() {
      console.log('Vue Button Clicked!!');
    }
  },
  components: {
    NewComponent: NewComponent
  },
  render: render,
  _scopeId: "data-v-73de5943-5f20-44c7-9ddf-3fbd98aba6ae"
};

if (!gLOBAL_STYLES.includes("style1")) {
  var style = document.createElement('style');
  style.innerHTML = "\n.col[data-v-73de5943-5f20-44c7-9ddf-3fbd98aba6ae]{\r\n    font-family: Avenir;\r\n    font-size: 50px;\r\n    color:red;\n}\nbutton[data-v-73de5943-5f20-44c7-9ddf-3fbd98aba6ae] {\r\n    font-family: Avenir;\r\n    font-size: 30px;\n}\r\n\r\n";
  document.head.appendChild(style);
  gLOBAL_STYLES.push("style1");
}