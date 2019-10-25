import React,{Component} from 'react';
import {Row,Col,Empty} from "antd";
import Room from "./Room";
import PropTypes from "prop-types";
import './App.css';

class RoomList extends Component{

  render = () => {
    return(
      <div className="list">
        <Row type="flex" justify="space-around">
          {this.props.classrooms.length !== 0
          ?this.props.classrooms.map((classroom,key) => {
            return <Col span={7} key={key}><Room RoomonClick={this.props.RoomonClick} key={key} classroom = {classroom} /></Col>
          })
          :<Empty />}
        </Row>
      </div> 

    )
  }
}

export default RoomList;
