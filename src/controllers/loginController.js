//importando os models
const Login = require('../models/LoginModel');

exports.index = (req, res) => {
    //usuario logado redireciona pra outra pagina
    if(req.session.user) return res.render('logado');
    res.render('login');
};

exports.register = async (req,res) =>{
   
    try {
        
        //chamando o model
        const login =  new Login(req.body);
        //req.body = conteudo do formulario
    
        await login.register(); 
        //testar se possui erros de cadastro
        if(login.errors.length > 0){
            //gerar mensagens de erros
            req.flash('errors', login.errors);
            //com erros retorna para a pagina anterior
            req.session.save(function(){
                console.log('controler -> com erros');
                return res.redirect('back');
            });
            return;
        }
        
        console.log('controler -> sem erros');    
        req.flash('success', 'Usuario criado com sucesso');
        req.session.save(function(){
            return res.redirect('back');
        });         
        
        //return res.send(login.user);
    } catch (error) {
        console.log(error);
        return res.render('404');
    }

};

exports.login = async (req, res) =>{
    try {
        
        //chamando o model
        const login =  new Login(req.body);
        //req.body = conteudo do formulario
    
        await login.login(); 
        //testar se possui erros de cadastro
        if(login.errors.length > 0){
            //gerar mensagens de erros
            req.flash('errors', login.errors);
            //com erros retorna para a pagina anterior
            req.session.save(function(){
                console.log('controler -> com erros');
                return res.redirect('back');
            });
            return;
        }
        
        req.flash('success', 'Você logou com sucesso');
        req.session.user = login.user;
        req.session.save(function(){
            return res.redirect('back');
        });         
        
        //return res.send(login.user);
    } catch (error) {
        console.log(error);
        return res.render('404');
    }
};

exports.logout = (req,res) =>{
    //para sair destroy a sessão
    req.session.destroy();
    res.redirect('/');
}