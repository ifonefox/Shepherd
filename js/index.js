"use strict";

var Root = React.createClass({
  displayName: "Root",

  render: function render() {
    var data = JSON.stringify(this.props.data, null, 2);
    return React.createElement(
      "div",
      null,
      data
    );
  }
});

window.onload = function () {
  var socket = io();
  socket.on("update", function (data) {
    React.render(React.createElement(Root, { data: data }), document.body);
  });
};
//# sourceMappingURL=index.js.map
