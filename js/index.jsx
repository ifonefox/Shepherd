var socket = io();
var User = React.createClass({
  render: function(){
    return <div>{this.props.name}: {this.state.data}</div>;
  },
  componentWillMount: function(){
    var self = this;
    socket.on(self.props.name,function(data){
      console.log(self.props.name, data);
      self.setState({data:data});
    });
    console.log("emitting "+this.props.name);
    socket.emit(self.props.name);
  },
  getInitialState: function(){
    return {data:[]};
  }
});
var Root = React.createClass({
  render: function(){
    var divList = []
    for(var i = 0; i < this.state.names.length; i++){
      divList.push(<User name={this.state.names[i]} key={i} />);
    }
    return <div>{divList}</div>;
  },
  componentWillMount: function(){
    var self = this;
    socket.on("names",function(names){
      self.setState({names:names});
    });
  },
  getInitialState: function(){
    return ({names:[]});
  }
});


window.onload = function(){
  //socket.on("names",function(data){
  React.render(<Root />, document.body);
  //});
}
