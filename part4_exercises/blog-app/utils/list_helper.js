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

const favoriteBlog = (blogs) => {
    const blog = blogs.reduce((max, curr) => {
        if(max.likes < curr.likes){
            max = curr
        }
        return max
    })
    return { 
        title: blog.title, 
        author: blog.author, 
        likes: blog.likes 
    }
}


module.exports = {
    dummy, 
    calculateLikes,
    favoriteBlog
}