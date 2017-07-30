var Reflux = require('reflux');
var confDocActions = require('../actions/confDoc');

var confDocStore = Reflux.createStore({

   listenables: [confDocActions],

   docConf: [],

   getInitialState: function() {
     this.docConf = [{estado : true, ident  : 'verde', nombre : 'para las mastas'},
                     {estado : false, ident : 'azul', nombre  : 'para el cielo'},
                     {estado : true, ident  : 'rojoj', nombre : 'para el amor'}
                    ];
     return { 'docConf':this.docConf }
   },

   onFetchConfDocument: function(){
     this.docConf.docConf = [{estado : true, ident  : 'verde', nombre : 'para 1'},
                    {estado : false, ident : 'azul', nombre  : 'para 2'},
                    {estado : true, ident  : 'rojoj', nombre : 'para 3'}]
     this.trigger();
   },

   onSaveConfDocument: function(data){
     this.docConf.docConf = data
     this.trigger(this.docConf);
   },

});

module.exports = confDocStore;
