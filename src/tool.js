import axios from "axios";

const BASE_URL = 'https://selfstudy.twtstudio.com/api/';

let fetchData = async apiPath => {
    console.log(`${BASE_URL}/${apiPath}`);
    const response = await fetch(`https://selfstudy.twtstudio.com/api/${apiPath}`);
    if (!response.ok) {
        throw Error(`${response.status} ${response.statusText}`);
    }
    const json = await response.json();
    if (json.error_code === -1) {
        return json.data;
    }
    throw Error(json.error_message);
};

export default fetchData;

