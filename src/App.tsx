import React, { useEffect, Suspense } from 'react'
import { Toast } from 'antd-mobile'
import { LoadingOutlined } from '@ant-design/icons'
import api from '@/api'
import Loading from '@/components/Loading'
import Routes from './routes'

function App() {
    const id = localStorage.getItem('uid')

    // 获取用户信息
    const getUserInfo = async (id: string) => {
        Toast.show({
            icon: <LoadingOutlined />,
            content: '加载中...',
            duration: 0,
        })
        try {
            const res = await api.user.getUserInfo(id)
            console.log(res)
        } catch (error) {
            console.log(error)
        } finally {
            Toast.clear()
        }
    }

    useEffect(() => {
        if (id) {
            getUserInfo(id)
        }
    }, [id])

    return (
        <Suspense fallback={<Loading />}>
            <Routes />
        </Suspense>
    )
}

export default App
