module.exports = {
    server: (process.env.NODE_ENV==='production') ? null : "http://localhost:3002",
};  