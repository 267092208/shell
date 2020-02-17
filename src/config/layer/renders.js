/**
 * @module 图层渲染器配置 
 */

const renders = {
    "xyyz": [
        {
            name: '按品牌显示',
            type: 'unique-value',
            field: '品牌-是否停业',
            defaultSymbol: {
                type: 'picture-marker',
                url: '/sysPages/styleHandlers/Icons/yz.png',
                width: 24,
                height: 24,
                anchor: 'center'
            },
            uniqueValueInfos: [
                // SP
                {
                    value: 'SP-false',
                    symbol: {
                        type: 'picture-marker',
                        url: '/sysPages/styleHandlers/Icons/635165835936941250.png',
                        width: 24,
                        height: 24,
                        anchor: 'center'
                    }
                },
                {
                    value: 'SP-true',
                    symbol: {
                        type: 'picture-marker',
                        url: '/sysPages/styleHandlers/Icons/635165835936941250.png-gray.png',
                        width: 24,
                        height: 24,
                        anchor: 'center'
                    }
                },
                // PC
                {
                    value: 'PC-false',
                    symbol: {
                        type: 'picture-marker',
                        url: '/sysPages/styleHandlers/Icons/635165835991316250.png',
                        width: 24,
                        height: 24,
                        anchor: 'center'
                    }
                },
                {
                    value: 'PC-true',
                    symbol: {
                        type: 'picture-marker',
                        url: '/sysPages/styleHandlers/Icons/635165835991316250.png-gray.png',
                        width: 24,
                        height: 24,
                        anchor: 'center'
                    }
                },
                // BPPC
                {
                    value: 'BPPC-false',
                    symbol: {
                        type: 'picture-marker',
                        url: '/sysPages/styleHandlers/Icons/635165836054441250.png',
                        width: 24,
                        height: 24,
                        anchor: 'center'
                    }
                },
                {
                    value: 'BPPC-true',
                    symbol: {
                        type: 'picture-marker',
                        url: '/sysPages/styleHandlers/Icons/635165836054441250.png-gray.png',
                        width: 24,
                        height: 24,
                        anchor: 'center'
                    }
                },
                // IND
                {
                    value: 'IND-false',
                    symbol: {
                        type: 'picture-marker',
                        url: '/sysPages/styleHandlers/Icons/635165836104128750.png',
                        width: 24,
                        height: 24,
                        anchor: 'center'
                    }
                },
                {
                    value: 'IND-true',
                    symbol: {
                        type: 'picture-marker',
                        url: '/sysPages/styleHandlers/Icons/635165836104128750.png-gray.png',
                        width: 24,
                        height: 24,
                        anchor: 'center'
                    }
                },
                // CNOOC
                {
                    value: 'CNOOC-false',
                    symbol: {
                        type: 'picture-marker',
                        url: '/sysPages/styleHandlers/Icons/635168276804919539.png',
                        width: 24,
                        height: 24,
                        anchor: 'center'
                    }
                },
                {
                    value: 'CNOOC-true',
                    symbol: {
                        type: 'picture-marker',
                        url: '/sysPages/styleHandlers/Icons/635168276804919539.png-gray.png',
                        width: 24,
                        height: 24,
                        anchor: 'center'
                    }
                },
                // SC
                {
                    value: 'SC-false',
                    symbol: {
                        type: 'picture-marker',
                        url: '/sysPages/styleHandlers/Icons/635168276872418675.png',
                        width: 24,
                        height: 24,
                        anchor: 'center'
                    }
                },
                {
                    value: 'SC-true',
                    symbol: {
                        type: 'picture-marker',
                        url: '/sysPages/styleHandlers/Icons/635168276872418675.png-gray.png',
                        width: 24,
                        height: 24,
                        anchor: 'center'
                    }
                },
                // Caltex
                {
                    value: 'Caltex-false',
                    symbol: {
                        type: 'picture-marker',
                        url: '/sysPages/styleHandlers/Icons/635168276919605571.png',
                        width: 24,
                        height: 24,
                        anchor: 'center'
                    }
                },
                {
                    value: 'Caltex-true',
                    symbol: {
                        type: 'picture-marker',
                        url: '/sysPages/styleHandlers/Icons/635168276919605571.png-gray.png',
                        width: 24,
                        height: 24,
                        anchor: 'center'
                    }
                },
                // YC Shell
                {
                    value: 'YC Shell-false',
                    symbol: {
                        type: 'picture-marker',
                        url: '/sysPages/styleHandlers/Icons/635165836217410000.png',
                        width: 24,
                        height: 24,
                        anchor: 'center'
                    }
                },
                {
                    value: 'YC Shell-true',
                    symbol: {
                        type: 'picture-marker',
                        url: '/sysPages/styleHandlers/Icons/635165836217410000.png-gray.png',
                        width: 24,
                        height: 24,
                        anchor: 'center'
                    }
                },
                // 停车场
                {
                    value: '停车场-false',
                    symbol: {
                        type: 'picture-marker',
                        url: '/sysPages/styleHandlers/Icons/636202504781415330.png',
                        width: 24,
                        height: 24,
                        anchor: 'center'
                    }
                },
                {
                    value: '停车场-true',
                    symbol: {
                        type: 'picture-marker',
                        url: '/sysPages/styleHandlers/Icons/636202504781415330.png-gray.png',
                        width: 24,
                        height: 24,
                        anchor: 'center'
                    }
                },
                // TOPE
                {
                    value: 'TOPE-false',
                    symbol: {
                        type: 'picture-marker',
                        url: '/sysPages/styleHandlers/Icons/TOPE.png',
                        width: 24,
                        height: 24,
                        anchor: 'center'
                    }
                },
                {
                    value: 'TOPE-true',
                    symbol: {
                        type: 'picture-marker',
                        url: '/sysPages/styleHandlers/Icons/TOPE.png-gray.png',
                        width: 24,
                        height: 24,
                        anchor: 'center'
                    }
                },
            ]
        },
        // {
        //     name: '小图标',

        // }
    ]
}

renders["shellyz"] = renders["gsyz"] = renders["xyyz"];

export default renders