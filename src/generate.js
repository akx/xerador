const alea = require("./alea");
const _ = require("lodash");

function buildTable(tableText, map=_.identity) {
    var probSum = 0;
    var cumulValues = [];
    tableText.split("\n").forEach(function(line) {
        if(/^#/.test(line)) return;
        var [value, prob] = _.trim(line).split(";", 2);
        if(!value.length) return;
        prob = parseInt(prob, 10);
        if(isNaN(prob)) prob = 1;
        cumulValues.push([prob, map(value)]);
        probSum += prob;
    });
    const gen = function(rng, arg=null) {
        if(arg === "equal") return _.sample(cumulValues)[1];
        var skew = parseFloat(arg);
        var val = rng();
        if(skew && !isNaN(skew)) {
            if(skew < 0) skew = 1 / -skew;
            val = Math.pow(val, skew);
        }
        val *= probSum;
        for(var i = 0; i < cumulValues.length; i++) {
            val -= cumulValues[i][0];
            if(val < 0) return cumulValues[i][1];
        }
    };
    gen.list = cumulValues;
    return gen;
}

function evaluate(rng, rule, tables) {
    return rule.replace(/{(.+?)}/gi, (m, expr) => {
        return _(expr.split("|")).map(_.trim).reduce((curr, bit) => {
            var [fn, arg] = bit.split(":", 2);
            if(tables[fn]) return tables[fn](rng, arg);
            if(_[fn]) return _[fn](curr);
            if(curr[fn]) return curr[fn].call(curr);
            return `${curr} (${fn}???)`;
        }, "");
    });
}

module.exports = function(ctrl) {
    const rng = alea(ctrl.seed || ("" + +new Date()));
    const tables = _(ctrl.tables).map((tableText, name) => [name, buildTable(tableText)]).zipObject().value();
    const rules = buildTable(ctrl.rules);
    var output = [];
    for(var i = 0; i < ctrl.nGen; i++) {
        const rule = rules(rng);
        output.push(evaluate(rng, rule, tables));
    }
    if(ctrl.sortOutput) output = output.sort();
    return output;
};
