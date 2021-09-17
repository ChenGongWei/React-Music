import React from 'react'
import style from './style.module.scss'

interface LoadingProp {}

const Loading: React.FC<LoadingProp> = props => {
    return (
        <div className={style.wrap}>
            <div className={style.ldsRipple}>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}

export default Loading