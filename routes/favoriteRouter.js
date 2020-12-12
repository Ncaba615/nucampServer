const express = require("express");
const Favorite = require("../models/favorite");
const authenticate = require("../authenticate");
const cors = require("./cors");
const favoriteRouter = express.Router();

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate("user")
      .populate("campsites")
      .then((favorites) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorites);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions,
     authenticate.verifyUser, 
     (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((usersFavorites) => {
        if (usersFavorites) {
          const requestedFavorites = req.body;
          requestedFavorites.forEach((reqFavId) => {
            if (!usersFavorites.campsites.includes(reqFavId._id)) {
              usersFavorites.campsites.push(reqFavId._id);
            }
          });
          usersFavorites
            .save()
            .then((usersFavorites) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(usersFavorites);
            })
            .catch((err) => next(err));
        } else {
          Favorite.create({ user: req.user._id, campsites:[req.body] })
            .then((newFavorite) => {
              const requestedFavorites = req.body;
              requestedFavorites.forEach((fav) => {
                newFavorite.campsites.push(fav._id);
              });
              newFavorite
                .save()
                .then((newFavorite) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(newFavorite);
                })
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
      .then((deletedFavorite) => {
        res.statusCode = 200;
        if (deletedFavorite) {
          res.setHeader("Content-Type", "application/json");
          res.json(deletedFavorite);
        } else {
          res.setHeader("Content-Type", "text/plain");
          res.end("You do not have any favorites to delete.");
        }
      })
      .catch((err) => next(err));
  });

favoriteRouter
  .route("/:campsiteId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("Operation Not Supported");
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((usersFavorites) => {
        if (usersFavorites) {
          if (!usersFavorites.campsites.includes(req.params.campsiteId)) {
            usersFavorites.campsites.push(req.params.campsiteId);
            usersFavorites
              .save()
              .then((usersFavorites) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(usersFavorites);
              })
              .catch((err) => next(err));
          }
        } else {
          Favorite.create({
            user: req.user._id,
            campsites: [req.params.campsiteId],
          })
            .then((newFavorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(newFavorite);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })
  .put(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("Operation Not Supported");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne(req.params.favoriteId)
      .then((favorite) => {
        if (favorite) {
          const index = favorite.campsites.indexOf(req.params.campsiteId);
          if (index > -1) {
            favorite.campsites.splice(index, 1);
          }
          favorite
            .save()
            .then((deletedFavorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(deletedFavorite);
            })
            .catch((err) => next(err));
        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.end("Nothing to delete");
        }
      })
      .catch((err) => next(err));
  });

module.exports = favoriteRouter;
