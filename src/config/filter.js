/**
 * @module 图层筛选项配置
 */


/***
 * @type {{[layerID:string]:Array<
 * {
 *  label:string,
 *  placeholder?:string,
 *  field?:string,
 *  type:'int'|'string'|'datetime'|'float'|'bool'|'int?'|'datetime?'|'float?'|'bool?'|'area',
 *  relation:'IASF'|'Multiple-IndexOf'|'Multiple-Equal'|'IndexOf'|'='|'!='|'>='|'<='|'booleanExist-false'|'inCa'|'inMa'|'inCity'|'inQx'|'cityOrMaIdsOrQuery',
 *  input:{
 *      type:'input'|'checkbox'|'radio'|'area',
 *      enmus?:Array<{text:string,value:any}>
 *  }
 * }
 * >}}
 */
const filter = {
    "xyyz": [
        {
            label: '站名',
            placeholder: '油站名称',
            field: '站名',
            relation: "IndexOf",
            type: 'string',
            input: { type: 'input' }
        },
        {
            label: '编号',
            placeholder: '油站编号',
            field: '油站编号',
            relation: "IndexOf",
            type: 'string',
            input: { type: 'input' }
        },
        {
            label: '品牌',
            placeholder: '品牌',
            field: '品牌',
            relation: "Multiple-Equal",
            type: 'string',
            input: {
                type: 'input',
                enmus: [
                    { "text": "YC Shell", "value": "YC Shell" },
                    { "text": "SP", "value": "SP" },
                    { "text": "PC", "value": "PC" },
                    { "text": "BPPC", "value": "BPPC" },
                    { "text": "IND", "value": "IND" },
                    { "text": "CNOOC", "value": "CNOOC" },
                    { "text": "SC", "value": "SC" },
                    { "text": "Caltex", "value": "Caltex" },
                    { "text": "停车场", "value": "停车场" },
                    { "text": "TOPE", "value": "TOPE" }
                ]
            }
        },
        {
            label: '是否CRT油站',
            field: '是否CRT油站',
            relation: 'booleanExist-false',
            type: 'bool?',
            input: { type: 'checkbox', enmus: [{ text: '是', value: true }, { text: '否', value: false }] }
        },
        {
            label: '经营状况',
            field: '经营状况',
            relation: "Multiple-Equal",
            type: 'string',
            input: {
                type: 'checkbox',
                enmus: [
                    { text: '停业', value: '停业' },
                    { text: '在建', value: '在建' },
                    { text: '开业', value: '开业' }
                ]
            }
        },
        {
            label: '自定义区域',
            relation: 'inCa',
            type: 'string',
            input: { type: 'area' }
        },
        {
            label: '销量(>=)',
            placeholder: '日销量/k',
            type: "float",
            relation: 'ATP>',
            input: { type: 'input' }
        },
        {
            label: '销量(<=)',
            placeholder: '日销量/k',
            type: "float",
            relation: 'ATP<',
            input: { type: 'input' }
        },
        {
            label: '网络名',
            placeholder: "小网络名",
            field: '小网络名',
            relation: 'IndexOf',
            type: 'string',
            input: { type: 'input' }
        },
        {
            label: '网络类型',
            placeholder: "网络类型",
            field: '网络类型1',
            type: 'string',
            relation: 'IndexOf',
            input: { type: 'input' }
        },
        {
            label: '路名',
            placeholder: "路名",
            field: '路名',
            relation: 'IndexOf',
            type: 'string',
            input: { type: 'input' }
        },
        {
            label: '状态',
            placeholder: "状态",
            field: '状态',
            relation: 'IndexOf',
            type: 'string',
            input: {
                type: 'checkbox',
                enmus: [
                    { "text": "Pre-id", "value": "Pre-id" },
                    { "text": "id", "value": "id" },
                    { "text": "Contract", "value": "Contract" },
                    { "text": "Construction", "value": "Construction" },
                    { "text": "License", "value": "License" },
                    { "text": "Open", "value": "Open" }
                ]
            }
        },
        {
            label: '开业时间',
            placeholder: "开业时间(yyyy-mm-dd)",
            field: '开业时间',
            relation: '=',
            type: 'datetime',
            input: { type: 'input' }
        }
    ],
    "ma":[
        {
            label: '关键字',
            placeholder: '查找包含本文本的任意字段',
            field: null,
            relation: "IASF",
            type: 'string',
            input: { type: 'input' }
        }
    ],
    "nti":[
        {
            label: '关键字',
            placeholder: '查找包含本文本的任意字段',
            field: null,
            relation: "IASF",
            type: 'string',
            input: { type: 'input' }
        },
        {
            label: '是否CRT油站',
            field: '是否CRT油站',
            relation: 'booleanExist-false',
            type: 'bool?',
            input: { type: 'checkbox', enmus: [{ text: '是', value: true }, { text: '否', value: false }] }
        }

    ]

}

filter['gsyz'] = filter['shellyz'] = filter['xyyz'];
filter['xzqh'] = filter['ma'] 
filter['gsnti'] =  filter['nti']
export default filter;