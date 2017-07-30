var Reflux = require('reflux');
var confSecueActions = require('../actions/confSecu');

var confSecuStore = Reflux.createStore({

   listenables: [confSecueActions],

   secConf: {'type': '', 'secuence': ''},

   getInitialState: function() {
     this.secConf = {'type' : 'number', 'secuence' : '324233'};
     return this.secConf;
   },

   onFetchConfSecuence: function(){
     this.secConf = {'type' : 'string', secuence : 'DDDDDD'};
     this.trigger(this.secConf);
   },

   onSetConfSecuence: function(data){
     this.secConf.secuence = data;
     this.trigger(this.secConf);
   },

   onSetConfType: function(data){
     this.secConf.type = data;
     this.trigger(this.secConf);
   },

   onSaveConfSecuence: function(){
      //TODO:Salva el contenido de this
   },

});

module.exports = confSecuStore;
