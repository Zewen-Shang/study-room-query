import React,{Component} from 'react';
import {withRouter} from "react-router-dom"
import Lodash from "lodash";
import BuildList from "./Build/BuildList";
import fetchData from './tool';
import {DatePicker,Select,Row,Col,Collapse,Modal,Table,Spin,message,Button,Drawer,Radio,Checkbox} from "antd";
import FavList from "./Favourite/FavList"
import moment from "moment";
import tableattr from "./static/tableattr";
import locale from 'antd/es/date-picker/locale/zh_CN';
import Svgs from "./static/svg"
import './App.css';

//antd组件初始化
const {Option} = Select;
const {Panel} = Collapse;

//下面是类
class Search extends Component{

state = {
    campus:"Old",
    courses:[],
    week:undefined,
    day:undefined,
    date:null,
    classrooms:[],
    //下面是抽屉相关
    campusDrawer:false,
    dateDrawer:false,
    searchDrawer:false,
    courseDrawer:false,
    //下面是收藏相关
    favonfetch:true,
    favrooms:[],
    islog:false,
    faverr:null,
    //下面是课表相关
    visible:false,
    tableonfetch:false,
    data:tableattr.data,
    tableerr:null,
    columns:tableattr.columns,
    roomshowid:undefined,
    isfav:false
}

//私有方法
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


_disabledDate = (current) => {
    //1-26周
    return  current < moment(new Date('2019/08/19')) || current > moment(new Date('2020/02/01')) ;
};

componentWillMount = () => {
    //初始化记忆选择
    let courses = localStorage.getItem("courses");
    if(courses){
        courses = courses.split(",");
        this.setState({courses})
    }
    let campus = localStorage.getItem("campus");
    if(campus){
        this.setState({campus});
    }
    //初始化日期
    let date = moment(new Date());
    this.handleDateChange(date);
    //筛选出所有教室便于模糊搜索
    let classrooms = [];
    this.props.builds.forEach((build) => {
        classrooms.push.apply(classrooms,build.classrooms);
    })
    let newrooms = [];
    for(let i = 0; i < classrooms.length; i++){
        if(i === classrooms.map((room) => room.classroom_id).indexOf(classrooms[i].classroom_id)){
            newrooms.push(classrooms[i]);
        }
    }
    classrooms = newrooms;
    this.setState({classrooms});
}

componentDidMount = async () =>{
    this.refreshFav();
}

componentWillUnmount = () => {
    localStorage.setItem("courses",this.state.courses);
    localStorage.setItem("campus",this.state.campus);
}

refreshFav = async () => {
    this.setState({favonfetch:true})
    let tmperr = null;
    let favrooms = [];
    try{
        favrooms = await fetchData("getCollectionList.php",{method:"GET"});
    }catch(err){
        tmperr = err;
    }

    //如果第一步顺利
    if(!tmperr){
        try{
            //ajax找到闲置的教室
            let str = this.state.courses.join(",");
            var data = await fetchData(`getCourseData.php?term=19201&week=${this.state.week}&day=${this.state.day}&course=${str}`,{method:"GET"});
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

refreshFav = Lodash.debounce(
    this.refreshFav,
    2000
)

changeFav = async (flag,num) =>{
    message.info(flag?"正在删除":"正在收藏");
    let fd = new FormData();
    fd.append("classroom_ID",num);
    await fetchData(flag?"deleteCollection.php":"addCollection.php",{method:"POST",body:fd})
    .then((res) => {
        message.success("成功")
    }).catch((err) =>{
        message.error(err.message);
    })
    this.refreshFav();
}

//抖动处理
changeFavDeb = Lodash.debounce(
    this.changeFav,
    2000,
    {
        'leading': true,
        'trailing': false
    }
);

handleFavButtononClick = () => {
    this.changeFavDeb(this.state.isfav,this.state.roomshowid);
}

handleFavStaronClick = (flag,num) => {
    this.changeFavDeb(flag,num);
}

handleCourseSelectonChange = (courses) => {
    this.setState({courses})
    this.refreshFav();
}

handleCampusChange = (e) => {
    this.setState({campus:e.target.value});
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
    if(this.state.courses.length === 0){
        message.error("请选择至少一节课");
        return;
    }
    let str = this.state.courses.join(',');
    this.props.history.push(`/result/building=${build.building}&building_id=${build.building_id}&week=${this.state.week}&day=${this.state.day}&course=${str}`)
}

//课表显示相关
showModal = async (name) => {
    let id = this._getIdfromName(name)
    this.setState({tableonfetch:true,roomshowid:id})
    this.setState({visible:true});
    if(this.state.favrooms){
        for(let i = 0; i < this.state.favrooms.length;i++){
            if(this.state.favrooms[i].classroom_ID === id){
                this.setState({isfav:true});
            }
        }
    }
    let data = this.state.data;
    let newdata = null;
    try{
        newdata = await fetchData(`getClassroomWeekInfo.php?classroom_ID=${id}&week=${this.state.week}&term=19201`);
        let cnt = -1;
        for(var a in newdata){
            cnt++;
            for(let i=0;i<12;i++){
                if(newdata[a][i] === "0"){
                    data[i][cnt+1] = "无"
                }else{
                    data[i][cnt+1] = "有课"
                }
                if(cnt+1 === parseInt(this.state.day+"") && this.state.courses.includes(i+1 + "")){
                    data[i][cnt+1] = data[i][cnt+1] + "-收藏";
                }
            }
        }
        this.setState({
            data,
        });
    }catch(err){
        this.setState({tableerr:err});
        message.error(err.message)
    }
    this.setState({tableonfetch:false});
}

handleOk = () => {
    this.setState({
        visible: false,
        columns:tableattr.columns,
        data:tableattr.data,
    });
};

handleCancel = () => {
    this.setState({
        visible: false,
        columns:tableattr.columns,
        data:tableattr.data,
    });
};
//抽屉相关

handleCampusonClick = () => {
    this.setState({campusDrawer:true});
}

handleCampusDrawerCancel = () => {
    this.setState({
        campusDrawer: false,
    });
};

handleDateonClick = () => {
    this.setState({dateDrawer:true});
}

handleDateDrawerCancel = () => {
    this.setState({
        dateDrawer: false,
    });
};

handleCourseDraweronClick = () => {
    this.setState({
        courseDrawer: true,
    });
}

handleCourseDraweronCancel = () => {
    this.setState({
        courseDrawer: false,
    });
}

//这个现在不用
// handleSearchDraweronClick = () => {
//     this.setState({searchDrawer:true});
// }

// handleSearchDrawerCancel = () => {
//     this.setState({
//         searchDrawer: false,
//     });
// };

render = () => {
    let oldbuild = [];
    let newbuild = [];
    this.props.builds.forEach((build) => {
        if(build.campus_id === "1" && build.classrooms.length !== 0){
            oldbuild.push(build);
        }else if(build.classrooms.length !== 0){
            newbuild.push(build);
        }
    })
    return(
    <React.Fragment>
        {/*选择校区,日期等*/}
        <Row className="search-top" >
            <Col span={24} onClick={this.handleCampusonClick}>
                当前校区：{this.state.campus === 'New'?"北洋园":"卫津路"}
            </Col>
            <Col span={12}>
                <Button className="search-select-button" type="primary" onClick={this.handleDateonClick}>选择日期</Button>
            </Col>
            <Col span={12}>
                <Button className="search-select-button" type="primary" onClick={this.handleCourseDraweronClick}>选择节次</Button>
            </Col>
        </Row>
        {/*选择教学楼*/}
        <div className="search-buildlist-container">
            <BuildList week={this.state.week} onChange={this.handleBuildListChange.bind(this)} builds = {this.state.campus === "New"?newbuild:oldbuild} />
        </div>
        {/*收藏夹*/}
        <Collapse bordered={false} defaultActiveKey={['1']}>
            <Panel header="收藏" key="1">
                {this.state.favonfetch
                ?<div className="spin">正在抓取<Spin/></div>
                :this.state.faverr
                    ?"错误:" + this.state.faverr.message
                    :<FavList right={this.handleFavStaronClick.bind(this)} left={this.showModal} items={this.state.favrooms} />}
            </Panel>
        </Collapse>

        {/*隐藏的课表*/}
        <Modal
          title={this.state.roomshowid?this._getNamefromId(this.state.roomshowid):" "}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleOk}
          cancelText="取消"
          okText="确定"
        >
            <Table loading={this.state.tableonfetch} pagination={false} size="small" columns={this.state.columns} dataSource={this.state.data} bordered />
            <div>“{Svgs.have}”代表该节次被占用</div>
            <div>“{Svgs.nothave}”代表该节次没有被占用</div>
            <div>“{Svgs.favhave}”代表该节次被选中并且被占用</div>
            <div>“{Svgs.favnothave}”代表该节次被选中并且未被占用</div>
            <Button className="table-button" type={this.state.isfav?"none":"primary"} onClick={this.handleFavButtononClick}>{this.state.isfav?"取消":"收藏"}</Button>
        </Modal>
        {/*这个是选校区的 */}
        <Drawer 
        title="选择校区"
        placement="bottom"
        closable={true}
        visible={this.state.campusDrawer}
        onClose={this.handleCampusDrawerCancel}
        height="170"
        >
            <Radio.Group value={this.state.campus} onChange={this.handleCampusChange}>
                <Radio className="search-radio-top" value="Old">卫津路</Radio><br/>
                <Radio className="search-radio" value="New">北洋园</Radio>
            </Radio.Group>
        </Drawer>
        {/*这个是选日期的 */}
        <Drawer 
        title="选择日期"
        placement="top"
        closable={true}
        visible={this.state.dateDrawer}
        onClose={this.handleDateDrawerCancel}
        height="170"
        >
            <div className="search-container">
                <Row type="flex" justify="space-around">
                    <Col span={24}>
                        <DatePicker locale={locale} disabledDate={this._disabledDate} allowClear={false} size="large" className="search-datepicker" value={this.state.date} onChange={this.handleDateChange.bind(this)} />
                    </Col>
                </Row>
            </div>
        </Drawer>
        {/*这个是节次 */}
        <Drawer 
        title="选择节次"
        placement="top"
        closable={true}
        visible={this.state.courseDrawer}
        onClose={this.handleCourseDraweronCancel}
        height="190"
        >
            <Row>
                <Checkbox.Group value={this.state.courses} onChange={this.handleCourseSelectonChange}>
                    {["1","2","3","4","5","6","7","8","9","10","11","12"].map((num,key) => 
                        <Col span={6} key={key}><Checkbox value={num}>第{num}节</Checkbox></Col>
                    )}
                </Checkbox.Group>
                <Button onClick={this.handleCourseDraweronCancel} style={{width:"100%"}} type="primary">确定</Button>
            </Row>
        </Drawer>
        {/*这个目前废了 */}
        <Drawer 
        title="搜索教室"
        placement="top"
        closable={true}
        visible={this.state.searchDrawer}
        onClose={this.handleSearchDrawerCancel}
        height="170"
        >
            <div className="search-container" >
                <Select onChange={this.showModal.bind(this)} style={{width:"90%"}} showSearch>
                    {this.state.classrooms.map((room,key) => {
                        return <Option _id={room.classroom_id} value={room.classroom} key={key} >{room.classroom}</Option>
                    })}
                </Select>
            </div>
        </Drawer>
    </React.Fragment>
    )
}
}

export default withRouter(Search);
