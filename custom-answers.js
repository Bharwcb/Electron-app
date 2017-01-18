/* 

Lets make any request for custom answer a function, then have a separate file for populating the indexed Title hash.

So for example,

/custom-answers directory
- function to send the request to all pages of a certain question_id
- title.js:  uses it to build the indexedTitle hash
- company.js: uses it to build the indexedCompany hash

..and so on.

