import React from 'react';
import {BrowserRouter,Route,Link,Switch} from "react-router-dom";
import Search from "./Search";
import Result from "./Result"
import {Layout, Row,Col} from "antd";
import banner from "./banner.png"
import './App.css';
import 'antd/dist/antd.css';

function App() {
    const {Header,Content,Footer} = Layout;
    return (
        <BrowserRouter>
        <Layout>
            <div className="header">
                <img className="banner" src={banner} />
            </div>
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
        </BrowserRouter>
    );
}

export default App;
