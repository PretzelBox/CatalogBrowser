(function(window, $, cache){
  
  var SC = function(t){ _.t = t; }  
  
  var _ = {};
  
  _.u = function(k, v, u){  
    if (!u) u = window.location.href;
    var r = new RegExp("([?&])" + k + "=.*?(&|#|$)(.*)", "gi");
    
    if (r.test(u)) {
      if (typeof v !== 'undefined' && v !== null)
        return u.replace(r, '$1' + k + "=" + v + '$2$3');
      else {
        var h = u.split('#');
        u = h[0].replace(r, '$1$3').replace(/(&|\?)$/, '');
        if (typeof h[1] !== 'undefined' && h[1] !== null) 
          u += '#' + h[1];
        return u;
      }
    }
    else {
      if (typeof v !== 'undefined' && v !== null) {
        var s = u.indexOf('?') !== -1 ? '&' : '?',
            h = u.split('#');
        u = h[0] + s + k + '=' + v;
        if (typeof h[1] !== 'undefined' && h[1] !== null) 
          u += '#' + h[1];
        return u;
      }
      else
        return u;
    }
  };
  
  _.b = function(o){
    var u = '/api/v1';
    u += ('/' + o.entity);
    
    if('id' in o){
      if( Array.isArray(o.id) )
        u += ('?select_many=' + o.id.join(','));
      else
        u += ('/' + o.id);
    }
    
    for(var k in o){
      if(k != 'id' && k != 'entity'){
        var v = o[k];
        
        if(Array.isArray())
          v = v.join(',');
        
        u = _.u(k, v, u);
      }
    }
    
    return 'https://' + location.hostname + u
  };

  _.m = function(t, o, c){
    var u = _.b(o);
    var cv;
    
    if(cache)
      cv = cache.get(u);

    if(cv && cv != null)
      c(cv);
    else {
      $.ajax( u, {
        contentType: "application/json; charset=utf-8",
        headers: {
          'X-AC-AUTH-TOKEN' : t
        },
        success : function(r){
          if(cache)
            cache.set(u,r,1440);
          c(r);
        },
        error: function(r){
          c(r);
        }
      });
    }
  };
  
  _.fn = function(entity, options, callback){
    var e, o, c;
    
    for(var i=0; i<arguments.length; i++){
      var arg = arguments[i];
      var t = (typeof(arg)).toLowerCase();
      
      switch(t){
        case 'string':
          e  = arg;
          break;
        case 'object':
          o = arg;
          break;
        case 'function':
          c = arg;
          break;
      }
    }
    
    if(!e || e === undefined || e === null)
      throw new TypeError('An entity must be supplied to make a catalog request.');    
    
    o || (o={});
    o.entity = e;
    
    if(!c || c === undefined || c === null)
      c = $.noop;
    
    _.m(_.t, o, c);
  };
  
  _.c = function(n){
    var r = n.replace(/_/g, ' ');
    r = r.replace(/\w\S*/g, function(k){return k.charAt(0).toUpperCase() + k.substr(1).toLowerCase();});
    r = r.replace(/ /g,'');
    return r;
  }
  
  _.e = [
    'attributes',
    'attribute_groups',
    'categories',
    'manufacturers',
    'products',
    'product_lists',
    'product_pictures',
    'product_variants',
    'variant_groups',
    'variant_inventory'
  ];
  
  for(var i=0; i<_.e.length; i++){
    (function(){
      var e = _.e[i];
      var n = _.c(e);
      SC.prototype[n] = function(o,c){ 
        _.fn(e, o, c) 
      };
    })();
  }
  
  window.CatalogBrowser = SC;
})(window, jQuery, (lscache || null));