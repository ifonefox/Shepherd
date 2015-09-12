var socket = io();
var OldUser = React.createClass({
  render: function(){
    var divs = [];
    for(var i = 0; i < this.state.data.length; i++){
      var data = this.state.data[i];
      var date = new Date(data.time);
      divs.push(<div key={i}>{date.toString()}: {data.bpm}</div>);
    }
    return (<div>
      <div>{this.props.name}:</div>
        <div>{divs}</div>
        </div>);
  },
  componentDidMount: function(){
    socket.on(this.props.name,function(data){
      this.setState({data:data});
    }.bind(this));
    socket.emit(this.props.name);
  },
  getInitialState: function(){
    return {data:[]};
  }
});
var User = React.createClass({
  render: function(){
    return (<div>
      <div>{this.props.name}:</div>
      <div className="graph" ref="canvas"></div>
        </div>);
  },
  componentDidMount: function(){
    socket.on(this.props.name,function(data){
      var ctx = React.findDOMNode(this.refs.canvas);
      var x = [];
      var y = [];
      for(var i = 0; i < data.length; i++){
        x.push(data[i].time);
        y.push(data[i].bpm);
      }
      var chart = c3.generate({
        bindto: ctx,
        data: {
          x: 'x',
          columns: [x,y]
        }
      });
    }.bind(this));
    console.log(this.props);
    socket.emit(this.props.name);

  },
  componentWillReceiveProps(nextProps){
    console.log(nextProps);
  },
  getInitialState: function(){
    return {data:[]};
  }
});
var Root = React.createClass({
  render: function(){
    var divList = []
    for(var i = 0; i < this.state.names.length; i++){
      var name = this.state.names[i];
      console.log(name);
      divList.push(<OldUser name={name} key={i}/>);
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
