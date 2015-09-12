var socket = io();
//var Data = React.createClass({
//});
var User = React.createClass({
  render: function(){
    var divs = [];
    for(var i = 0; i < this.state.data.length; i++){
      var item = this.state.data[i];
      var date = new Date(item.time);
      divs.push(<div key={i}>{date.toString()} {item.bpm}</div>);
    }
    return (<div>
      <div>{this.props.name}:</div>
          <div>{divs}</div>
        </div>);
  },
  componentWillMount: function(){
    var self = this;
    socket.on(self.props.name,function(data){
      self.setState({data:data});
    });
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
