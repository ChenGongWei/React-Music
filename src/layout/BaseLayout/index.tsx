import React, { useState, useEffect, PropsWithChildren } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import {
    HomeOutlined,
    MessageOutlined,
    UnorderedListOutlined,
    UserOutlined,
} from '@ant-design/icons'

import style from './style.module.scss'

const tabs = [
    {
        key: 'home',
        title: '首页',
        icon: <HomeOutlined />,
    },
    {
        key: 'todo',
        title: '我的待办',
        icon: <UnorderedListOutlined />,
    },
    {
        key: 'message',
        title: '我的消息',
        icon: <MessageOutlined />,
    },
    {
        key: 'personalCenter',
        title: '个人中心',
        icon: <UserOutlined />,
    },
]

interface BaseLayoutProps {}
const BaseLayout: React.FC<PropsWithChildren<BaseLayoutProps>> = props => {
    const { pathname } = useLocation() // 存储当前路由地址
    const history = useHistory()
    // 当前 tab 的 key
    const [activeKey, setActiveKey] = useState('home')

    useEffect(() => {
        if (pathname === '/' || pathname === '/home') {
            setActiveKey('home')
        }
        if (pathname === '/todo') {
            setActiveKey('todo')
        }
        if (pathname === '/message') {
            setActiveKey('message')
        }
        if (pathname === '/personalCenter') {
            setActiveKey('personalCenter')
        }
    }, [pathname])

    const changeTab = (key: string) => {
        console.log(key)
        history.push(`/${key}`)
    }

    return (
        <>
            {props.children}
            <TabBar
                activeKey={activeKey}
                className={style.footer}
                onChange={changeTab}>
                {tabs.map(item => (
                    <TabBar.Item
                        key={item.key}
                        icon={item.icon}
                        title={item.title}
                    />
                ))}
            </TabBar>
        </>
    )
}

export default BaseLayout
