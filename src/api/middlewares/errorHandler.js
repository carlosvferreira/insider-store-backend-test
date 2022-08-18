function errorHandler(err, req, res, next) {
  if (err.message) {
    res.status(400).send({
      error: "Oops",
      message: err.message,
    });
  } else {
    res
      .status(500)
      .send(
        "Unknown error. Please try again later or contact our support team."
      );
  }
  next();
}

module.exports = { errorHandler };
