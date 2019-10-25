import React, { Component } from 'react';
import {HashRouter,Route,Switch} from "react-router-dom";
import Search from "./Search";
import Result from "./Result"
import {Layout,Icon} from "antd";
import './App.css';
import 'antd/dist/antd.css';
import favorooms from "./static/favrooms";
const {Header,Content,Footer} = Layout;


class App extends Component{
    state={
        islog:false,
    };
    componentDidMount = async () => {
        this.setState({favonfetch:true})
        let tmperr = null;
        let favrooms = [];
        try{
          favrooms = favorooms.data;
        }catch(err){
          tmperr = err;
        }
    
        if(!tmperr){
            this.setState({islog:true})
        }else{
            this.setState({islog:false})
        }
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
                        <a href="https://selfstudy.twtstudio.com/api/login.php">
                            {this.state.islog
                            ?<Icon type="user" />
                            :"登录"}
                        </a>
                    </div>
                    <div className="header-item float-right" ><Icon onClick={this.handleRefreshClick} type="reload" /></div>
                </div>
            </Header>
            <Content className="content">
                <Switch>
                    <Route exact path="/" component={Search} />
                    <Route path="/result" component={Result} />
                </Switch>
            </Content>
            <Footer className="footer">
                Copyright © 2013 TWT Studio.<br />All rights reserved
            </Footer>
        </Layout>
        </HashRouter>
    );
    }
}

export default App;
