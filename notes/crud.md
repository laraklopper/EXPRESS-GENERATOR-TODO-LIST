# CRUD

CRUD (Create, Read, Update, Delete) is an acronym for ways one can operate on stored data.

| Operation | Description | HTTP METHOD |
|-----------|-------------|----------------|
| Create    | Adds a new record to the database. | POST |
| Read      | Read any object existing property property | GET |
| Update    | Update or modify an object or the attribute values. | PUT |
| Delete    |Delete or remove an entry from an object or the whole object. | DELETE |

##  HTTP METHODS
### POST
The HTTP POST method sends data to the server. The body of the request is indicated in the Content-Type Header.

**SYNTAX**
```
POST /test
```
### GET
The HTTP GET method requests a representation of the specified resource. Requests using GET should only be used to request data (they shouldn't include data).

**SYNTAX**
```
GET /index.html
```
### PUT
The HTTP PUT request method creates a new resource or replaces a representation of the target resource with the request payload.

**SYNTAX**
```
PUT /new.html HTTP/1.1
```
### DELETE
The HTTP DELETE request method deletes the specified resource.

**SYNTAX**
```
DELETE /file.html HTTP/1.1
```
