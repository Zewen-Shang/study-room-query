import React,{Component} from 'react';
import Build from "./Build"
import {Row,Col,Empty} from "antd";

class BuildList extends Component{

handleBuildonClick = (num) => {
    this.props.onChange(num);
}
render = () => {
    return(
    <div className="buildlist">
        <Row gutter={[16,16]} type="flex" >
        {this.props.builds.length === 0
        ?<Empty />
        :
            this.props.builds.map((build,key) => {
            return <Col key={key} span={6} >
                <Build week={this.props.week} onChange={this.handleBuildonClick.bind(this)} build={build} key={key} />
            </Col>
        })}
        </Row>
    </div>
    )
}
}

export default BuildList;
