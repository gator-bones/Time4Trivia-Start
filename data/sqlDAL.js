// sqlDAL is responsible to for all interactions with mysql for Membership
const User = require('../models/user').User;
const Result = require('../models/result').Result;
const STATUS_CODES = require('../models/statusCodes').STATUS_CODES;

const mysql = require('mysql2/promise');

const sqlConfig = {
    host: 'localhost',
    user: 'root',
    password: '306879',
    database: 'Time4Trivia',
    multipleStatements: true
};

/**
 * @returns and array of user models
 */
exports.getAllUsers = async function () {
    users = [];

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `select * from Users;`;

        const [userResults, ] = await con.query(sql);

        // console.log('getAllUsers: user results');
        // console.log(userResults);

        for(key in userResults){
            let u = userResults[key];

            let sql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where ur.UserId = ${u.UserId}`;
            console.log(sql);
            const [roleResults, ] = await con.query(sql);

            // console.log('getAllUsers: role results');
            // console.log(roleResults);

            let roles = [];
            for(key in roleResults){
                let role = roleResults[key];
                roles.push(role.Role);
            }
            users.push(new User(u.UserId, u.Username, u.Email, u.Password, roles, u.is_enabled));
        }
    } catch (err) {
        console.log(err);
    }finally{
        con.end();
    }

    return users;
}

/**
 * @returns and array of user models
 */
 exports.getUsers = async function () {
    users = [];

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `select * from Users u join UserRoles ur on u.userid = ur.userId join Roles r on ur.roleId = r.roleId`;

        const [userResults, ] = await con.query(sql);

        // console.log('getAllUsers: user results');
        // console.log(userResults);

        for(key in userResults){
            let u = userResults[key];

            let sql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where ur.UserId = ${u.UserId}`;
            console.log(sql);
            const [roleResults, ] = await con.query(sql);

            // console.log('getAllUsers: role results');
            // console.log(roleResults);

            let roles = [];
            for(key in roleResults){
                let role = roleResults[key];
                roles.push(role.Role);
            }
            user = new User(u.UserId, u.Username, u.Email, u.Password, roles, u.is_enabled);
            console.log(user)
            users.push(user);
        }
    } catch (err) {
        console.log(err);
    }finally{
        con.end();
    }

    return users;
}

/**
 * @returns and array of user models
 */
 exports.getUsersByRole = async function (role) {
    users = [];

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `select * from Users u join UserRoles ur on u.userid = ur.userId join Roles r on ur.roleId = r.roleId where r.role = '${role}'`;

        const [userResults, ] = await con.query(sql);

        // console.log('getAllUsers: user results');
        // console.log(userResults);

        for(key in userResults){
            let u = userResults[key];

            let sql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where ur.UserId = ${u.UserId}`;
            console.log(sql);
            const [roleResults, ] = await con.query(sql);

            // console.log('getAllUsers: role results');
            // console.log(roleResults);

            let roles = [];
            for(key in roleResults){
                let role = roleResults[key];
                roles.push(role.Role);
            }
            user = new User(u.UserId, u.Username, u.Email, u.Password, roles, u.is_enabled);
            console.log(user)
            users.push(user);
        }
    } catch (err) {
        console.log(err);
    }finally{
        con.end();
    }

    return users;
}

/**
 * @param {*} userId the userId of the user to find
 * @returns a User model or null if not found
 */
exports.getUserById = async function (userId) {
    let user = null;

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `select * from Users where UserId = ${userId}`;
        
        const [userResults, ] = await con.query(sql);

        for(key in userResults){
            let u = userResults[key];

            let sql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where ur.UserId = ${u.UserId}`;
            console.log(sql);
            const [roleResults, ] = await con.query(sql);

            let roles = [];
            for(key in roleResults){
                let role = roleResults[key];
                roles.push(role.Role);
            }
            user = new User(u.UserId, u.Username, u.Email, u.Password, roles, u.is_enabled);
        }
    } catch (err) {
        console.log(err);
    }finally{
        con.end();
    }

    return user;
}

exports.deleteUserById = async function (userId) {
    let result = new Result();

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `delete from UserRoles where UserId = ${userId}`;
        let result = await con.query(sql);
        // console.log(result);

        sql = `delete from Users where UserId = ${userId}`;
        result = await con.query(sql);
        // console.log(result);

        result.status = STATUS_CODES.success;
        result.message = `User ${userId} delted!`;
    } catch (err) {
        console.log(err);
        result.status = STATUS_CODES.failure;
        result.message = err.message;
    }finally{
        con.end();
    }

    return result;
}

exports.promoteUser = async function (userId) {
    let result = new Result();

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `delete from UserRoles where UserId = ${userId}`;
        let result = await con.query(sql);
        // console.log(result);

        sql = `insert into UserRoles (UserId, RoleId) values ('${userId}', 2)`;
        const userResult = await con.query(sql);

        result.status = STATUS_CODES.success;
        result.message = `User ${userId} promoted!`;
    } catch (err) {
        console.log(err);
        result.status = STATUS_CODES.failure;
        result.message = err.message;
    }finally{
        con.end();
    }

    return result;
}

exports.demoteUser = async function (userId) {
    let result = new Result();

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `delete from UserRoles where UserId = ${userId}`;
        let result = await con.query(sql);
        // console.log(result);

        sql = `insert into UserRoles (UserId, RoleId) values ('${userId}', 1)`;
        const userResult = await con.query(sql);

        result.status = STATUS_CODES.success;
        result.message = `User ${userId} promoted!`;
    } catch (err) {
        console.log(err);
        result.status = STATUS_CODES.failure;
        result.message = err.message;
    }finally{
        con.end();
    }

    return result;
}

/**
 * @param {*} username the username of the user to find
 * @returns a User model or null if not found
 */

// Add the getUserRoles helper function here or ensure it's defined elsewhere in sqlDAL.js
async function getUserRoles(con, userId) {
    const sql = `SELECT R.Role FROM UserRoles UR JOIN Roles R ON UR.RoleId = R.RoleId WHERE UR.UserId = ?`;
    const [roleResults] = await con.query(sql, [userId]);
    return roleResults.map(role => role.Role);
}

exports.getUserByUsername = async function (username) {
    let user = null;
    const con = await mysql.createConnection(sqlConfig); // Create connection for this function

    try {
        let sql = `SELECT UserId, Username, Email, Password, is_enabled FROM Users WHERE Username = ?`;
        console.log(`Executing SQL: ${sql} with username: ${username}`); 

        const [userResults] = await con.query(sql, [username]);

        if (userResults.length > 0) {
            const u = userResults[0]; 

            const roles = await getUserRoles(con, u.UserId);

            user = new User(u.UserId, u.Username, u.Email, u.Password, roles, u.is_enabled);
        }
    } catch (err) {
        console.error("Error in getUserByUsername:", err); 
        
    } finally {
        await con.end(); 
    }

    return user;
};

/**
 * @param {*} userId the userId of the user to find roles for
 * @returns an array of role names
 */
exports.getRolesByUserId = async function (userId) {
    results = [];

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where UserId = ${userId}`;

        const [results, ] = await con.query(sql);

        for(key in results){
            let role = results[key];
            results.push(role.Role);
        }
    } catch (err) {
        console.log(err);
    }finally{
        con.end();
    }

    return results;
}

/**
 * @param {*} username 
 * @param {*} hashedPassword 
 * @param {*} email 
 * @returns a result object with status/message
 */
exports.createUser = async function (username, hashedPassword, email, firstName, lastName) {
    let result = new Result();

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `insert into Users (Username, Email, Password, FirstName, LastName) values ('${username}', '${email}', '${hashedPassword}', '${firstName}', '${lastName}')`;
        const userResult = await con.query(sql);

        let newUserId = userResult[0].insertId;

        sql = `insert into UserRoles (UserId, RoleId) values (${newUserId}, 1)`;
        await con.query(sql);

        result.status = STATUS_CODES.success;
        result.message = 'Account Created with User Id: ' + newUserId;
        result.data = newUserId;
        return result;
    } catch (err) {
        console.log(err);

        result.status = STATUS_CODES.failure;
        result.message = err.message;
        return result;
    }finally{
        con.end();
    }
}

/**
 * 
 * @param {*} userId 
 * @param {*} hashedPassword 
 * @returns a result object with status/message
 */
exports.updateUserPassword = async function (userId, hashedPassword) {
    let result = new Result();

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `update Users set password = '${hashedPassword}' where userId = '${userId}'`;
        const userResult = await con.query(sql);

        // console.log(r);
        result.status = STATUS_CODES.success;
        result.message = 'Account updated';
        return result;
    } catch (err) {
        console.log(err);

        result.status = STATUS_CODES.failure;
        result.message = err.message;
        return result;
    }
}

exports.enableUser = async function (userId) {
    let result = new Result();

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `UPDATE Users SET is_enabled = 1 WHERE UserId = ?`;
        await con.query(sql, [userId]);

        result.status = STATUS_CODES.success;
        result.message = `User ${userId} enabled!`;
    } catch (err) {
        console.log(err);
        result.status = STATUS_CODES.failure;
        result.message = err.message;
    } finally {
        con.end();
    }

    return result;
}

exports.disableUser = async function (userId) {
    let result = new Result();

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `UPDATE Users SET is_enabled = 0 WHERE UserId = ?`;
        await con.query(sql, [userId]);

        result.status = STATUS_CODES.success;
        result.message = `User ${userId} disabled!`;
    } catch (err) {
        console.log(err);
        result.status = STATUS_CODES.failure;
        result.message = err.message;
    } finally {
        con.end();
    }

    return result;
}