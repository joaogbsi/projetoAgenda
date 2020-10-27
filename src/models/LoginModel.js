const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {

  constructor(body){
    this.body = body;
    //flag de erros
    this.errors= [];
    //usuario valido
    this.user = null;
  }

  //função vai tentar salvar no banco de  dados, tem que usar promisses
  async register(){
    this.valida();
    if(this.errors.length > 0) return;
    
    await this.userExist();
    
    if(this.errors.length > 0) return;

    //gerador de cadeia de caracter, para criptografar a senha
    const salt = bcryptjs.genSaltSync();
    //criptografar a senha
    this.body.password = bcryptjs.hashSync(this.body.password, salt);
    
     this.user = await LoginModel.create(this.body);
    
  }

  async login(){
    this.valida();
    if(this.errors.length > 0) return;

    //testar se usuário existe
    this.user = await LoginModel.findOne({email: this.body.email});

    if(!this.user){
      this.errors.push('Usuario não existe');
      return;
    }

    //testando o hash da senha
    if(!bcryptjs.compareSync(this.body.password, this.user.password)){
      this.errors.push('senha incorreta');
      this.user = null
      return;
    }
  }

  valida(){
    this.cleanUp();

    if (!validator.isEmail(this.body.email)){
      this.errors.push('E-mail invalido');
    }

    if(this.body.password.length < 3 || this.body.password.length > 50){
      this.errors.push('A senha precisa ter entre 3 e 50 caracterers');
    }

  }

  cleanUp(){
    for(let key in this.body){
      if(typeof this.body[key] !== 'string'){
        this.body[key] = '';
      }
    }

    this.preecheCampos(this.body)
    /* this.body =  {
      email: this.body.email,
      password: this.body.password
    } */
  }

  async userExist(){
    this.user = await LoginModel.findOne({email: this.body.email});      
    if(this.user) this.errors.push('usuario já existe');
  }

  preecheCampos(body){
    this.body =  {
      email: this.body.email,
      password: this.body.password
    }
  }


}

module.exports = Login;
