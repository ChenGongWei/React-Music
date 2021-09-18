const remUnit = 37.5

const dpi = window.devicePixelRatio || 1

const ui = {
    toRem: (px: number) => {
        return (px / remUnit).toFixed(6) + 'rem'
    },
    dpi,
}

export default ui
