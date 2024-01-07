# Problem Statement: Build an online friends book web application using Angular.

## Background: 
Friends Book is a popular social networking web application that allows registered users to connect with friends. Users can send requests, write posts, and share pictures among friends. This web application is a regular stop for millions of users. Since it is designed using traditional web development methodologies, navigating to a different page of the application resulted in reloading the entire page. With the increase in web traffic, the website load time increased significantly, which in turn impacted the speed and performance of the website. Also, the website could not adapt to different resolutions and device screens. All these challenges led to an unsatisfied user experience. So, the company decided to upgrade their website using the Angular Framework to focus on building a responsive and customer-oriented single-page web application.

## Goal: 
The objective is to develop a RESTful web application that can be easily adopted by users to engage them in social activities with a faster and safer web environment. The framework will be built in a way that ensures maximum re-usability.

## Use Cases: 
The application is designed to provide user-specific functionality. We will have two users for this application:

### Admin: 
An admin will be able to:
- Block the account of any user
- Change and reset the password
- Post any message or advertisement
- Manage profile details
- Hide the post of any user

### User: 
Users will be able to:
- Register themselves as a user
- Change and reset their password
- Post any message, article, or upload picture
- Send, accept or reject friend requests
- Manage their profile details
- Hide their own post
- See posts from all the users

Other than the above functionality, the application will have authorization/authentication based on JSON web token (JWT). 

### Web Application Requirement: 
Angular framework, HTML, CSS, VS Code, NodeJS, and MongoDB (you will be provided with a Node.js API which will fetch the data stored in MongoDB database. 

### Web Application Implementation: 
The Web Application will include the following aspects: 
1. Registration page
2. Login page
3. Forgot password page
4. Home Page
5. Network Page, where all the registered users will be available for friendship
6. Friends List Page
7. Settings page
8. Users list (only for admin)

All the above sections are explained below with the block diagram for better understanding (Active links are shown in red color)

#### 1. Registration page: 
This section containsa page for new users to register themselves on the application by providing few personal details

#### 2. Login page:
This section containsa login page where registered user can login to the application

#### 3. Forgot password page:
This page will allow user to reset their account password. They will first have to authenticate themselves by providing few details

#### 4. Home page:
This is the first page that will be rendered when user’s login to the application. Users can write posts or upload pictures here. All the posts available will be shown on this page.

#### 5. Network page:
All the registered users will be shown here, so that logged in user can send them a friend request and track the status of the requests

#### 6. Friends List page:
All the friends of the logged-in user will be shown on this page

#### 7. Settings page:

##### Profile Settings
This page will allow user to change or update their personal details

##### Change password page
This page will allow user to change the password

#### 8. Users List page (only for Admin): 
This page will only be visible to the admin. The admin can see the registered users and can also block the account of any user

### List of REST APIs created to develop this project:
This section explainsthe REST APIs created to develop this project. It displays the final APIs implemented with routes which will be used by front-end application directly
The base URL that we will be using to connect to our backend is: http://3.17.216.66:3000/API 

### Routes
#### 1. User Service
- User Registration: `users/register`
- User Authentication/Login: `users/authenticate`
  - Token received from thiswill be used for further communication with the other APIs
- Find All Users: Retrieve all the users registered in the system. It is used only by admin: `users/`
- Find User by ID – Retrieve any user registered in the system by their unique ID: `users/` + userId
- Find User by Email – Retrieve any user registered in the system by their email ID: `users/finduserbyemail`
- Update user photo ID–Update user’s photo ID using user ID: `users/updateuserphotoId`
- Update User – Update user information mainly used for settings page `users/` + updatedUser.id

#### 2. Post Service:
- Create Post – Create new post or upload new image for post: `posts/createpost`
- Get Posts by User ID – Fetch all posts posted by a specific user using user ID: `posts/` + postId
- Get All Post – Fetch all active posts created/available in the system: `posts`
- Get Posts by User ID – Fetch all posts posted by a specific user using user ID : `posts/findpostbyuserid`
- Update Bulk Posts – Update multiple post record in singe request. Used to update user profile photo for each post record when the photo of user changed who has posted the posts: `posts/updatemanyposts`
- Update Post – Update a single post content using post ID: `posts/`
- Delete Post

### 3. Friends Service
- Create request: `friends/createrequest`
- Update Friend Request by ID – Update any friend request by unique request ID: `friends/` + updateRequest.id, updatedRequest
- Get All Friend Request – Retrieve all friend requests available in the system: `/friends`
- Get Friend Request by ID – Simply retrieve any friend request by unique request ID

### 4. File Upload Service
This module is responsible for uploading and downloading the user profile image and post images from server/database
- Upload File – Upload any new user profile photo or post image: `files/uploadfile`
- Get File/Photo by ID – Download/Fetch any user profile photo or post image using photo ID: `files/`+ photoId



