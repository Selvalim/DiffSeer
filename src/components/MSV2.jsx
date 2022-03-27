import React from 'react';
import { Card, Tooltip, Button, Switch,Slider } from 'antd';
import Chart from '../views/msv2-chart';
import './view-comp-style.less';
import { connect } from "react-redux";
import {ReloadOutlined ,RetweetOutlined } from '@ant-design/icons';
import {reset, updateEdgeReorder, updateNeedOrder} from '../store/actions';


class View extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      resetcheck:'default',
      msvSwitch:true,
      kelpSwitch:false,
      streamSwitch:false,
      unfoldSwitch:true,
      msvnodeSwitch:true,
      threshold:50,
      orderweight:50,
      maxmapping:100,
      colorSwitch:false,
    };
    this.resetButton = this.resetButton.bind(this) 
    this.unfoldSwitch = this.unfoldSwitch.bind(this) 
    this.nodeReorder = this.nodeReorder.bind(this) 
    this.edgeReorder = this.edgeReorder.bind(this) 
    this.streamSwitch = this.streamSwitch.bind(this) 
    this.MSVSwitch = this.MSVSwitch.bind(this)
  }

  componentDidMount() {
    const { timeSpan ,nodeOrder} = this.props;
    Chart.init(this.container,timeSpan, nodeOrder, this.props.dispatch);
  }

  componentDidUpdate(prevProps, prevState) {
    const { timeSpan, unfoldDay,unfoldDiff,nodeOrder,focusSpan,needOrder} = this.props;
    console.log(needOrder,this.props.needOrder)
    if(prevProps.msvSwitch !== this.state.msvSwitch  || prevProps.needOrder !== needOrder || prevProps.timeSpan !== timeSpan || prevProps.unfoldSwitch !== this.state.unfoldSwitch || prevProps.unfoldDay !== unfoldDay || prevProps.nodeOrder.toString() !== nodeOrder.toString()){    
      Chart.update(timeSpan,unfoldDay,unfoldDiff,nodeOrder,focusSpan,needOrder,this.state.threshold,this.state.maxmapping,this.state.orderweight,this.state.unfoldSwitch, this.state.msvSwitch,this.state.kelpSwitch ,this.state.colorSwitch,this.props.dispatch);
    }
  }
  resetButton() {
    this.props.dispatch(reset())
  }
  unfoldSwitch(checked){
    this.setState({
      unfoldSwitch:checked,
    })
  }
  colorSwitch(checked){
    this.setState({
      colorSwitch:checked,
    })
  }
  streamSwitch(checked){
    this.setState({
      streamSwitch:checked,
    })
  }
  nodeReorder(){
    this.props.dispatch(updateNeedOrder(true))
  }
  MSVSwitch(checked){
    this.setState({
      msvSwitch:checked,
    })
  }
  KelpSwitch(checked){
    this.setState({
      kelpSwitch:checked,
    })
  }
  msvnodeSwitch(checked){
    this.setState({
      msvnodeSwitch:checked,
    })
  }
  StrongAfterChange(value){
    this.setState({
      threshold:value,
    })
  }
  MaxAfterChange(value){
    this.setState({
      maxmapping:value,
    })
  }
  OrderWeight(value){
    this.setState({
      orderweight:value,
    })
  }
  edgeReorder(checked){
    if(checked){
      this.props.dispatch(updateEdgeReorder(true))
    }else{
      this.props.dispatch(updateEdgeReorder(false))
    }
  }

  render() {
    return (
      <Card className="view view-i" title="Nested Matrix Design" extra={

        <div>   
                <div style={{float:"left"}}> &ensp; Max: &ensp; </div>
                <div style={{width:"150px",float:"left"}}>

                  <Tooltip title="MaxMapping">
                    <Slider defaultValue={100} onAfterChange={(value)=>this.MaxAfterChange(value)} />
                  </Tooltip>  
                </div>
                <div style={{float:"left"}}> &ensp; Threshold: &ensp; </div>
                <div style={{width:"150px",float:"left"}}>

                  <Tooltip title="Strong Threshold">
                    <Slider defaultValue={50} onAfterChange={(value)=>this.StrongAfterChange(value)} />
                  </Tooltip>  
                </div>

                <div style={{float:"left"}}>  &ensp; OrderWeight: &ensp;  </div>
                <div style={{width:"150px",float:"left"}}>

                  <Tooltip title="OrderWeight">
                    <Slider defaultValue={50} onAfterChange={(value)=>this.OrderWeight(value)} />
                  </Tooltip>  
                </div>
                <div style={{float:"left"}}>
                &ensp; Reorder: &ensp;
                <Tooltip title="node Reorder">
                  <Button shape="circle" type={this.state.resetcheck} onClick={this.nodeReorder} icon={<RetweetOutlined  style={{color:"#3c374a"}} />} size={'small'} ></Button>
                </Tooltip>  
                &ensp; UnfoldSwitch: &ensp; 
                <Tooltip title="Choose to unfold difference or original graph">
                  <Switch checkedChildren="diff" unCheckedChildren="origin" defaultChecked onChange={(checked)=>this.unfoldSwitch(checked)}/>
                </Tooltip>
                &ensp; MatrixSwitch: &ensp; 
                <Tooltip title="Display Matrix or not">
                  <Switch checkedChildren="on" unCheckedChildren="off" defaultChecked onChange={(checked)=>this.MSVSwitch(checked)}/>
                </Tooltip> 
                &ensp; MaskSwitch: &ensp; 
                <Tooltip title="Display Difference Mask or not">
                  <Switch checkedChildren="on" unCheckedChildren="off" onChange={(checked)=>this.KelpSwitch(checked)}/>
                </Tooltip>   

                &ensp; MaskFocus: &ensp; 
                <Tooltip title="Choose the focus mode of Difference Mask">
                  <Switch checkedChildren="weight" unCheckedChildren="degree" onChange={(checked)=>this.colorSwitch(checked)}/>
                </Tooltip>
                &ensp; Reset: &ensp; 
                <Tooltip title="reset">
                  <Button shape="circle" type={this.state.resetcheck} onClick={this.resetButton} icon={<ReloadOutlined  style={{color:"#3c374a"}} />} size={'small'} ></Button>
                </Tooltip>

        </div>
      </div>
      }>
        {/* <div className="view-container" ref={ ref => this.container = ref }></div> */}
<div className="view-container" ref={ref => this.container = ref} style={{ position:"relative" }}>
          <div style={{ width: '4%', display: 'flex', flexDirection: 'Column', justifyContent: 'flex-start', alignItems: 'center', position: "absolute", left: "10px", top: "12px" }}>
            <svg id="scale-diff" />
            <svg id="scale-org" style={{ margin: "5 0" }}/>
          </div>
        </div>
        <div className="tooltip"></div>
      </Card>
    );
  }
}
const mapStateToProps = (state, props) => ({
  timeSpan:state.timeSpan,
  unfoldDay:state.unfoldDay,
  unfoldDiff:state.unfoldDiff,
  nodeOrder:state.nodeOrder,
  focusSpan:state.focusSpan,
  needOrder:state.needOrder,
  unfoldSwitch:state.unfoldSwitch,
  MSVorder:state.MSVorder,
  edgeReorder:state.edgeReorder,
  streamSwitch:state.streamSwitch,
});

const mapDispatchToProps = dispatch => ({
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(View);