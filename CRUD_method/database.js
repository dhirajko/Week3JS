'use strict'
class database {
    constructor() {
        this.mongoose = require('mongoose');
    }

    connectdatabase(dbURL) {
        this.mongoose.connect(dbURL).then(() => {
            console.log('connected successfully');
            //this.createSchema();

        }, err => {
            console.log('Connection to db failed: ' + err);
        })

    }
    createSchema() {
        let ImageSchema = this.mongoose.Schema;
        const CatSchema = new ImageSchema({
            name: String,
            dob: Date,
            gender: {
                type: String,
                enum: ['male', 'female'],
            },
            color: String,
            weight: Number,
            image: String,
            location: Object

        });
        return CatSchema;
    }
    createModel(name,Schema) {
        return this.mongoose.model(name,Schema);
    }

}
module.exports = new database();