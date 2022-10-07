import { SafeUrl } from "@angular/platform-browser"

export interface Post {
    isActive: boolean
    id: string
    post: string
    userId: string
    userName: string
    userPhotoId: string
    postImageId: string
    isAdmin: boolean
    profession: string
    createdDate: string
}

export interface NewPost {
    post: string
    userId: string
    userName: string
    userPhotoId: string
    postImageId: string
    isAdmin: boolean
    profession: string
}

export interface DisplayPost extends Post {
    postImageUrl?: string | SafeUrl
    userPhotoUrl?: string | SafeUrl
}