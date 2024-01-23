# HTTP REQUESTS

## RETRIEVING DATA

There are several methods available to receive data, such as `req.params`, `req.query`, and `req.body`.

### REQ.PARAM
req.params to access parameters data sent in  the route pattern. 
The req.params property is an object containing properties mapped to the named route “parameters”. Route parameters are placeholders in the URL defined with colon (:) syntax. 

**Syntax**
  ```
  req.param
  ```

### REQ.QUERY

The req.query property is used to access the query parameters from the URL of an incoming HTTP request. Query parameters are key-value pairs included in the URL after the “?” symbol, and they are separated by “&” symbols.
**Syntax**
```
req.query
```
### REQ.BODY
The req.body property contains key-value pairs of data submitted in the request body. By default, it is undefined and is populated when you use a middleware called body-parsing such as express.urlencoded() or express.json(). 
req.body is used to access data sent in the request body and is typically used for POST or PUT requests. To access the data, you need to use a middleware such as body-parser or the built-in express.json middleware.
```
req.body
```
#### REQUEST BODY

The request body is part of an HTTP request and contains data that is sent by the client (typically a web browser or another server) to the server. It is used to transmit additional information required by the server to process the request. The request body is commonly associated with HTTP methods like POST, PUT, and PATCH, where data is included in the body of the request.

The content of the request body can vary and is not limited to just text. It can be in different formats, such as:
1. **Form Data**
2. **JSON (JavaScript Object Notation)**
3. **XML (eXtensible Markup Language)**
4. **Binary Data**

In server-side programming, the request body must be handled and parsed to extract the relevant information.
## REFERENCES
 - https://visheshism.medium.com/simplifying-data-input-in-express-an-overview-of-req-params-req-query-and-req-body-179ab07b2256#:~:text=your%20application's%20requirements.-,Use%20req.,sent%20in%20the%20request%20body.
 - https://www.geeksforgeeks.org/express-js-req-query-property/
 - https://www.geeksforgeeks.org/express-js-req-params-property/
 - https://www.geeksforgeeks.org/express-js-req-body-property/
