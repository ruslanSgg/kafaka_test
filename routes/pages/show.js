module.exports = function(req,res){
  console.log(__dirname + '/../../public/index.html')
    res.render('index', { title: 'Chat' });
}
