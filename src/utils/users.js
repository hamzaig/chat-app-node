const users = [];

const addUser = ({ id, username, room }) => {

  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return {
      error: "Username and room are required",
    }
  }

  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });
  if (existingUser) {
    return {
      error: "username is in user"
    }
  }

  const user = { id, username, room }
  users.push(user);

  return { user };
}

const removeUser = (id) => {
  const index = users.findIndex(user => user.id === id)

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

const getUser = (id) => {
  return users.find(user => user.id === id)
}

const getUsersInRoom = (room) => {
  return users.filter(user => user.room === room);
}


module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
}

// addUser({
//   id: 1,
//   username: "hamza1",
//   room: "nca"
// })

// addUser({
//   id: 2,
//   username: "hamza2",
//   room: "nca"
// })

// console.log(users);
// removeUser(1)
// console.log(users);
// // console.log(users);
// // getUser(2)

// getUsersInRoom("ncab")