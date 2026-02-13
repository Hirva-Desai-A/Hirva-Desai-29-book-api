let users = [];

exports.getUsers = (req, res) => {
    res.json(users);
};

exports.createUser = (req, res) => {
    const user = {
        id: users.length + 1,
        name: req.body.name
    };
    users.push(user);
    res.status(201).json(user);
};
