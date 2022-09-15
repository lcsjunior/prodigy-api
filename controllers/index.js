function index(req, res) {
  res.render('index', { title: 'Express' });
}

module.exports = {
  index,
};
