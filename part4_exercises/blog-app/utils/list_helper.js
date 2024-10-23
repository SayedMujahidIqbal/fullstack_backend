const dummy = (blogs) => {
   return blogs.length === 0 && 1
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

const authorWithMostBlogs = (blogs) => {
    const blog = blogs.reduce((maxBlogs, curr) => {
        if(maxBlogs.blogs < curr.blogs){
            maxBlogs = curr,blogs
        }
        return maxBlogs
    })
    return { author: blog.author, blogs: blog.blogs }
}


module.exports = {
    dummy, 
    calculateLikes,
    favoriteBlog,
    authorWithMostBlogs
}