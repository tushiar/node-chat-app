const users = [];
const addUser = ({ id, displayName, room }) => {
  displayName = displayName.trim().toLowerCase();
  room = room.trim().toLowerCase();
  if (!displayName || !room) {
    return { error: "Display Name and room are required!!" };
  }

  const existingUser = users.find((user) => {
    return user.room === room && user.displayName === displayName;
  });

  if (existingUser) {
    return {
      error: "Username already in use!!",
    };
  }

  const user = { id, displayName, room };
  users.push(user);

  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id;
  });

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};


const getUsers = (id) => {
 
  return users.find(user=>user.id===id);
};


const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter(user=> user.room===room);
};

module.exports = {addUser, removeUser, getUsers, getUsersInRoom}