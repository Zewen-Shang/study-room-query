import React,{Component} from 'react';
import {Link} from "react-router-dom";
import {Checkbox,Radio,Button,Icon,Row,Col,Divider} from "antd";
import './App.css';

class Search extends Component{
  state = {campus:"old"}

  handleRadioChange = (e) =>{
    console.log(e);
    this.setState({campus:e.target.value})
  };

  componentWillMount = () => {
    let url = "https://vote.twtstudio.com/getAvailableClassroom.php?term=1&week=1&day=1&course=3";

    fetch(url,{
      method: 'GET',
      mode: 'no-cors',
  }).then((res) =>{
        console.log(res)
    });
  }

  render = () => {
    return(
      <React.Fragment>
        <div className="search-box">
          <div className="search-title">
            <Icon type="bank" /> 校区
          </div>
          <Radio.Group value={this.state.campus} onChange={this.handleRadioChange} className="search-group">
            <Row>
              <Col span={12}>
                <Radio value='new'>北洋园</Radio>
              </Col>
              <Col span={12}>
                <Radio value='old'>卫津路</Radio>
              </Col>
            </Row>
          </Radio.Group>
          <Divider />

          <div className="search-title">
            <Icon type="read" /> 教室
          </div>
          {this.state.campus == "new"
          ? <Checkbox.Group className="search-group">
              <Row>
                <Col span={8}>
                  <Checkbox value='33'>33教</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value='45'>45教</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value='46'>46教</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>

          : <Checkbox.Group className="search-group">
              <Row>
                <Col span={8}>
                  <Checkbox value='23'>23教</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value='26'>26教</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value='13'>13教</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
            }
          
          <Divider />
          <div className="search-title">
            <Icon type="clock-circle" /> 时间
          </div>
          <Checkbox.Group className="search-group">
            <Row>
              <Col span={8}>
                <Checkbox value='mor'>上午</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value='aft'>下午</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value='eve'>晚上</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </div>
        <div className="search-button-container">
          <Button className="search-button">
            <Link to='/result' >搜索</Link>
          </Button>
        </div>
      </React.Fragment>
    )
  }
}

export default Search;
