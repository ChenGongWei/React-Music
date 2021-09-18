/** API 模块 */
declare module API {
    /** 登录返回值 */
    interface LoginInfo {
        /** 状态码 */
        code: number
        /** cookie */
        cookie?: string
        /** 错误信息 */
        message?: string
        /** 提示 */
        msg?: string
        /** 账号信息 */
        account?: {
            id: string
        }
    }
}
