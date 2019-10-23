const mongoose = require("mongoose");
const Schema = mongoose.Schema;


var TeacherSchema = new Schema (
    {
        nameTeacher: {type: String, required: true},
        lastnameTeacher:{type:String, required:true},
        mailTeacher:{type: String},
        passwordTeacher:{type:String},
        classTeacher:{type:String},
        token: {type:String}
    }
);

TeacherSchema.virtual('name').get(()=>{
    return (this.nameTeacher);
})

TeacherSchema.virtual('url').get(()=>{
    return '/teachers'
})

module.exports = mongoose.model('teacher',TeacherSchema);