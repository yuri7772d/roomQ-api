const errExep = require("../../err.exeption");
module.exports = (req, res, next) => {
    const qryDate = req.query?.date;
    let date;
    if (qryDate) {
        date = new Date(qryDate);
    }
    
    const bodyDate = req.body?.date;
    if (bodyDate) {
        date = new Date(bodyDate);
    }
    
    if (date) {
    date.setHours(0, 0, 0, 0);
    req.date = date
    }

    next();


};

