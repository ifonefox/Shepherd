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
    //return (<div>
      //<div>{this.props.name}:</div>
      //<div className="graph" ref="canvas"></div>
        //</div>);
    var className="card";
    if(this.state.red){
      className="card red";
    }
    return (<div className={className} ref="card">
      <div className="card-img-top graph" ref="canvas"></div>
      <div className="card-block">
        <h4 className="card-title name">{this.props.name}</h4>
        <h5 className="card-title bpm" ref="bpm">~~ bpm</h5>
      </div>
    </div>);
  },
  componentDidMount: function(){
    var ctx = React.findDOMNode(this.refs.canvas);
    var x = ['x'];
    var y = ['bpm'];
    var pad = 20;
    this.chart = c3.generate({
      bindto: ctx,
      size: {
        width: 420,
        height: 320
      },
      padding: {
        top: pad,
        bottom: pad,
        right: pad-10,
        left: pad+10
      },
      legend:{
        //hide:true
        show:false
      },
      color:{
        pattern:["#888888"]
      },
      data: {
        x: 'x',
        //x_format: '%Y-%m-%d %H:%M:%S',
        columns: [x,y]
      },
      axis:{
        x: {
          type:'timeseries',
          tick:{
            culling:{
              max:5
            },
            count:5,
            format: function(raw){
              var hours = raw.getHours();
              var minutes = raw.getMinutes()
              if(minutes < 10){
                minutes = "0" + minutes.toString();
              }
              var seconds = raw.getSeconds()
              if(seconds < 10){
                seconds = "0" + seconds.toString();
              }
              var time = hours + ":" + minutes + ":" + seconds;
              return time
            }
          }
        }
      }
    });
    socket.on(this.props.name,function(data){
      if(typeof(this.newest) === "undefined" || this.newest.t !== data[data.length-1].time ||
          this.newest.l !== data.length){
        this.newest = {};
        this.newest.t = data[data.length-1].time;
        this.newest.l = data.length;
        if(data.length !== 0){
          var bpm = data[data.length-1].bpm;
          var node = React.findDOMNode(this.refs.bpm)
          if(node !== null){
            node.textContent=bpm.toString() + " bpm";
          }
        }
        var x = ['x'];
        var y = ['y'];
        var red = false;
        for(var i = 0; i < data.length; i++){
          var date = new Date(data[i].time);
          //date = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
          x.push(date);
          y.push(data[i].bpm);
          if(data[i].bpm >= 90){
            red = true;
          }
        }
        this.setState({red:red});
        this.chart.load({
          columns:[x,y]
        });
        var now = new Date();
        var before = new Date(now - (1000 * 5 * 60));
        this.chart.axis.max({x:now});
        this.chart.axis.min({x:before});
      }
    }.bind(this));
    socket.emit(this.props.name);

  },
  getInitialState: function(){
    return {data:[],red:false};
  }
});
var Root = React.createClass({
  render: function(){
    var divList = []
    for(var i = 0; i < this.state.names.length; i++){
      var name = this.state.names[i];
      divList.push(<User name={name} key={i}/>);
    }
    return (<div className="">
      <div className="card-columns">
        {divList}
      </div>
      </div>);
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
  React.render(<Root />, document.getElementById("root"));
  //});
}
