require("style!css!stylus!./style.styl");
const m = require("mithril");
const view = require("./ui");
const controller = require("./ctrl");
const ctrl = m.mount(document.body, {controller, view});
ctrl.loadDataset(require("datasets/finnish-names"));
