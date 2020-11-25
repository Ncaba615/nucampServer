const express = require("express");
const promotionRouter = express.Router();

promotionRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    res.end("Will send all the promotions to you");
  })
  .post((req, res) => {
    res.end(
      `Will add the promotion: ${req.body.name} with description: ${req.body.description}`
    );
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /promotions");
  })
  .delete((req, res) => {
    res.end("Deleting all promotions");
  });

promotionRouter
  .route("/:promotionID")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    res.end(`Will send: ${req.params.promotionID} promotions to you`);
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation now supported on /promotions/${req.params.promotionID}`
    );
  })
  .put((req, res) => {
    res.write(`Updating the promotion: ${req.params.promotionID}\n`);
    res.end(`Will update the promotion: ${req.body.name}
        with description: ${req.body.description}`);
  })
  .delete((req, res) => {
    res.end(`Deleting promotion: ${req.params.promotionID}`);
  });

module.exports = promotionRouter;
