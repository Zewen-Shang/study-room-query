import React,{Component} from 'react';
import RoomList from "./Room/RoomList"
import Lodash from "lodash"
import fetchData from "./tool"
import {withRouter} from "react-router-dom"
import {Icon,Button,Modal,Table,message,Spin} from "antd";
import tableattr from "./static/tableattr";
import Svgs from "./static/svg"
class Result extends Component{

state = {
    allisfetch:false,
    allerr:null,
    classrooms:[],
    //下面是收藏相关
    favonfetch:false,
    favrooms:[],
    isLog:false,
    faverr:null,

    //下面是课表相关
    roomShowId:undefined,
    isfav:false,
    visible:false,
    columns:tableattr.columns,
    data:tableattr.data,
    tableonfetch:false,
    err:null,
}
_getNamefromId = (id) => {
    for(let i = 0; i < this.state.classrooms.length; i++){
        if(this.state.classrooms[i].classroom_id === id){
            return this.state.classrooms[i].classroom;
        }
    }
}

_getIdfromName = (name) => {
    for(let i = 0; i < this.state.classrooms.length; i++){
        if(this.state.classrooms[i].classroom === name){
            return this.state.classrooms[i].classroom_id;
        }
    }
}
componentWillMount = () => {
    //解析params
    let params = {};
    let arr = this.props.match.params.params.split("&");
    for(let i = 0; i < arr.length ; i++){
        let res = arr[i].split("=");
        params[res[0]] = res[1];
    }
    params.courseArr = params.course.split(",").map((str) => parseInt(str));
    this.setState({params})
}

componentDidMount = async () => {
    //先从static json中获取属于该教学楼的所有教室
    let classrooms = [];
    let allerr = null;
    this.props.builds.forEach((build) => {
    if(build.building_id === this.state.params.building_id){
        classrooms=build.classrooms;
    }
    })

    //ajax找到闲置的教室
    this.setState({allisfetch:true});
    try{
    var data = await fetchData(`getCourseData.php?term=19201&week=${this.state.params.week}&day=${this.state.params.day}&course=${this.state.params.course}`,{method:"GET"});
    let build_free = null;
    data.forEach((build) => {
        if(build.building_id === this.state.params.building_id){
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
    }
    catch(err){
        allerr = err;
    }
    this.setState({classrooms,allisfetch:false,allerr});
    this.refreshFav();
}

refreshFav = async () => {
    let isLog = true;
    this.setState({favtableonfetch:true})
    let tmperr = null;
    let favrooms = [];
    try{
        favrooms = await fetchData("getCollectionList.php",{method:"GET"});
    }catch(err){
        tmperr = err;
        isLog = false;
    }

    //如果第一步顺利
    if(!tmperr){
    try{
        //ajax找到闲置的教室
        var data = await fetchData(`getCourseData.php?term=19201&week=${this.state.params.week}&day=${this.state.params.day}&course=${this.state.params.course}`,{method:"GET"});
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
        isLog = false;
    }
    }
    this.setState({faverr:tmperr,favrooms,favtableonfetch:false,isLog});
}

showModal = async (num) => {
    this.setState({tableonfetch:true,visible:true,roomShowId:num})
    let data = this.state.data;
    let newdata = null;
    try{
    newdata = await fetchData(`getClassroomWeekInfo.php?classroom_ID=${num}&week=${this.state.params.week}&term=19201`,{method:"GET"});
    let cnt = -1;
    for(var a in newdata){
        cnt++;
        for(let i=0;i<12;i++){
            if(newdata[a][i] === "0"){
                data[i][cnt+1] = "无"
            }else{
                data[i][cnt+1] = "有课"
            }
            if(cnt+1 === parseInt(this.state.params.day) && this.state.params.courseArr.includes(i+1)){
                data[i][cnt+1] = data[i][cnt+1] + "-收藏";
            }
        }
    }
    this.setState({data,});
    }catch(err){
    message.error(err.message);
    this.setState({err});
    }

    this.setState({tableonfetch:false});

    //如果已经登陆，就检测是否收藏
    if(this.state.isLog){
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
    message.info(this.state.isfav?"正在取消":"正在收藏");
    let fd = new FormData();
    fd.append("classroom_ID",this.state.roomShowId);
    await fetchData(this.state.isfav?"deleteCollection.php":"addCollection.php",{method:"POST",body:fd})
    .then((res) => {
        message.success("成功")
        this.refreshFav();
        //这里是一个临时的变动 
        this.setState({isfav:!this.state.isfav});
    })
    .catch((err) =>{
        message.error(err.message);
    })
}

handleFavButtononClick = Lodash.debounce(this.changeFav,2000,
    {
        'leading': true,
        'trailing': false
    }
)
handleOk = e => {
    this.setState({
        visible: false,
        columns:tableattr.columns,
        data:tableattr.data,
    });
};

render = () => {
    let {data,columns} = this.state;
    return(
    <div>
        <div className="result-title">
        <Icon type="read" /> {this.state.params.building}
        </div>
        {this.state.allisfetch
        ? <div className="spin"><Spin/></div>
        : this.state.allerr
            ?this.state.allerr.message
            :
            <div>
                <RoomList RoomonClick={this.showModal} classrooms={this.state.classrooms} />
            </div>}
        <div style={{padding:"5px"}}>
            <div>您选择的时间段为第{this.state.params.week}周，第{this.state.params.day}天的第{this.state.params.courseArr.join(",")}节课.</div>
            <div>蓝色为空闲教室，白色为占用教室。</div>
        </div>
        <Modal
          title={this._getNamefromId(this.state.roomShowId)}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleOk}
          cancelText="取消"
          okText="确定"
        >
            <Table loading={this.state.tableonfetch} pagination={false} size="small" columns={columns} dataSource={data} bordered />
            <div>“{Svgs.have}”代表该节次被占用</div>
            <div>“{Svgs.nothave}”代表该节次没有被占用</div>
            <div>“{Svgs.favhave}”代表该节次被选中并且被占用</div>
            <div>“{Svgs.favnothave}”代表该节次被选中并且未被占用</div>
            <Button className="table-button" type={this.state.isfav?"none":"primary"} num={this.state.roomShowId} onClick={this.handleFavButtononClick}>{this.state.isfav?"取消":"收藏"}</Button>
        </Modal>
    </div>
    )
}
}

export default withRouter(Result);
