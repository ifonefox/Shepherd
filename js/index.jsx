var Root = React.createClass({
  render: function(){
    var data = JSON.stringify(this.props.data, null, 2);
    return <div>{data}</div>;
  }
});


window.onload = function(){
  var socket = io();
  socket.on("update",function(data){
    React.render(<Root data={data}/>, document.body);
  });
}
