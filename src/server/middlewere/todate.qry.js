const errExep = require("../../err.exeption");
module.exports = (req, res, next) => {
    const  qryDate  = req.query.date;
    let date ;
    if (qryDate) {
        date =new Date(qryDate) ;
    }
    const  bodyDate  = req.body.date;
    if (bodyDate) {
        date =new Date(bodyDate) ;
    }
    if (!date) next()
    req.date = date
       
    
    next();


};

