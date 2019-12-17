import React,{Component} from 'react';
import PropTypes from "prop-types";
//import {Link} from "react-router-dom"
import {Button} from "antd";

class Room extends Component{
  static propTypes = { 
    classroom:PropTypes.object.isRequired,
  }

  handleButtonClick = () => {
    //console.log(this.props.classroom)
    this.props.RoomonClick(this.props.classroom.classroom_id)
  }

  render = () => {
    return(
      <div className="room">
        <Button onClick={this.handleButtonClick} className={this.props.classroom.canuse?"room-button-on":"room-button-off"}>
          {this.props.classroom.classroom}
        </Button>
      </div>
    )
  }
}

export default Room;
