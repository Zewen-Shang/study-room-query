import React,{Component} from 'react';
//import {Link} from "react-router-dom"
import BuildList from "./BuildList";
import fetchData from './tool';
import {DatePicker,Select,Row,Col,Collapse,Modal,Table,Spin,message} from "antd";
import FavList from "./Favourite/FavList"
import moment from "moment";
import allbuilds from "./static/allbuilds";
import tableattr from "./static/tableattr";
import favorooms from "./static/favrooms";
import './App.css';
import { async } from 'q';

//antd组件初始化
const {Option} = Select;
const {Panel} = Collapse;

//筛选出所有教室便于模糊搜索
let classrooms = [];
allbuilds.data.forEach((build) => {
  classrooms.push.apply(classrooms,build.classrooms);
})


//下面是类
class Search extends Component{

  state = {
    campus:"New",
    course:1,
    week:undefined,
    day:undefined,
    date:null,
    //下面是收藏相关
    favonfetch:false,
    favrooms:[],
    islog:false,
    faverr:null,
    //下面是课表相关
    visible:false,
    tableonfetch:false,
    data:tableattr.data,
    tableerr:null,
    columns:tableattr.columns,
  }

  componentWillMount = () => {
    let date = moment(new Date());
    this.handleDateChange(date);
  }

  componentDidMount = async () =>{
    this.refreshFav();
  }

  refreshFav = async () => {
    this.setState({favonfetch:true})
    let tmperr = null;
    let favrooms = [];
    try{
      favrooms = await fetchData("/api/addCollection.php");//这里应该是个异步,获得所有的收藏
    }catch(err){
      tmperr = err;
    }

    //如果第一步顺利
    if(!tmperr){
       try{
        //ajax找到闲置的教室
        var data = await fetchData(`getCourseData.php?term=18191&week=${this.state.week}&day=${this.state.day}&course=${this.state.course}`);
        //console.log(data);
        //console.log(favrooms);
        for(let i = 0; i < favrooms.length; i++){
          favrooms[i].canuse = false;
          favrooms[i].on = true;
        }
        data.forEach((build) => {
          for(let i = 0;i<favrooms.length;i++){
            for(let j = 0 ; j<build.classrooms.length;j++){
              if(favrooms[i].classroom_ID === build.classrooms[j].classroom_id){
                favrooms[i].canuse = true;
              }
            }
          }
        })
       }catch(err){
         tmperr = err;
       }
    }
    this.setState({faverr:tmperr,favrooms,favonfetch:false});
  }

  changeFav = async (flag,num) =>{
    if(flag){
      message.info("正在删除");
      let result = fetchData("addCollection.php",{
        method:"POST",
        body:{
          classroomID:num,
        }
      }).then((res) => {
        message.success("成功")
      }).catch((err) =>{
        message.error(err.message);
      })
    }else{
      message.config("正在添加");
      let result = fetchData("deleteCollection.php",{
        method:"POST",
        body:{
          classroomID:num,
        }
      }).then((res) => {
        message.success("成功")
      }).catch((err) =>{
        message.error(err.message);
      })
    }
    this.refreshFav();
  }

  handleCourseSelectChange = (value) => {
    this.setState({course:value},this.refreshFav);
  }

  handleCampusSelectChange = (value) => {
    this.setState({campus:value},this.refreshFav);
  }
  //刷新日期
  handleDateChange = async (moment) => {
    let date = moment;
    let week = Math.floor((moment.diff([2019, 7, 18],"days")+6)/7);
    let day = (moment.diff([2019, 7, 18],"days")) - 7*(week-1);
    this.setState({date,week,day},this.refreshFav);
  }
  //点击教学楼后跳转路由
  handleBuildListChange = (build) => {
    this.props.history.push(`/result/building_id=${build.building_id}`,{week:this.state.week,day:this.state.day,build:build})
  }

  //课表显示相关

  handleSearchChange = async (coures_id) => {
    this.setState({tableonfetch:true,visible:true})
    let data = this.state.data;
    let newdata = null;
    try{
      newdata = await fetchData(`getClassroomWeekInfo.php?classroom_ID=${coures_id}&week=${this.state.week}&term=18191`);
      let cnt = -1;
      for(var a in newdata){
        cnt++;
        for(let i=0;i<12;i++){
          if(newdata[a][i] === "0"){
            data[i][cnt+1] = "无"
          }else{
            data[i][cnt+1] = "有课"
          }
        }
      }
      this.setState({
        data,
      });
    }catch(err){
      this.setState({err});
    }
    this.setState({tableonfetch:false});
  }

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };
  render = () => {
    let oldbuild = [];
    let newbuild = [];
    let course = [1,2,3,4,5,6,7,8,9,10,11,12];
    allbuilds.data.forEach((build) => {
      if(build.campus_id === "1"){
        oldbuild.push(build);
      }else{
        newbuild.push(build);
      }
    })
    return(
      <React.Fragment>
        {/*选择校区*/}
        <div className="search-container">当前校区：
          <Select size="large" value={this.state.campus} onChange={this.handleCampusSelectChange.bind(this)}>
            <Option value="New">北洋园</Option>
            <Option value="Old">卫津路</Option>
          </Select>
        </div>
        {/*选择时间*/}
        <div className="search-container">
          <Row type="flex" justify="space-around">
            <Col span={12}>
              <DatePicker allowClear={false} size="large" className="search-datepicker" value={this.state.date} onChange={this.handleDateChange.bind(this)} />
            </Col>
            <Col span={8}>
              <Select size="large" className="search-courseselecter" value={this.state.course} onChange={this.handleCourseSelectChange.bind(this)}>
                {course.map((num,key) => {
                  return <Option value={num} key={key}>第{num}节</Option>
                })}
              </Select>
            </Col>
          </Row>
        </div>
        {/*搜索教学楼*/}
        <div className="search-container" >
          <Select onChange={this.handleSearchChange.bind(this)} style={{width:"90%"}} showSearch>
            {classrooms.map((room,key) => {
              return <Option value={room.classroom_id} key={key} >{room.classroom}</Option>
            })}
          </Select>
        </div>
        {/*选择教学楼*/}
        <div className="search-buildlist-container">
          <BuildList onChange={this.handleBuildListChange.bind(this)} builds = {this.state.campus === "New"?newbuild:oldbuild} />
        </div>
        {/*收藏夹*/}
        <Collapse bordered={false}>
          <Panel header="收藏">
            {this.state.favonfetch
            ?<div className="spin"><Spin/></div>
            : this.state.faverr
              ?<div>{this.state.faverr.message}</div>
              :<FavList right={this.changeFav} left={this.handleSearchChange} items={this.state.favrooms} />}
          </Panel>
        </Collapse>

        {/*隐藏的课表*/}
        <Modal title="课表" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel} destroyOnClose={true}>
          <Table loading={this.state.tableonfetch} pagination={false} size="small" columns={this.state.columns} dataSource={this.state.data} bordered />
        </Modal>
      </React.Fragment>
    )
  }
}

export default Search;
