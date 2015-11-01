const m = require("mithril");
const _ = require("lodash");

module.exports = function () {
    const self = this;
    self.tables = {};
    self.output = [];
    self.currentTable = null;
    self.nGen = 10;
    self.rules = "";
    self.sortOutput = false;
    self.output = [];
    self.seed = null;
    self.loadDataset = function(dataset) {
        m.startComputation();
        try {

            self.tables = _.cloneDeep(dataset.tables || {});
            self.rules = dataset.rules || self.rules || "";
            self.currentTable = _.keys(self.tables)[0];
        } finally {
            m.endComputation();
        }
    };
};
