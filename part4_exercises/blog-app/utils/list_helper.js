const dummy = (blogs) => {
    return 1
}

const calculateLikes = (blogs) => {


    if(blogs.length === 0){
        return 0
    } else if(blogs.length === 1){
        return blogs.likes
    } else{
        return blogs.reduce((totalLikes, curr) => {
            return totalLikes + curr.likes
        }, 0)
    }
}


module.exports = {
    dummy, calculateLikes
}