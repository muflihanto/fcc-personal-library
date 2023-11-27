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
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      collection
        .find({})
        .toArray()
        .then((docs) => {
          const newDocs = docs.map((doc) => {
            const commentcount = doc.comments.length;
            delete doc.comments;
            return {
              ...doc,
              commentcount,
            };
          });
          res.json(newDocs);
        })
        .catch((_) => {
          res.status(404).json({ result: "not found" });
        });
    })

    .post(function (req, res) {
      //response will contain new book object including atleast _id and title
      const title = req.body.title;

      if (title === undefined) return res.status(400).send("missing required field title");

      collection
        .insertOne({
          title,
          comments: [],
        })
        .then((doc) => {
          res.json({
            title,
            _id: doc.insertedId,
          });
        })
        .catch(() => {
          res.status(500).send("cannot insert a book");
        });
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      collection
        .deleteMany({})
        .then(() => {
          res.send("complete delete successful");
        })
        .catch(() => {
          res.status(500).send("cannot delete all books");
        });
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
