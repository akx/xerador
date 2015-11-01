const alea = require("./alea");
const trim = require("lodash/string/trim");
const zipObject = require("lodash/array/zipObject");

const identity = (v) => v;

function buildTable(tableText, map = identity) {
    var probSum = 0;
    var cumulValues = [];
    tableText.split("\n").forEach(function (line) {
        if (/^#/.test(line)) return;
        var [value, prob] = trim(line).split(";", 2);
        if (!value.length) return;
        prob = parseInt(prob, 10);
        if (isNaN(prob)) prob = 1;
        cumulValues.push([prob, map(value)]);
        probSum += prob;
    });
    const gen = function (rng, arg = null) {
        var val = rng();
        if (arg === "equal") {
            const idx = 0 | (val * cumulValues.length);
            return cumulValues[idx][1];
        }
        var skew = parseFloat(arg);
        if (skew && !isNaN(skew)) {
            if (skew < 0) skew = 1 / -skew;
            val = Math.pow(val, skew);
        }
        val *= probSum;
        for (var i = 0; i < cumulValues.length; i++) {
            val -= cumulValues[i][0];
            if (val < 0) return cumulValues[i][1];
        }
    };
    gen.list = cumulValues;
    return gen;
}

function evaluate(rng, rule, tables) {
    return rule.replace(/{(.+?)}/gi, (m, expr) => {
        return expr.split("|").map(trim).reduce((curr, bit) => {
            var [fn, arg] = bit.split(":", 2);
            if (tables[fn]) return tables[fn](rng, arg);
            if (curr[fn]) return curr[fn].call(curr);
            return `${curr} (${fn}???)`;
        }, "");
    });
}

module.exports = function (ctrl) {
    const rng = alea(ctrl.seed || ("" + +new Date()));
    const tables = zipObject(Object.keys(ctrl.tables).map((name) => [name, buildTable(ctrl.tables[name])]));
    const rules = buildTable(ctrl.rules);
    var output = [];
    for (var i = 0; i < ctrl.nGen; i++) {
        const rule = rules(rng);
        output.push(evaluate(rng, rule, tables));
    }
    if (ctrl.sortOutput) output = output.sort();
    return output;
};
