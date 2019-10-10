import React,{Component} from 'react';
import RoomList from "./RoomList"
import './App.css';

class Result extends Component{
  render = () => {
    let rooms = [{name:"1"},{name:"2"},{name:"3"},{name:"4"}];
    return(
      <div>
        <RoomList rooms={rooms} />
      </div>
    )
  }
}

export default Result;
