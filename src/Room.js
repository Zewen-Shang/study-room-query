import React,{Component} from 'react';
import PropTypes from "prop-types";
import {Icon,Avatar,Card} from "antd";
import New from "./new.jpg";
import Old from "./old.jpg";
import './App.css';

class Room extends Component{
  static propTypes = {
    room:PropTypes.object.isRequired,
  }
  render = () => {
    let {Meta} = Card;
    return(
      <div className="room">
          <Card hoverable className="card" cover={<img alt="example" src={New} />}>
            <Meta avatar={<Avatar className="avatar">45</Avatar>} title="203教室" />
          </Card>
      </div>
    )
  }
}

export default Room;
