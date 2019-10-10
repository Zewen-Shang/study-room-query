import React,{Component} from 'react';
import {Row,Col} from "antd";
import Room from "./Room";
import PropTypes from "prop-types";
import './App.css';

class RoomList extends Component{
  static propTypes = {
    rooms:PropTypes.array.isRequired,
  }
  render = () => {
    return(
      <div className="list">
        <Row type="flex" justify="space-around">
          {this.props.rooms.map((room,key) => {
            return <Col span={11}><Room room = {room} key={key} /></Col>
          })}
        </Row>
      </div>

    )
  }
}

export default RoomList;
