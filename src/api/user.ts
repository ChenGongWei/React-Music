import axios from '@/api/request'

const song = {
    /**
     * 手机登录
     * @param phone 手机号
     * @param password 密码
     */
    async loginPhone(phone: string, password: string): Promise<API.LoginInfo> {
        return axios.post('/login/cellphone', {
            phone,
            password,
        })
    },
    /**
     * 发送验证码
     * @param phone 手机号
     */
    async sendCaptcha(phone: string) {
        return axios.get(`/captcha/sent?phone=${phone}`)
    },
    /**
     * 校验验证码
     * @param phone 手机号
     */
    async verifyCaptcha(phone: string, code: string) {
        return axios.get(`/captcha/verify?phone=${phone}&captcha=${code}`)
    },
    /**
     * 验证码登录
     * @param phone 手机号/user/detail?uid=32953014
     */
    async loginCaptcha(phone: string, captcha: string): Promise<API.LoginInfo> {
        return axios.post('/login/cellphone', {
            phone,
            captcha,
        })
    },
    /**
     * 用户详情
     * @param phone 手机号
     */
    async getUserInfo(uid: string): Promise<API.LoginInfo> {
        return axios.post('/user/detail', {
            uid,
        })
    },
}

export default song
