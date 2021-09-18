import React, { useEffect, useRef } from 'react'
import { Props } from './type'
import classnames from 'classnames'
import svgData from './data.json'
import ui from '@/lib/ui'

export interface IProps extends Props {
    style?: React.CSSProperties
}

function IconFont(props: IProps) {
    const { size = 18, color, name, className = '', style = {} } = props

    const domEl = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!name || !domEl || !domEl.current) {
            return
        }

        // @ts-ignore
        const data = svgData[name]
        if (!data) {
            console.warn(`icon name : ${name} data is null`)
            return
        }

        const svgSize = ui.toRem(size)

        let tpl = data.template
            .replace(/{{svgSize}}/g, svgSize)
            .replace(/\n/g, '')
            .replace(/\s+/g, ' ')
        const colorTotal = data.colors.length

        for (let i = 0; i < colorTotal; i++) {
            const reg = new RegExp(`{{color:${i}}}`, 'g')
            let reColor = Array.isArray(color)
                ? color[i] || data.colors[i]
                : color || data.colors[i]

            if (reColor.startsWith('--')) {
                reColor = `var(${reColor})`
            }

            tpl = tpl.replace(reg, reColor)
        }

        domEl.current.innerHTML = tpl
    }, [name, color, size])

    const rem = ui.toRem(size)

    return (
        <div
            className={classnames('icon-font', className)}
            ref={domEl}
            style={{
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: rem,
                height: rem,
                ...style,
            }}></div>
    )
}

export default React.memo(IconFont)
