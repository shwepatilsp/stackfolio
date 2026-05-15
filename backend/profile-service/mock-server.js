const http = require('http');
const url = require('url');

const mockProfile = {
  name: "Your Name",
  title: "Full Stack Developer",
  bio: "Passionate full-stack developer with expertise in Spring Boot, React.js, microservices, and cloud technologies.",
  email: "your.email@example.com",
  phone: "+1-555-0123",
  location: "Your City, Country",
  skills: ["Java", "Spring Boot", "React.js", "TypeScript", "Docker", "MySQL", "PostgreSQL"]
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (path === '/api/profile/me' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(mockProfile));
  } else if (path === '/actuator/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: "UP" }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(8081, () => {
  console.log('Mock Profile Service running on http://localhost:8081');
  console.log('Profile endpoint: http://localhost:8081/api/profile/me');
  console.log('Health check: http://localhost:8081/actuator/health');
});
