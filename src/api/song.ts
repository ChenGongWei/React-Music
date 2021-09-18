import axios from '@/api/request'

const song = {
    /**
     * 活动列表
     * @param req
     */
    async list(){
        return axios.get("/banner");
    },
   
}

export default song
