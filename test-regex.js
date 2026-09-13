const regex = /^\/((?!api\/.*).*)$/;
console.log("api/query:", regex.test("/api/query-part"));
console.log("api:", regex.test("/api"));
console.log("home:", regex.test("/"));
console.log("assets:", regex.test("/assets/index.js"));
