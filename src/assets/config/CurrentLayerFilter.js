let Layer = [
    {
        title: "Shell油站",
        id: "shellyz",
        list: [{
            queryfield: "站名",
            type: "input",
            placeholder: "油站名称",
            field: "站名",
            queryrelation: "IndexOf",
            dataType: "string",
            value: ""
        },
        {
            queryfield: "编号",
            type: "input",
            placeholder: "油站编号",
            field: "油站编号",
            queryrelation: "IndexOf",
            dataType: "string",
            value: ""
        },
        {
            queryfield: "高速公路",
            type: "radio",
            typeValue: [{
                label: "不限"
            },
            {
                label: "高速"
            },
            {
                label: "非高速"
            }
            ],
            field: "是否高速公路",
            queryrelation: "booleanExist-false",
            value: 0,
            dataType: "string"
        },
        {
            queryfield: "是否CRT油站",
            type: "checkbox",
            typeValue: [{
                label: "是"
            },
            {
                label: "否"
            }
            ],
            field: "是否CRT油站",
            dataType: "bool?",
            queryrelation: "booleanExist-false",
            value: ["是", "否"]
        },
        {
            display: -1,
            queryfield: "是否VA油站",
            type: "checkbox",
            typeValue: [{
                label: "是"
            },
            {
                label: "否"
            }
            ],
            field: "是否VA油站",
            dataType: "bool?",
            queryrelation: "booleanExist-false",
            value: ["是", "否"]
        },
        {
            display: -1,
            queryfield: "B2B销量支持",
            type: "input",
            placeholder: "B2B销量支持(CRT)",
            field: "B2B销量支持",
            dataType: "string",
            queryrelation: "indexOf",
            value: ""
        },
        {
            display: -1,
            queryfield: "网络策略",
            type: "checkbox",
            typeValue: [{
                label: "填补空白"
            },
            {
                label: "网格加密"
            }
            ],
            field: "网络策略",
            dataType: "string",
            queryrelation: "Multiple-Equal",
            value: ["填补空白", "网格加密"]
        },
        {
            queryfield: "经营状况",
            type: "checkbox",
            typeValue: [{
                label: "停业"
            },
            {
                label: "在建"
            },
            {
                label: "开业"
            }
            ],
            field: "经营状况",
            queryrelation: "Multiple-Equal",
            dataType: "string",
            value: ["停业", "在建", "开业"]
        },
        {
            queryfield: "按区域",
            type: "radio",
            typeValue: [{
                label: "不限"
            },
            {
                label: "自定义(在地图上绘制区域)",
                inCa: true
            }
            ],
            field: "",
            queryrelation: "inCa",
            dataType: "string",
            value: 0
        },
        {
            queryfield: "销量(>=)",
            type: "input",
            placeholder: "日销量/k",
            units: "/k",
            field: "",
            queryrelation: "ATP>",
            dataType: "double",
            value: ""
        },
        {
            queryfield: "销量(<=)",
            type: "input",
            placeholder: "日销量/k",
            units: "/k",
            field: "",
            queryrelation: "ATP<",
            dataType: "double",
            value: ""
        },
        {
            queryfield: "网络名",
            type: "input",
            placeholder: "小网络名",
            field: "小网络名",
            queryrelation: "IndexOf",
            dataType: "string",
            value: ""
        },
        {
            queryfield: "网络类型",
            type: "input",
            placeholder: "网络类型1",
            field: "网络类型1",
            queryrelation: "IndexOf",
            dataType: "string",
            value: ""
        },
        {
            queryfield: "路名",
            type: "input",
            placeholder: "路名",
            field: "路名",
            queryrelation: "IndexOf",
            dataType: "string",
            value: ""
        },
        // {
        //     queryfield: "状态",
        //     type: "checkbox",

        //     value: ["Pre-id", "id", "Contract", "Construction", "License", "Open"],
        //     typeValue: [{
        //             label: "Pre-id"
        //         },
        //         {
        //             label: "id"
        //         },
        //         {
        //             label: "Contract"
        //         },
        //         {
        //             label: "Construction"
        //         },
        //         {
        //             label: "License"
        //         },
        //         {
        //             label: "Open"
        //         }
        //     ]
        // },
        {
            queryfield: "开业时间",
            type: "date",
            placeholder: "选择日期",
            format: "yyyy-MM-dd",
            field: "开业时间",
            queryrelation: "=",
            dataType: "datetime",
            value: ""
        }
        ]
    },
    {
        title: "高速油站",
        id: "gsyz",
        list: [{
            queryfield: "站名",
            type: "input",
            placeholder: "油站名称",
            field: "站名",
            queryrelation: "IndexOf",
            dataType: "string",
            value: ""
        },
        {
            queryfield: "编号",
            type: "input",
            placeholder: "油站编号",
            field: "油站编号",
            queryrelation: "IndexOf",
            dataType: "string",
            value: ""
        },
        {
            queryfield: "高速公路",
            type: "radio",
            typeValue: [{
                label: "不限"
            },
            {
                label: "高速"
            },
            {
                label: "非高速"
            }
            ],
            field: "是否高速公路",
            queryrelation: "booleanExist-false",
            value: 0,
            dataType: "string"
        },
        {
            queryfield: "是否CRT油站",
            type: "checkbox",
            typeValue: [{
                label: "是"
            },
            {
                label: "否"
            }
            ],
            field: "是否CRT油站",
            dataType: "bool?",
            queryrelation: "booleanExist-false",
            value: ["是", "否"]
        },
        {
            display: -1,
            queryfield: "是否VA油站",
            type: "checkbox",
            typeValue: [{
                label: "是"
            },
            {
                label: "否"
            }
            ],
            field: "是否VA油站",
            dataType: "bool?",
            queryrelation: "booleanExist-false",
            value: ["是", "否"]
        },
        {
            display: -1,
            queryfield: "B2B销量支持",
            type: "input",
            placeholder: "B2B销量支持(CRT)",
            field: "B2B销量支持",
            dataType: "string",
            queryrelation: "indexOf",
            value: ""
        },
        {
            display: -1,
            queryfield: "网络策略",
            type: "checkbox",
            typeValue: [{
                label: "填补空白"
            },
            {
                label: "网格加密"
            }
            ],
            field: "网络策略",
            dataType: "string",
            queryrelation: "Multiple-Equal",
            value: ["填补空白", "网格加密"]
        },
        {
            queryfield: "经营状况",
            type: "checkbox",
            typeValue: [{
                label: "停业"
            },
            {
                label: "在建"
            },
            {
                label: "开业"
            }
            ],
            field: "经营状况",
            queryrelation: "Multiple-Equal",
            dataType: "string",
            value: ["停业", "在建", "开业"]
        },
        {
            queryfield: "按区域",
            type: "radio",
            typeValue: [{
                label: "不限"
            },
            {
                label: "自定义(在地图上绘制区域)",
                inCa: true
            }
            ],
            field: "",
            queryrelation: "inCa",
            dataType: "string",
            value: 0
        },
        {
            queryfield: "销量(>=)",
            type: "input",
            placeholder: "日销量/k",
            units: "/k",
            field: "",
            queryrelation: "ATP>",
            dataType: "double",
            value: ""
        },
        {
            queryfield: "销量(<=)",
            type: "input",
            placeholder: "日销量/k",
            units: "/k",
            field: "",
            queryrelation: "ATP<",
            dataType: "double",
            value: ""
        },
        {
            queryfield: "网络名",
            type: "input",
            placeholder: "小网络名",
            field: "小网络名",
            queryrelation: "IndexOf",
            dataType: "string",
            value: ""
        },
        {
            queryfield: "网络类型",
            type: "input",
            placeholder: "网络类型1",
            field: "网络类型1",
            queryrelation: "IndexOf",
            dataType: "string",
            value: ""
        },
        {
            queryfield: "路名",
            type: "input",
            placeholder: "路名",
            field: "路名",
            queryrelation: "IndexOf",
            dataType: "string",
            value: ""
        },
        // {
        //     queryfield: "状态",
        //     type: "checkbox",

        //     value: ["Pre-id", "id", "Contract", "Construction", "License", "Open"],
        //     typeValue: [{
        //             label: "Pre-id"
        //         },
        //         {
        //             label: "id"
        //         },
        //         {
        //             label: "Contract"
        //         },
        //         {
        //             label: "Construction"
        //         },
        //         {
        //             label: "License"
        //         },
        //         {
        //             label: "Open"
        //         }
        //     ]
        // },
        {
            queryfield: "开业时间",
            type: "date",
            placeholder: "选择日期",
            format: "yyyy-MM-dd",
            field: "开业时间",
            queryrelation: "=",
            dataType: "datetime",
            value: ""
        }
        ]
    },
    {
        title: "现有油站",
        id: "xyyz",
        list: [{
            queryfield: "站名",
            type: "input",
            placeholder: "油站名称",
            field: "站名",
            queryrelation: "IndexOf",
            dataType: "string",
            value: ""
        },
        {
            queryfield: "编号",
            type: "input",
            placeholder: "油站编号",
            field: "油站编号",
            queryrelation: "IndexOf",
            dataType: "string",
            value: ""
        },
        {
            queryfield: "高速公路",
            type: "radio",
            typeValue: [{
                label: "不限"
            },
            {
                label: "高速"
            },
            {
                label: "非高速"
            }
            ],
            field: "是否高速公路",
            queryrelation: "booleanExist-false",
            value: 0,
            dataType: "string"
        },
        {
            queryfield: "是否CRT油站",
            type: "checkbox",
            typeValue: [{
                label: "是"
            },
            {
                label: "否"
            }
            ],
            field: "是否CRT油站",
            dataType: "bool?",
            queryrelation: "booleanExist-false",
            value: ["是", "否"]
        },
        {
            display: -1,
            queryfield: "是否VA油站",
            type: "checkbox",
            typeValue: [{
                label: "是"
            },
            {
                label: "否"
            }
            ],
            field: "是否VA油站",
            dataType: "bool?",
            queryrelation: "booleanExist-false",
            value: ["是", "否"]
        },
        {
            display: -1,
            queryfield: "B2B销量支持",
            type: "input",
            placeholder: "B2B销量支持(CRT)",
            field: "B2B销量支持",
            dataType: "string",
            queryrelation: "indexOf",
            value: ""
        },
        {
            display: -1,
            queryfield: "网络策略",
            type: "checkbox",
            typeValue: [{
                label: "填补空白"
            },
            {
                label: "网格加密"
            }
            ],
            field: "网络策略",
            dataType: "string",
            queryrelation: "Multiple-Equal",
            value: ["填补空白", "网格加密"]
        },
        {
            queryfield: "经营状况",
            type: "checkbox",
            typeValue: [{
                label: "停业"
            },
            {
                label: "在建"
            },
            {
                label: "开业"
            }
            ],
            field: "经营状况",
            queryrelation: "Multiple-Equal",
            dataType: "string",
            value: ["停业", "在建", "开业"]
        },
        {
            queryfield: "按区域",
            type: "radio",
            typeValue: [{
                label: "不限"
            },
            {
                label: "自定义(在地图上绘制区域)",
                inCa: true
            }
            ],
            field: "",
            queryrelation: "inCa",
            dataType: "string",
            value: 0
        },
        {
            queryfield: "销量(>=)",
            type: "input",
            placeholder: "日销量/k",
            units: "/k",
            field: "",
            queryrelation: "ATP>",
            dataType: "double",
            value: ""
        },
        {
            queryfield: "销量(<=)",
            type: "input",
            placeholder: "日销量/k",
            units: "/k",
            field: "",
            queryrelation: "ATP<",
            dataType: "double",
            value: ""
        },
        {
            queryfield: "网络名",
            type: "input",
            placeholder: "小网络名",
            field: "小网络名",
            queryrelation: "IndexOf",
            dataType: "string",
            value: ""
        },
        {
            queryfield: "网络类型",
            type: "input",
            placeholder: "网络类型1",
            field: "网络类型1",
            queryrelation: "IndexOf",
            dataType: "string",
            value: ""
        },
        {
            queryfield: "路名",
            type: "input",
            placeholder: "路名",
            field: "路名",
            queryrelation: "IndexOf",
            dataType: "string",
            value: ""
        },
        // {
        //     queryfield: "状态",
        //     type: "checkbox",

        //     value: ["Pre-id", "id", "Contract", "Construction", "License", "Open"],
        //     typeValue: [{
        //             label: "Pre-id"
        //         },
        //         {
        //             label: "id"
        //         },
        //         {
        //             label: "Contract"
        //         },
        //         {
        //             label: "Construction"
        //         },
        //         {
        //             label: "License"
        //         },
        //         {
        //             label: "Open"
        //         }
        //     ]
        // },
        {
            queryfield: "开业时间",
            type: "date",
            placeholder: "选择日期",
            format: "yyyy-MM-dd",
            field: "开业时间",
            queryrelation: "=",
            dataType: "datetime",
            value: ""
        }
        ]
    },
    {
        title: "MA",
        id: "MA",
        list: [{
            queryfield: "关键字",
            type: "input",
            queryrelation: "IndexOf",
            placeholder: "查找任意字段包含本文本的对象",
            value: ""
        }]
    },
    {
        title: "NTI",
        id: "NTI",
        list: [{
            queryfield: "关键字",
            type: "input",
            queryrelation: "IndexOf",
            placeholder: "查找任意字段包含本文本的对象",
            value: ""
        },
        {
            queryfield: "是否CRT油站",
            type: "checkbox",
            typeValue: [{
                label: "是"
            },
            {
                label: "否"
            }
            ],
            field: "是否CRT油站",
            dataType: "bool?",
            queryrelation: "booleanExist-false",
            value: ["是", "否"]
        }, {
            display: -1,
            queryfield: "是否VA油站(CRT)",
            type: "checkbox",
            typeValue: [{
                label: "是"
            },
            {
                label: "否"
            }
            ],
            field: "是否VA油站",
            dataType: "bool?",
            queryrelation: "booleanExist-false",
            value: ["是", "否"]
        },
        {
            display: -1,
            queryfield: "B2B销量支持(CRT)",
            type: "input",
            placeholder: "B2B销量支持(CRT)",
            field: "B2B销量支持",
            dataType: "string",
            queryrelation: "indexOf",
            value: ""
        },
        {
            display: -1,
            queryfield: "网络策略(CRT)",
            type: "checkbox",
            typeValue: [{
                label: "填补空白"
            },
            {
                label: "网格加密"
            }
            ],
            field: "网络策略",
            dataType: "string",
            queryrelation: "Multiple-Equal",
            value: ["填补空白", "网格加密"]
        },
        ]
    },
    {
        title: "POI",
        id: "POI",
        list: [{
            queryfield: "编号",
            type: "input",
            queryrelation: "IndexOf",
            placeholder: "POI编号",
            value: ""
        },
        {
            queryfield: "名称",
            type: "input",
            queryrelation: "IndexOf",
            placeholder: "POI名称",
            value: ""
        },
        {
            queryfield: "按区域",
            type: "radio",
            typeValue: [{
                label: "不限"
            },
            {
                label: "自定义(在地图上绘制区域)",
                inCa: true
            }
            ],
            field: "",
            queryrelation: "inCa",
            dataType: "string",
            value: 0
        },
        {
            queryfield: "MA",
            type: "input",
            queryrelation: "IndexOf",
            placeholder: "MA",
            value: ""
        },
        {
            queryfield: "POI类型",
            type: "input",
            queryrelation: "IndexOf",
            placeholder: "POI类型",
            value: ""
        },
        {
            queryfield: "POI级别",
            type: "checkbox",
            queryrelation: "Multiple-Equal",
            value: ["高", "中", "低"],
            typeValue: [{
                label: "高"
            },
            {
                label: "中"
            },
            {
                label: "低"
            }
            ]
        },
        {
            queryfield: "周边柴油需求",
            type: "input",
            queryrelation: "IndexOf",
            placeholder: "周边柴油需求",
            value: ""
        },
        {
            queryfield: "未来发展",
            type: "input",
            queryrelation: "IndexOf",
            placeholder: "未来发展",
            value: ""
        },
        {
            queryfield: "分区",
            type: "input",
            queryrelation: "IndexOf",
            placeholder: "分区",
            value: ""
        },
        {
            queryfield: "B2B建议",
            type: "input",
            queryrelation: "IndexOf",
            placeholder: "B2B建议",
            value: ""
        },
        {
            queryfield: "是否重点POIs",
            type: "checkbox",
            querytype: "bool",
            queryrelation: "=",
            value: ["高", "中", "低"],
            typeValue: [{
                label: "高"
            },
            {
                label: "中"
            },
            {
                label: "低"
            }
            ]
        },
        {
            queryfield: "是否网络覆盖",
            type: "checkbox",
            querytype: "bool",
            queryrelation: "=",
            value: [],
            typeValue: [{}]
        }
        ]
    }
];

export default Layer;