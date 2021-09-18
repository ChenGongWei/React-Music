import React, { useState, useCallback, useEffect } from 'react'
import { Input, Toast } from 'antd-mobile'
import { LoadingOutlined } from '@ant-design/icons'
import classnames from 'classnames'
import { useHistory } from 'react-router-dom'

import api from '@/api'
import { isMobile } from '@/lib/validator'
import IconFont from '@/components/IconFont'
import style from './style.module.scss'

let timer: NodeJS.Timer

const Login: React.FC = () => {
    const history = useHistory()

    /** 用户名 */
    const [username, setUsername] = useState('')
    /** 密码 */
    const [password, setPassword] = useState('')
    /** 是否使用验证码登录 */
    const [loginCode, setLoginCode] = useState(false)
    /** 是否可发送验证码 */
    const [sendVisible, setSendVisible] = useState(true)
    /** 多少 s 后可发 */
    const [seconds, setSeconds] = useState(60)

    /**
     * 改变登录方式
     */
    const changeLoginType = () => {
        let l = !loginCode
        setLoginCode(l)
        setPassword('')
        localStorage.setItem('loginCode', String(l))
    }

    /**
     * 调用定时器倒计时
     */
    const createTimer = useCallback(() => {
        timer = setInterval(() => {
            let seconds = JSON.parse(localStorage.getItem('seconds')!)
            if (seconds <= 0) {
                // 清除定时器
                clearInterval(timer)
                // 可发验证码
                setSendVisible(true)
                localStorage.setItem('sendVisible', 'true')
                // 时间重置为60
                setSeconds(60)
                localStorage.setItem('seconds', '60')
            } else {
                setSeconds(seconds - 1)
                localStorage.setItem('seconds', String(seconds - 1))
            }
        }, 1000)
    }, [])

    /**
     * 发送验证码
     */
    const sendCode = useCallback(() => {
        if (isMobile(username)) {
            setSendVisible(false)
            localStorage.setItem('sendVisible', 'false')
            localStorage.setItem('seconds', '60')
            createTimer()
            api.user.sendCaptcha(username)
        } else {
            Toast.show({
                icon: 'fail',
                content: '请输入正确的手机号',
            })
        }
    }, [createTimer, username])

    /**
     * 登录
     */
    const login = useCallback(async () => {
        if (!username || !password) {
            Toast.show({
                icon: 'fail',
                content: `手机号或${loginCode ? '验证码' : '密码'}不能为空`,
            })
            return
        }
        Toast.show({
            icon: <LoadingOutlined />,
            content: '登录中...',
            duration: 0,
        })
        let request
        if (loginCode) {
            request = api.user.loginCaptcha
        } else {
            request = api.user.loginPhone
        }
        try {
            const res = await request(username, password)
            console.log(res)
            if (res?.code === 200) {
                Toast.show({
                    icon: 'success',
                    content: '登录成功',
                })
                localStorage.setItem('cookie', res.cookie!)
                localStorage.setItem('uid', res.account?.id!)
                history.replace('/')
            } else {
                Toast.show({
                    icon: 'fail',
                    content: res.message || res.msg,
                })
            }
        } catch (err) {
            Toast.show({
                icon: 'fail',
                content: '网络异常，请稍后重试~',
            })
        }
    }, [username, password, loginCode, history])

    /**
     * 初始化
     */
    useEffect(() => {
        let loginCode = localStorage.getItem('loginCode')
        let sendVisible = localStorage.getItem('sendVisible')
        let seconds = localStorage.getItem('seconds')
        loginCode && setLoginCode(JSON.parse(loginCode))
        sendVisible && setSendVisible(JSON.parse(sendVisible))
        seconds && setSeconds(JSON.parse(seconds))

        if (!JSON.parse(sendVisible!)) {
            createTimer()
        }

        return () => {
            localStorage.removeItem('loginCode')
            localStorage.removeItem('sendVisible')
            localStorage.removeItem('seconds')
            clearInterval(timer)
        }
    }, [createTimer])

    return (
        <>
            <div className={style.wrap}>
                <div className={style.icon}>
                    <IconFont name="icon" size={500} />
                    <div className={style.title}>露 音 乐</div>
                </div>

                <div className={style.login_box}>
                    <div className={style.inp_box}>
                        <Input
                            className={style.inp}
                            value={username}
                            onChange={val => setUsername(val.trim())}
                            clearable
                            placeholder="请输入手机号"
                            maxLength={11}
                        />
                        {/* <input type="text" placeholder="Username" /> */}
                    </div>
                    <div className={style.inp_box}>
                        <Input
                            className={classnames(style.inp, {
                                [style.has_code]: loginCode,
                            })}
                            value={password}
                            clearable={!loginCode}
                            onChange={val => setPassword(val.trim())}
                            type={loginCode ? 'text' : 'password'}
                            placeholder={`请输入${
                                loginCode ? '验证码' : '密码'
                            }`}
                            maxLength={loginCode ? 4 : 15}
                        />
                        {loginCode &&
                            (sendVisible ? (
                                <span
                                    className={style.send_code}
                                    onClick={sendCode}>
                                    发送验证码
                                </span>
                            ) : (
                                <span className={style.send_code}>
                                    {seconds}s后重新发送
                                </span>
                            ))}
                    </div>
                    <div className={style.btn} onClick={login}>
                        登录
                    </div>
                    <div className={style.change}>
                        <span onClick={changeLoginType}>
                            使用{loginCode ? '密码' : '验证码'}登录
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
