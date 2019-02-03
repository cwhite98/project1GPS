# **Project 1 GPS Track**

### By Camila White Romero - cwhiter@eafit.edu.co

## Description

The app lets the user keep track of his location and then see the route he made. 
The style is based in one of [FaztWeb](https://faztweb.com) tutorials.

## Analysis and Design

### Functional Requirements
- The app must let the user Sign Up or Login.
- The app must let the user thack his location.
- The app must show with a route all the places he visited.

### Non-Functional Requirements
- The app must have all data private per user and device.
- The app must not allow the user to check the route before login in.

### Data Model
The user is registered with
```
firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
```
The Route is registered with
```
userId: {
  type: String,
  index: true
},
name: {
  type: String
},
date: {
  type: Date,
  required: true,
  default: Date.now
}
    
```
And each location the app tracks is registered with
```
routeId: {
  type: String,
  index: true,
},
lat: {
  type: Number,
  index: true
},
lon: {
  type: Number,
  index: true
},
userId: {
  type: String,
  index: true
},
date: {
  type: Date,
  required: true,
  default: Date.now
}
```
