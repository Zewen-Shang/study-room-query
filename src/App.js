import React, { Component } from 'react';
import {HashRouter,Route,Switch,Link} from "react-router-dom";
import Search from "./Search";
import Result from "./Result"
import {Layout,Icon,Spin} from "antd";
import './App.css';
import 'antd/dist/antd.css';
import fetchData from "./tool"
const {Header,Content,Footer} = Layout;


class App extends Component{

    state={
        builds:[],
        onFetch:false,
        buildsErr:null,
    }

    componentDidMount = async () => {
        this.setState({onFetch:true});
        let builds = [],buildsErr = null;
        try{
            builds = await fetchData("getBuildingList.php",{method:"GET"});
        }catch(err){
            buildsErr = err;
        }
        this.setState({builds,buildsErr,onFetch:false});
    }

    handleRefreshClick = () => {
        window.location.reload();
    } 

    render = () => {
        return (
        <HashRouter>
        <Layout>
            <Header className="header">
                <div className="header-container">
                    <div style={{float:"left"}} >自习室查询</div>
                    <div className="header-item float-right" >
                        <a href="https://selfstudy.twt.edu.cn/api/login.php">
                            <Icon type="user" />
                        </a>
                    </div>
                    <div className="header-item float-right" >
                        <Link to="/">
                            <Icon type="home" />
                        </Link>
                    </div>
                    <div className="header-item float-right" ><Icon onClick={this.handleRefreshClick} type="reload" /></div>
                </div>
            </Header>
            <Content className="content">
                {this.state.onFetch
                ?<div className="spin"><Spin/></div>
                :this.state.buildsErr
                 ?this.state.buildsErr.message
                 :
                    <Switch>
                        <Route exact path="/" render={() => <Search builds={this.state.builds} />} />
                        <Route path="/result/:params" render={() => <Result builds={this.state.builds} />}/>
                    </Switch>}
            </Content>
            <Footer className="footer">
                Copyright © 2019 TWT Studio.<br />All rights reserved
            </Footer>
        </Layout>
        </HashRouter>
    );
    }
}

export default App;
