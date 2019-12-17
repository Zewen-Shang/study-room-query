import React from "react"
import Svgs from "./svg" 

let render = text => {
  if(text === "无"){
    return Svgs.nothave;
  }else if(text === "有课"){
    return Svgs.have
  }else if(text === "有课-收藏"){
    return Svgs.favhave
  }else{
    return Svgs.favnothave
  }
}

const columns = [
    {
        title: '星期',
        dataIndex: '0',
        render: text => text,
      },
    {
        title: '周一',
        dataIndex: '1',
        render: render,
      },
    {
        title: '周二',
        dataIndex: '2',
        render: render,
    },
    {
        title: '周三',
        dataIndex: '3',
        render: render,
    },
    {
        title: '周四',
        dataIndex: '4',
        render: render,
    },
    {
      title: '周五',
      dataIndex: '5',
      render: render,
    },
    {
      title: '周六',
      dataIndex: '6',
      render: render,
  },
  {
    title: '周日',
    dataIndex: '7',
    render: render,
  }, 
  ];

  let data = [
    {
      0: '1',
      1: '？',
      2: '？',
      3: '？',
      4: '？',
      5: '？',
      6: '？',
      7: '？',
    },
    {
      0: '2',
      1: '？',
      2: '？',
      3: '？',
      4: '？',
      5: '？',
      6: '？',
      7: '？',
    },
    {
      0: '3',
      1: '？',
      2: '？',
      3: '？',
      4: '？',
      5: '？',
      6: '？',
      7: '？',
    },
    {
      0: '4',
      1: '？',
      2: '？',
      3: '？',
      4: '？',
      5: '？',
      6: '？',
      7: '？',
    },
    {
      0: '5',
      1: '？',
      2: '？',
      3: '？',
      4: '？',
      5: '？',
      6: '？',
      7: '？',
    },
    {
      0: '6',
      1: '？',
      2: '？',
      3: '？',
      4: '？',
      5: '？',
      6: '？',
      7: '？',
    },
    {
      0: '7',
      1: '？',
      2: '？',
      3: '？',
      4: '？',
      5: '？',
      6: '？',
      7: '？',
    },
    {
      0: '8',
      1: '？',
      2: '？',
      3: '？',
      4: '？',
      5: '？',
      6: '？',
      7: '？',
    },
    {
      0: '9',
      1: '？',
      2: '？',
      3: '？',
      4: '？',
      5: '？',
      6: '？',
      7: '？',
    },
    {
      0: '10',
      1: '？',
      2: '？',
      3: '？',
      4: '？',
      5: '？',
      6: '？',
      7: '？',
    },
    {
      0: '11',
      1: '？',
      2: '？',
      3: '？',
      4: '？',
      5: '？',
      6: '？',
      7: '？',
    },
    {
      0: '12',
      1: '？',
      2: '？',
      3: '？',
      4: '？',
      5: '？',
      6: '？',
      7: '？',
    },
];

let table = {
    columns,data
}

export default table