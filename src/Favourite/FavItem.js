import React,{Component} from "react"
import {Icon} from "antd";
class FavItem extends Component{
    //点击左侧时，打开课表
    left = () => {
        this.props.left(this.props.item.classroom);
    }

    right = () => {
        console.log(this.props.item.classroom_ID); 
        this.props.right(this.props.item.on,this.props.item.classroom_ID);
    }
    render = () => {
        return(
            <div className="fav-item">
                <div onClick={this.left} style={{float:"left"}}>
                    {this.props.item.canuse
                    ?<Icon style={{color:"#199bd5"}} type="check-circle" />
                    :<Icon style={{color:"#ce3d3a"}} type="stop" />
                    }
                    {"    "+this.props.item.classroom}
                </div>
                <div style={{float:"right"}}><Icon onClick={this.right} style={{color:"#199bd5"}} type="star" theme={this.props.item.on?"filled":"outlined"} /></div>
            </div>
        )
    }
}

export default FavItem