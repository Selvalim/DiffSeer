import React from 'react';
import { Card, Tooltip, Button } from 'antd';
import Chart from '../views/project-timeline';
import './view-comp-style.less';
import { connect } from "react-redux";
import {ReloadOutlined } from '@ant-design/icons';
import {updateSelectedDate, updateTimeSpan} from '../store/actions';

class View extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      resetcheck:'default'
    };
    this.resetButton = this.resetButton.bind(this) 
  }

  componentDidMount() {
    const { selectedDate } = this.props;
    Chart.init(this.container, this.props.dispatch);
  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedDate } = this.props;
    if(prevProps.selectedDate !== selectedDate){
      Chart.update(selectedDate, this.props.dispatch);
    }
  }
  resetButton() {
    this.props.dispatch(updateSelectedDate([]))
  }

  render() {
    return (
      <Card className="view view-a" title="TimeLine" extra={
        <div>                
                <Tooltip title="reset">
                  <Button shape="circle" type={this.state.resetcheck} onClick={this.resetButton} icon={<ReloadOutlined  style={{color:"#3c374a"}} />} size={'small'} ></Button>
                </Tooltip>
        </div>
      }>
        <div className="view-container" ref={ ref => this.container = ref }></div>
        <div className="tooltip"></div>
      </Card>
    );
  }
}
const mapStateToProps = (state, props) => ({
  selectedDate:state.selectedDate
});

const mapDispatchToProps = dispatch => ({
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(View);