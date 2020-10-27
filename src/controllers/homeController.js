const Contato = require('../models/ContatoModel')

exports.index = async (req, res) => {

  try {
    const contatos = await Contato.buscaContatos()
    res.render('index', {contatos});
    return;
    
  } catch (error) {
    console.log(erro);
    res.remder('404');
  }
};

