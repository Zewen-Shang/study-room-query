import React,{Component} from 'react';
import Build from "./Build"
import {Row,Col} from "antd";
//import PropTypes from "prop-types"
import './App.css';

class BuildList extends Component{
  // state={buildSelect:[]}

  handleBuildonClick = (num) => {
    // let buildSelect = [];
    // let flag = true;
    // for(let i=0;i<this.state.buildSelect.length;i++){
    //   if(this.state.buildSelect[i] !== num){
    //     buildSelect.push(this.state.buildSelect[i]);
    //   }else{
    //     flag = false;
    //   }
    // }
    // if(flag){
    //   buildSelect.push(num);
    // }
    // this.props.onChange(buildSelect); 
    // this.setState({buildSelect});
    this.props.onChange(num);
  }
  render = () => {
    return(
      <React.Fragment>
        <Row type="flex" justify="space-around">
          {this.props.builds.map((build,key) => {
            return <Col span={10} >
                <Build onChange={this.handleBuildonClick.bind(this)} build={build} key={key} />
              </Col>
          })}
        </Row>
      </React.Fragment>
    )
  }
}

export default BuildList;
