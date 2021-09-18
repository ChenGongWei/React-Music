import { parse } from 'svg-parser'
import * as glob from 'glob'
import * as path from 'path'
import * as fs from 'fs'
// import * as SVGO from 'svgo'

interface IconData {
    template: string
    colors: string[]
}

interface IconMap {
    [name: string]: IconData
}

interface Properties {
    [_: string]: string | number | boolean
}

interface VDomNode {
    type: 'root' | 'element'
    tagName: string
    properties: Properties
    children: VDomNode[]
    linearGradientMap: {
        [id: string]: string
    }
}

let linearGradientIx = 0

function filterProperties(
    tagName: string,
    props: Properties = {},
    colors: string[] = [],
    linearGradientMap: {
        [id: string]: string
    } = {}
) {
    switch (tagName) {
        case 'svg':
            props.width = '{{svgSize}}'
            props.height = '{{svgSize}}'
            break
    }

    if (!['linearGradient'].includes(tagName) && props.id) {
        delete props.id
    }
    if (tagName === 'linearGradient' && props.id) {
        linearGradientMap[String(props.id)] = '_lg_' + linearGradientIx++
        props.id = linearGradientMap[String(props.id)]
    }

    const colorAttrs = ['stop-color', 'stroke', 'fill']

    for (const attr of colorAttrs) {
        if (props[attr]) {
            const colorVal = String(props[attr])
            if (colorVal.startsWith('#') || colorVal.startsWith('rgb')) {
                const ix = colors.length
                colors.push(colorVal)
                props[attr] = `{{color:${ix}}}`
            }
        }
    }

    return props
}

function parseElement(
    el: VDomNode,
    colors: string[],
    linearGradientMap: {
        [id: string]: string
    }
): VDomNode | undefined {
    if (el.type !== 'root') {
        const igTagNames = ['title', 'text']
        return {
            type: el.type,
            tagName: el.tagName,
            linearGradientMap,
            properties: filterProperties(
                el.tagName,
                el.properties,
                colors,
                linearGradientMap
            ),
            // @ts-ignore
            children: (el.children || [])
                .filter(v => !igTagNames.includes(v.tagName))
                .map(v => parseElement(v, colors, linearGradientMap))
                .filter(v => v),
        }
    } else {
        for (const v of el.children) {
            if (v.type === 'element' && v.tagName === 'svg') {
                return parseElement(v, colors, linearGradientMap)
            }
        }
    }
}

function vDomToStr(el: VDomNode) {
    let attrs: string[] = []

    Object.keys(el.properties).forEach(v => {
        let props = String(el.properties[v]) || ''

        attrs.push(`${v}='${props}'`)
    })
    let svg: string = `<${el.tagName} ${attrs.join(' ')}>${el.children
        .map(v => vDomToStr(v))
        .join('')}</${el.tagName}>`

    return svg
}

export default async function gen(dir: string) {
    const files = glob.sync(`${dir}/*.svg`)

    const map: IconMap = {}
    const names: string[] = []

    for (const file of files) {
        const pathRes = path.parse(file)
        const name = pathRes.name
        names.push(name)

        const svgStr = fs.readFileSync(file, 'utf8')
        // console.log(svgStr)
        // const svgOpt = await svgo.optimize(svgStr, { path: file })
        // svgStr = svgOpt.data
        // console.log(svgStr)
        const res = parse(svgStr)

        const colors: string[] = []
        const rMap = {}
        const vDom = parseElement(res, colors, rMap)

        let svg = vDomToStr(vDom)
        const repKeys = Object.keys(rMap)

        for (const k of repKeys) {
            const reg = new RegExp('\\(#' + k + '\\)', 'g')
            svg = svg.replace(reg, '(#' + rMap[k] + ')')
        }

        if (vDom) {
            map[name] = {
                template: svg,
                colors,
            }
        }
    }

    return {
        map,
        names,
    }
}

// console.log(gen(path.join(__dirname, '../../src/assets/mall-svg')))
