# madam_sauce_kitchen
An Api to help organise meal planning and ordering for madam sauce   

First of all,  
If you're reading this, please star this repo. I wanna be famous🥺  
Anyway...  

## How to get started:
1. npm install (do not npm audit fix if you plan to see test coverage on the web)  
2. set **madam_sauce_kitchen_jwtPrivateKey** environment variable to store your private key for Json Web Tokens - **Important!**

## Tests:
1. Set the NODE_ENV environment variable to **test**
2. npm test  
3. open the newly created **coverage/Icov-report/index.html** file to see test coverage on the app  

## How to use the API:  

There are 4 routes:  
1. **/api/meals** - used to do CRUD on **Meals**    
2. **/api/auth** - used to do make a **Login request** (only admins like madam sauce can login)
3. **/api/admin** - used to do CRUD on **Admins**  
4. **/api/orders** - used to do CRUD on customer **Orders**  

### 1. /api/meals
A. **GET /** route  
This returns all the available meals in the database.  

B. **GET /?day** route  
This takes a valid day of the week as a query and returns all the available meals for that particular day.  

C. **GET /:id** route  
This returns a meal with the given id.  

D. **POST /** route  
Pass a valid meal object with name, day and price properties in the body of the request to add a new meal.  
**For Example**:  
```
{  
    "name" : "banga soup",   
    "day" : "monday",  
    "price" : 5000  
}  
```

E. **PUT /:id** route  
Step 1: Pass a **meal id** as a parameter   
Step 2: Pass a **valid meal object** with name, day and price properties in the body of the request to update an existing meal.  

F. **DELETE /:id** route  
Pass a **meal id** as a parameter to delete an existing meal.  


### 2. /api/auth
A. **POST /** route  
Pass a **valid admin object** with email and password in the body of the request and get an auth token.  
**For Example**:  
```
{   
    "email" : "sinzumoney@gmail.com",  
    "password" : "povertyDie123!"  
}  
```

**NB**:   
With no frontend interface, this auth token can be passed into any request's header with a key named **"x-auth-token"** to pass for a logged in admin


### 3. /api/admins  
A. **GET /** route  
This returns the names of all admins.   

B. **GET /:id** route  
This returns the admin with the given id.   

C. **POST /** route  
Pass a **valid admin object** with name, email and password in the body of the request. 
**For Example**:  
```
{  
    "name" : "Oga Emma",   
    "email" : "sinzumoney@gmail.com",  
    "password" : "povertyDie123!"  
}  
```

D. **PUT /:id** route  
Step 1: Pass a **admin id** as a parameter   
Step 2: Pass a **valid admin object** with name, email and password properties in the body of the request to update an existing admin.  


F. **DELETE /:id** route  
Pass a **admin id** as a parameter to delete an existing admin.  


### 4. /api/orders  
A. **GET /** route  
When logged in (use auth token), this returns all orders.   

B. **GET /:id** route  
When logged in (use auth token), this returns an order with the given Id.  

C. **POST /** route  
Pass a **valid order object** with a valid / existing mealId and a customer object in the body of the request. 
**For Example**:  
```
{  
    "mealId" : "5f8cbeab6c652065c4bebde9",   
    "customer" : {
        "name" : "Osita supposeLikeFood",
        "phone" : "07012454621"
    } 
}  
```

D. **PUT /:id** route  
Step 1: Pass an **order id** as a parameter   
Step 2: Pass a **valid order object** with a valid / existing mealId and a customer object in the body of the request. 


F. **DELETE /:id** route  
Pass an **order id** as a parameter to delete an existing order.  

