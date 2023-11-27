/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function () {
    let bookTestId;
    suite("POST /api/books with title => create book object/expect book object", function () {
      test("Test POST /api/books with title", function (done) {
        chai
          .request(server)
          .post("/api/books")
          .send({
            title: "A New Book",
          })
          .end(function (_, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, "_id", "New books should contain _id");
            assert.property(res.body, "title", "Books in array should contain title");
            assert.strictEqual(res.body.title, "A New Book", "New book should contain correct title");
            bookTestId = res.body._id;
            done();
          });
      });

      test("Test POST /api/books with no title given", function (done) {
        chai
          .request(server)
          .post("/api/books")
          .send({})
          .end(function (_, res) {
            assert.equal(res.status, 200);
            assert.strictEqual(res.text, "missing required field title", 'Error message should be "missing required field title"');
            done();
          });
      });
    });

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array");
            assert.property(res.body[0], "commentcount", "Books in array should contain commentcount");
            assert.property(res.body[0], "title", "Books in array should contain title");
            assert.property(res.body[0], "_id", "Books in array should contain _id");
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .get("/api/books/" + "arbitraryId")
          .end(function (_, res) {
            assert.equal(res.status, 200);
            assert.strictEqual(res.text, "no book exists", 'Error message should be "no book exists"');
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .get("/api/books/" + bookTestId)
          .end(function (_, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, "comments", "Book should contain comments");
            assert.isArray(res.body.comments, "Book comments should contain array of comments");
            assert.property(res.body, "title", "Book should contain title");
            assert.property(res.body, "_id", "Book should contain _id");
            done();
          });
      });
    });

    suite("POST /api/books/[id] => add comment/expect book object with id", function () {
      test("Test POST /api/books/[id] with comment", function (done) {
        const comment = "This is the first comment ...";
        chai
          .request(server)
          .post("/api/books/" + bookTestId)
          .send({ comment })
          .end(function (_, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, "comments", "Book should contain comments");
            assert.isArray(res.body.comments, "Book comments should contain array of comments");
            assert.strictEqual(res.body.comments[0], comment, `First comment should be ${comment}`);
            assert.property(res.body, "title", "Book should contain title");
            assert.property(res.body, "_id", "Book should contain _id");
            done();
          });
      });

      test("Test POST /api/books/[id] without comment field", function (done) {
        chai
          .request(server)
          .post("/api/books/" + bookTestId)
          .send({})
          .end(function (_, res) {
            assert.equal(res.status, 200);
            assert.strictEqual(res.text, "missing required field comment", 'Error message should be "missing required field comment"');
            done();
          });
      });

      test("Test POST /api/books/[id] with comment, id not in db", function (done) {
        chai
          .request(server)
          .post("/api/books/" + "arbitraryId")
          .send({ comment: "Arbitrary comment ..." })
          .end(function (_, res) {
            assert.equal(res.status, 200);
            assert.strictEqual(res.text, "no book exists", 'Error message should be "no book exists"');
            done();
          });
      });
    });

    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .delete("/api/books/" + bookTestId)
          .end(function (_, res) {
            assert.equal(res.status, 200);
            assert.strictEqual(res.text, "delete successful", 'Returned message should be "delete successful"');
            done();
          });
      });

      test("Test DELETE /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .delete("/api/books/" + bookTestId)
          .end(function (_, res) {
            assert.equal(res.status, 200);
            assert.strictEqual(res.text, "no book exists", 'Error message should be "no book exists"');
            done();
          });
      });
    });
  });
});
