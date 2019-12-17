import React,{Component} from "react"
import FavItem from "./FavItem"
import {Empty} from "antd";
class FavList extends Component{
    render = () => {
        return(
            <div style={{width:"100%"}}>
                {/*记得删掉*/}
                {/*<FavItem item={{on:true,classroom_ID:123,classroom:"33楼192"}} key={-5} left={this.props.left} right={this.props.right}/>*/}
                {this.props.items.length !== 0 ?this.props.items.map(((item,key) => {
                    return <FavItem item={item} key={key} left={this.props.left} right={this.props.right}/>
                }))
            :<Empty />}
            </div>
        )
    }
}

export default FavList