const m = require("mithril");
const cx = require("classnames");
const generate = require("./generate");
const set = require("lodash/object/set");

const tablesUi = function (ctrl) {
    return m("section#tables",
        m("div.tabbar", Object.keys(ctrl.tables).sort().map(
            (t) => m("a", {
                    href: "#",
                    onclick: () => set(ctrl, "currentTable", t),
                    className: cx({active: ctrl.currentTable === t})
                }, t
            )
        ), m("a", {
            href: "#", onclick: () => {
                const name = prompt("New table name?", "");
                if (name && name.length) {
                    ctrl.tables[name] = "";
                    ctrl.currentTable = name;
                }
            }
        }, "(new)")),
        m("div",
            m("textarea", {
                oninput: function () {
                    set(ctrl.tables, ctrl.currentTable, this.value);
                },
                value: ctrl.tables[ctrl.currentTable]
            }),
            m("button", {
                onclick: function () {
                    if (ctrl.currentTable && confirm("Delete table " + ctrl.currentTable + "?")) {
                        delete ctrl.tables[ctrl.currentTable];
                    }
                }
            }, "Delete table")
        )
    );
};

const rulesUi = function (ctrl) {
    return m("section#rules",
        m("div",
            "Generate ", m("input", {
                type: "number", min: 1, max: 1000, step: 1, value: ctrl.nGen,
                oninput: function () {
                    ctrl.nGen = 0 | this.value;
                }
            }), " entries",
            " with seed ", m("input", {
                placeholder: "(random)",
                value: ctrl.seed || "",
                oninput: function () {
                    ctrl.seed = this.value || null;
                }
            }),
            " and ", m("a", {
                href: "#",
                onclick: () => {
                    ctrl.sortOutput = !ctrl.sortOutput;
                }
            }, (ctrl.sortOutput ? "sort the output" : "don't sort the output"))
        ),
        m("textarea", {
            oninput: function () {
                ctrl.rules = this.value;
            },
            value: ctrl.rules
        })
    );
};

const outputUi = function (ctrl) {

    return m("table", ctrl.output.map(
        (line) => m("tr",
            line.split("|").map((column) => m("td", column))
        )
    ));
};

const view = function (ctrl) {
    return m("div#app",
        m("div#control",
            tablesUi(ctrl),
            rulesUi(ctrl),
            m("button#generate", {
                onclick: () => {
                    ctrl.output = generate(ctrl);
                }
            }, "Generate!"),
            m("a", {
                href: "#", onclick: () => {
                    const blob = new Blob([ctrl.output.join("\r\n")], {type: "text/plain"});
                    const ts = +new Date();
                    const a = document.createElement("a");
                    const url = a.href = URL.createObjectURL(blob);
                    a.download = `xerador-${ts}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(() => {
                        URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                    }, 4);
                }
            }, "Download current output as text")
        ),
        m("div#output", outputUi(ctrl))
    );
};

module.exports = view;
