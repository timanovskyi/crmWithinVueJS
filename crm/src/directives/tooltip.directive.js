import * as M from 'materialize-css/dist/js/materialize.min'

export default {
    bind(el, {value}) {
        M.Tooltip.init(el, {html: value})
    },
    unbind(el) {
        const t = M.Tooltip.getInstance(el);

        if (t && t.destroy) {
            t.destroy()
        }
    }
}
