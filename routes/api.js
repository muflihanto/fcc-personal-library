/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

/**
 * @param {import('express').Express} app - Express app instance
 * @param {import('mongodb').Db} database - Database instance
 */
module.exports = function (app, database) {
  const collection = database.collection("books");

  app
    .route("/api/books")
    .get(function (req, res) {
      collection
        .find({})
        .toArray()
        .then((docs) => {
          res.json(docs);
        })
        .catch((_) => {
          res.status(404).json({ result: "not found" });
        });
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
};
