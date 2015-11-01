// Data via: https://www.avoindata.fi/data/en/organization/vaestorekisterikeskus
module.exports = {
    tables: {
        female: require("raw!./female.csv"),
        male: require("raw!./male.csv"),
        surname: require("raw!./surname.csv")
    },
    rules: "{surname}|{male};51\n{surname}|{female};50"
};
