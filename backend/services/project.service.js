import Project from "../models/project.model.js";
import mongoose from 'mongoose';

export const createProject = async({name, userId}) => {
    if(!name){
        throw new Error('Name is required') ;
    }
    if(!userId){
        throw new Error('User ID is required') ;
    }
    const project = await Project.create({
        name,
        users: [userId]
    }) ;

    return project ;
}



export const getAllProjectByUserId = async({userid}) => {
    if(!userid){
        throw new Error('User ID is required') ;
    }
    
    const allUserProjects = await Project.find({users: userid}) ;
    return allUserProjects ;
}


export const addUsersToProject = async({projectId, users, userId}) => {
    if(!projectId){
        throw new Error('Project ID is required') ;
    }

    if(!userId){
        throw new Error('User ID is required') ;
    }
    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new Error('Invalid UserId') ;
    }

    if(!users || users.length === 0){
        throw new Error('Users are required') ;
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error('Invalid Project ID');
    }


    if(!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))){
        throw new Error('Invalid userIds in users array') ;
    }


    const project = await Project.findOne({
        _id: projectId,     // ye query do kaam karegi pahle to id ke basis pe find out karegi ki ye project h ki nhi   agar project mil kaya to ye bhi check karegi ki ye particular userId is particular project me h ya nhi  agar ye userId is project me nhi h to ye auautorize access ki gayi h
        users: userId
    })

    if(!project){
        throw new Error('Unauthorized Access   User do not belong to this project') ;
    }

    const updatedProject = await Project.findOneAndUpdate({
            _id: projectId
        } , 
        {
            $addToSet: {
                users: { $each: users }
            }
        
        },
        {
            new: true    // jo naya document milega wo return karana h
        } 
    )


    return updatedProject ;

}

export const getProjectById = async({projectId}) => {
    if(!projectId){
        throw new Error('Project ID is required') ;
    }
    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error('Invalid Project ID') ;
    }
    const project = await Project.findOne({_id: projectId}).populate('users') ; 
    
    return project ;
}