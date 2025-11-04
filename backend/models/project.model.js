import mongoose from "mongoose";

const projectSchema=new mongoose.Schema({   
    name:{
        type: String,
        lowercase:true,
        trim:true,
        unique:[true, 'Project name must be unique'], //so that when the same project again tries to create it shows this 
        required:true,
    },

    users:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],     

})
const Project=mongoose.model('project',projectSchema);

export default Project;