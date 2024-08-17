**URL Metadata Fetcher Application**

Documentation
Overview
The URL Metadata Fetcher is designed to extract and display metadata from provided URLs. The application comprises a React-based front-end and a Node.js-based back-end.

**Design Choices**

React was chosen for the front-end to utilize its state management and reactive updates for a dynamic user interface.
Node.js and Express provide a lightweight, efficient back-end structure, ideal for handling asynchronous API requests.
Axios is used for making HTTP requests due to its promise-based structure, which simplifies asynchronous code.
Cheerio parses HTML returned from web pages, allowing for easy extraction of metadata.
**Trade-offs**

Error Handling: Prioritized robust error handling to guide users but did not implement more complex back-end validations that might complicate the user experience.
UI Complexity: Opted for a simpler, clean interface to keep focus on functionality, sacrificing some potential interactive elements.

**Setup Instructions**
Clone the repository: 

git clone https://github.com/NatalieShuklin/URL-Fetcher.git
cd url-metadata-fetcher

Install dependencies:
npm install

Run the server:
node server.js

Launch the React application:
cd client
npm start

Access the application via http://localhost:3000 in your web browser.


**Front-End Testing (React with Jest and React Testing Library)**
**Back-End Testing (Node.js with Jest and Supertest)**
- found in repo

- 

