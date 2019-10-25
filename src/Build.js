import React, { Component } from "react";


class Build extends Component{

    handleBuildonClick = () => {
        this.props.onChange(this.props.build)
    }

    render = () => {
        return(
        <div onClick={this.handleBuildonClick} className={"build-container build-container-on"}>
            {this.props.build.building}
        </div>
        )
    }
}

export default Build