const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const userProfiles = {};

io.on("connection", socket => {
  let previousId;
  const safeJoin = currentId => {
    socket.leave(previousId);
    socket.join(currentId);
    previousId = currentId;
  };

  socket.on("getUserProfile", profileId => {
    safeJoin(profileId);
    socket.emit("userProfile", userProfiles[profileId]);
  });

  socket.on("addUserProfile", userProfile => {
    userProfiles[userProfile.id] = userProfile;
    safeJoin(userProfile.id);
    io.emit("userProfiles", Object.keys(userProfiles));
    socket.emit("userProfile", userProfile);
  });

  socket.on("editUserProfile", userProfile => {
    userProfiles[userProfile.id] = userProfile;
    socket.to(userProfile.id).emit("userProfile", userProfile);
  });

  io.emit("userProfiles", Object.keys(userProfiles));
});

http.listen(4444);
