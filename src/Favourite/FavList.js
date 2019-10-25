import React,{Component} from "react"
import FavItem from "./FavItem"
import {Empty} from "antd";
class FavList extends Component{
    render = () => {
        return(
            <div style={{width:"100%"}}>
                {this.props.items ?this.props.items.map(((item,key) => {
                    return <FavItem item={item} key={key} left={this.props.left} right={this.props.right}/>
                }))
            :<Empty />}
            </div>
        )
    }
}

export default FavList