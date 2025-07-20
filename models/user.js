class User{
    constructor(userId, username, email, password, roles, is_enabled){
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.password = password;
        this.roles = roles;
        this.isEnabled = is_enabled;
    }
}

exports.User = User;