const entry = function() {
    //  imported modules
    const express = require('express');
    const hbs = require('hbs');
    const path = require('path');
    const moment = require('moment');
    
    require('./db/mongoose');
    const postRoute = require('./routes/post');
    const userRoute = require('./routes/user');
    
    //  express settings
    const port = process.env.PORT || 3000;
    const app = express();
    
    //  paths
    const publicPath = path.join(__dirname, '../public');
    const partialsPath = path.join(__dirname, '../template/partials');
    const viewsPath = path.join(__dirname, '../template/views');
    
    // hbs settings
    app.set('view engine', 'hbs');
    app.set('views', viewsPath);
    hbs.registerPartials(partialsPath);
    
    //  hbs helpers
    hbs.registerHelper('incremented', number => ++number);
    hbs.registerHelper('decremented', number => --number);
    hbs.registerHelper('dateFormat', (createdAt) => {
        //if post is posted today, set data format 'HH:mm'
        //it it is posted another day, set data format 'YYYY-MM-DD'
        const momentPost = moment(createdAt);
        const momentToday = moment();
        const postDate = momentPost.date();
        const todayDate = momentToday.date();
        if(postDate === todayDate){
            return momentPost.format('HH:mm')
        }
        else{
            return momentPost.format('YYYY-MM-DD');
        }
    });
    hbs.registerHelper('isHiddenPrev', function(currPg, options) {
        const curr = Number(currPg);
        return curr === 1 ? options.fn(this) : options.inverse(this);
    });
    hbs.registerHelper('isHiddenNext', function(currPg, totalPg, options) {
        const curr = Number(currPg);
        return curr === totalPg ? options.fn(this) : options.inverse(this);
    });
    hbs.registerHelper('dateFormatForPost', (createdAt) => {
        //if post is posted today, set data format 'HH:mm'
        //it it is posted another day, set data format 'YYYY-MM-DD'
        const momentPost = moment(createdAt);
        const momentToday = moment();
        const postDate = momentPost.date();
        const todayDate = momentToday.date();
        return momentPost.format('YYYY.MM.DD') + " " + momentPost.format('HH:mm');
    });
    
    
    //  app.use() properties
    app.use(express.static(publicPath));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(postRoute);
    app.use(userRoute);
    
    
    
    return app.listen(port, () => {
        console.log(`Server is up on port: ${port}`);
    })
}();