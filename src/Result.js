import React,{Component} from 'react';
import RoomList from "./RoomList"
import fetchData from "./tool"
import {Icon,Button,Modal,Table,message,Spin} from "antd";
import allbuilds from "./static/allbuilds"
import tableattr from "./static/tableattr";
import favorooms from "./static/favrooms";
import './App.css';

class Result extends Component{

  state = {
    allisfetch:false,
    allerr:null,
    classrooms:[],
    //下面是收藏相关
    favonfetch:false,
    favrooms:[],
    islog:false,
    faverr:null,
    //下面是课表相关
    roomshow:undefined,
    isfav:false,
    visible:false,
    columns:tableattr.columns,
    data:tableattr.data,
    tableonfetch:false,
    err:null,
  }

  componentDidMount = async () => {

    //先从static json中获取属于该教学楼的所有教室
    let classrooms = null;
    let allerr = null;
    allbuilds.data.forEach((build) => {
      if(build.building_id === this.props.location.state.build.building_id){
        classrooms=build.classrooms;
      }
    })

    //ajax找到闲置的教室
    this.setState({allisfetch:true});
    try{
      var data = await fetchData(`getCourseData.php?term=18191&week=${this.props.location.state.week}&day=${this.props.location.state.day}&course=${this.props.location.state.course}`);
      let build_free = null;
      data.forEach((build) => {
        if(build.building_id === this.props.location.state.build.building_id){
          build_free = build;
        }
      })
      //把闲置教室的canuse设为true
  
      for(let i = 0;i<classrooms.length;i++){
        classrooms[i].canuse = false;
        for(let j = 0 ; j<build_free.classrooms.length;j++){
          if(classrooms[i].classroom_id === build_free.classrooms[j].classroom_id){
            classrooms[i].canuse = true;
          }
        }
      }
    }catch(err){
      allerr = err;
    }
    //console.log(classrooms);
    //console.log(build_free.classrooms);
    this.setState({classrooms,allisfetch:false,allerr});
    this.refreshFav();
  }

  refreshFav = async () => {
    let islog = true;
    this.setState({favtableonfetch:true})
    let tmperr = null;
    let favrooms = [];
    try{
      favrooms = await fetchData("/api/addCollection.php");//这里应该是个异步,获得所有的收藏
    }catch(err){
      tmperr = err;
      islog = false;
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
         islog = false;
       }
    }
    this.setState({faverr:tmperr,favrooms,favtableonfetch:false,islog});
  }

  showModal = async (num) => {
    this.setState({tableonfetch:true,visible:true,roomshow:num})
    let data = this.state.data;
    let newdata = null;
    try{
      newdata = await fetchData(`getClassroomWeekInfo.php?classroom_ID=${num}&week=${this.props.location.state.week}&term=18191`);
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

    //如果已经登陆，就检测是否收藏
    if(this.state.islog){
      let isfav = false; 
      for(let i = 0;i<this.state.favrooms.length;i++){
        if(num === this.state.favrooms[i].classroom_ID){
          isfav = true;
        }
      }
      this.setState({isfav});
    }
  };

  changeFav = async (e) =>{
    if(!this.state.islog){
      message.error("请先登录");
      return;
    }
    message.info(this.state.isfav?"正在取消":"正在收藏");
    let result = fetchData(this.state.isfav?"deleteCollection.php":"addCollection.php",{
      method:"POST",
      body:{
        classroomID:e.target.num,
      }
    }).then((res) => {
      message.success("成功")
      this.refreshFav();
      this.setState({isfav:!this.state.isfav});
    }).catch((err) =>{
      message.error(err.message);
    })
  }

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  render = () => {
    let {data,columns} = this.state;
    return(
      <div>
        <div className="result-title">
          <Icon type="read" /> {this.props.location.state.build.building}
        </div>
        {this.state.allisfetch
        ? <div className="spin"><Spin/></div>
        :this.state.allerr
          ?this.state.allerr.message
          :
          <div>
          <RoomList RoomonClick={this.showModal} classrooms={this.state.classrooms} />
          </div>}
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleOK}
        >
          <Table loading={this.state.tableonfetch} pagination={false} size="small" columns={columns} dataSource={data} bordered />
          <Button className="table-button" type={this.state.isfav?"none":"primary"} num={this.state.roomshow} onClick={this.changeFav}>{this.state.isfav?"取消":"收藏"}</Button>
        </Modal>
      </div>
    )
  }
}

export default Result;
