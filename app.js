var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/user/get");
var register = require("./routes/user/register");
var userUpdate = require("./routes/user/update");
var userDelete = require("./routes/user/delete");
var login = require("./routes/user/login");
var imageUpload = require("./routes/upload/upload_file");
var musicUpload = require("./routes/upload/upload_music");
var getImage = require("./routes/upload/images");
var adminUploadMusic = require("./routes/admin/music/upload_music");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/register", register);
app.use("/users/update", userUpdate);
app.use("/users/delete", userDelete);
app.use("/login", login);
app.use("/upload_image", imageUpload);
app.use("/image", getImage);
app.use("/music", musicUpload);
app.use("/admin/upload-music", adminUploadMusic);
app.use("/images", express.static("images"));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
