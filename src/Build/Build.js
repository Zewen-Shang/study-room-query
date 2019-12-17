import React, { Component } from "react";
import logo from "../static/教学楼.png"

class Build extends Component{

    handleBuildonClick = () => {
        this.props.onChange(this.props.build)
    }

    render = () => {
        return(
        <div className="build" onClick={this.handleBuildonClick}>
            <img  src={logo} />
            {this.props.build.building}
        </div>
        )
    }
}

export default Build