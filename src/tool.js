const BASE_URL = 'https://selfstudy.twt.edu.cn/api/';

// let fetchData = async apiPath => {
//     const response = await fetch(BASE_URL+apiPath,{
//         credentials:"include",
//     });
//     if (!response.ok) {
//         throw Error(`获取失败：${response.status} ${response.statusText}`);
//     }
//     const json = await response.json();
//     if (json.error_code === -1) {
//         return json.data;
//     }
//     throw Error(json.error_message);

// };


let fetchData = (apiPath,arg) => {
    //fetch接受url以及包头参数，返回一个promise
    return fetch(BASE_URL+apiPath,{
        ...arg,
        credentials:"include", 
    }).then((resData) => {//返回一个数据包，先判断传输是否顺利
        return new Promise((res,rej) => {
            if(!resData.ok){
                return Error("获取失败" + resData.status + resData.statusText);
            }else{
                res(resData.json())//传输顺利则解析json
            }
        })
    }).then((getJson) => {//第二部判断服务器是否正确响应
        if(getJson.error_code === -1){
            return getJson.data;
        }else{
            throw Error("错误。错误码：" + getJson.error_code + (getJson.error_message?getJson.error_message:" "));
        }
    })
    
//这里不用Promise的catch，因为要用外层调用函数的trycatch捕获
} 

export default fetchData;