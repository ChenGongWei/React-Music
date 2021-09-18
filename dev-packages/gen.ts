
import svgGen from './svg'

import * as fs from 'fs-extra'
import * as path from 'path'

export interface Config {
    save_dir: string
    svg_dir?: string
    trim_icon_prefix: string
}

const rootDir = path.join(__dirname, '../')
const config = fs.readJSONSync(path.join(rootDir, 'iconfont.json')) as Config


function genProps(iconNames: string[]) {
    return `export interface Props {
    name: ${iconNames.map(v => `'${v}'`).join(' | ')}
    size?: number
    color?: string | string[]
    className?: string
}
`
}

async function main() {
    let iconNames: string[] = []
    let data: {
        [name: string]: {
            template: string
            colors: string[]
            // colorTotal: number
        }
    } = {}

    const dataPath = config.save_dir
    const sourcePath = config.save_dir

    if (config.svg_dir) {
        const res = await svgGen(path.join(rootDir, config.svg_dir))
        // console.log(res)
        if (res.names && res.names.length) {
            res.names.forEach(v => {
                if (iconNames.includes(v)) {
                    console.log(`icon name: ${v} 重复, 会被同名 svg 替换`)
                }
            })
            iconNames = iconNames.concat(res.names)
            data = {
                ...data,
                ...res.map,
            }
        }
    }

    // 生成 interface
    const typeFile = path.join(rootDir, sourcePath, 'type.d.ts')

    fs.ensureFileSync(typeFile)
    fs.writeFileSync(typeFile, genProps(iconNames), 'utf8')

    // 生成数据文件
    const dataFile = path.join(rootDir, dataPath, 'data.json')
    fs.ensureFileSync(dataFile)
    fs.writeJSONSync(dataFile, data)

    // console.log(data)
}

main()
