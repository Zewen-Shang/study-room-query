import React,{Component} from 'react';
import {Row,Col,Empty} from "antd";
import Room from "./Room";
import PropTypes from "prop-types";

class RoomList extends Component{

  render = () => {
    return(
      <div className="list">
        <Row gutter={[16]} type="flex" justify="start">
          {this.props.classrooms
          ?this.props.classrooms.map((classroom,key) => {
            return <Col span={8} key={key}><Room RoomonClick={this.props.RoomonClick} key={key} classroom = {classroom} /></Col>
          })
          :<Empty />}
        </Row>
      </div> 

    )
  }
}

export default RoomList;
