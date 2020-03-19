import { createStyle } from "@/mapTool/uilt.js"

const featureHelp = {
    state: {

    },
    mutations: {

    },
    actions: {
        async getFeatureStyle(context, { strokeStyle, strokeColor, fillColor, fillOpacity }) {
            return createStyle(strokeStyle, strokeColor, fillColor, fillOpacity)
        }
    }
}

export default featureHelp;