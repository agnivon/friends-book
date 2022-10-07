import { SafeUrl } from "@angular/platform-browser"

export interface User {
    isAdmin: boolean
    isActive: boolean
    _id: string
    id: string
    firstName: string
    lastName: string
    email: string
    dob: string
    gender: string
    photoId: string
    createdDate: string
    phone?: string
    city?: string
    state?: string
    country?: string
    pincode?: string
    profession?: string
}

export interface DisplayUser extends User {
    photoUrl?: SafeUrl | string
    friendRequestStatus?: number
}

export interface FriendRequest {
    userId: string
    friendId: string
    status: string
    createdDate: string
    id: string
}

export interface FriendIdRequestMap {
    [friendId: string]: FriendRequest
} 