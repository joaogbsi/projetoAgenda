const { async } = require('regenerator-runtime');
const Contato =  require('../models/ContatoModel');

exports.index = (req, res) => {
  res.render('contato', {
    contato: {}
  });
  return;
};
exports.register = async (req, res) => {
  try {
    const contato = new Contato(req.body);
    await contato.register();

    if (contato.errors.length >0 ){
      req.flash('errors', contato.errors);
      req.session.save(() => res.redirect('back'));
      return
    }
    req.flash('success', 'Contato registrado com sucesso');
    req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
    
  } catch (error) {
    console.log(error);
    return res.render('404');
  }
  return;
};

exports.editIndex = async (req, res) =>{
  if (!req.params.id) return res.render('404');

  try {
    const contato = await Contato.buscaPorId(req.params.id);

    if(!contato) return res.render('404');
    
    res.render('contato', { contato });
  } catch (error) {
    console.log(error);
    return res.render('404');
  }
}

exports.edit = async (req,res) =>{
  if (!req.params.id) return res.render('404');
  console.log("edit -> primera validação")
  try {
    const contato = new Contato(req.body);
    await contato.edit(req.params.id);

    if (contato.errors.length >0 ){
      req.flash('errors', contato.errors);
      req.session.save(() => res.redirect('back'));
      return
    }
    req.flash('success', 'Contato registrado com sucesso');
    req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
    
  } catch (error) {
    console.log(error);
    return res.render('404');    
  }
}

exports.delete = async (req, res) =>{
  if (!req.params.id) return res.render('404');

  try {

    const contato = await Contato.delete(req.params.id);

    if(!contato) return res.render('404');

    req.flash('success', 'Contato apagado com sucesso');
    req.session.save(() => res.redirect('back'));
    
    
  } catch (error) {
    console.log(error);
    return res.render('404');
  }  
}