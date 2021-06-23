const Post = require('../models/Post');

const thisRange = (page, rangeObj) => {
    if (Number(page) < rangeObj.start){
        rangeObj.currRange -= 1;
        rangeObj.start = rangeObj.currRange * rangeObj.rangeSize + 1;
        rangeObj.end = (rangeObj.currRange + 1) * rangeObj.rangeSize;
    } 
    
    else if (Number(page) > rangeObj.end) {
        rangeObj.currRange += 1;
        rangeObj.start = rangeObj.currRange * rangeObj.rangeSize + 1;
        if(rangeObj.currRange < rangeObj.numOfRange - 1) {
            rangeObj.end = (rangeObj.currRange + 1) * rangeObj.rangeSize;
        } else if (rangeObj.currRange === rangeObj.numOfRange - 1){
            rangeObj.end = rangeObj.numOfPage;
        }
    }
    else {
        rangeObj.start = rangeObj.currRange * rangeObj.rangeSize + 1;
        rangeObj.end = rangeObj.numOfPage < rangeObj.rangeSize ? rangeObj.numOfPage : (rangeObj.currRange + 1) * rangeObj.rangeSize;
    }
    return Array.from({length: (rangeObj.end - rangeObj.start + 1)}, (undefined, i) => i + rangeObj.start);
}

const pagination = async (req, res, next) => {
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const skip = (page - 1) * limit;
    const total = await Post.estimatedDocumentCount();
    const numOfPage = parseInt(Math.ceil(total/limit));
    const rangeSize = 4;
    const rangeObj = {
        currRange: 0,
        rangeSize,
        numOfRange: parseInt(Math.ceil(numOfPage/rangeSize)),
        start: 1,
        end: numOfPage < rangeSize ? numOfPage : 4,
        numOfPage
    }
    const results = {};
    try {
        results.results = await Post.find({}).setOptions({
            sort: {
                "createdAt" : -1
            },
            limit, skip
        });
        results.numOfPage = parseInt(numOfPage);

        req.pageArray = thisRange(page, rangeObj);
        res.paginatedResults = results;
        next();
    } catch (e) {
        throw new Error(e);
    }
}

module.exports = pagination;

