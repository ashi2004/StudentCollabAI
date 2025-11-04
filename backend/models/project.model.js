import mongoose from "mongoose";

const projectSchema=new mongoose.Schema({   
    name:{
        type: String,
        lowercase:true,
        trim:true,
        unique:[true, 'Project name must be unique'],
        required:true,
    },

    users:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],     

})
const Project=mongoose.model('project',projectSchema);

export default Project;