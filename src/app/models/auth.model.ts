export interface UserRegistrationData {
    firstName: string,
    lastName: string,
    email: string,
    dob: string,
    gender: string,
    password: string;
}

export interface UserLoginCredentials {
    email: string,
    password: string
}

export interface AuthUser {
    isAdmin: boolean
    isActive: boolean
    _id: string
    firstName: string
    lastName: string
    email: string
    dob: string
    gender: string
    photoId: string
    token: string
    createdDate: string
}