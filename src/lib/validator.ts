export const isMobileReg = /^1[3-9]\d{9}$/
/** 是否手机 */
export function isMobile(mobile: string) {
    return isMobileReg.test(mobile)
}

export const isMaximumTwoDecimal = /^[0-9]+(\.[0-9]{1,2})?$/
/** 最大两位小数*/
export function isMaxTwoDecimal(params: string) {
    return isMaximumTwoDecimal.test(params) || '请输入最多两位小数'
}

/** 不允许纯空格 */
export function notAllSpace(params: string, label: string) {
    return !!params?.trim().length || '请填写' + label
}
