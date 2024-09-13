'use strict';
var db = require.main.require('./lib/database.js');
var jwt = require('jsonwebtoken');

var executeClientRequest = require.main.require('./models/executeClientRequest').executeClientRequest;

var Routes = require.main.require('./lib/api-index.js')
var Models = require.main.require('./lib/models.js');

/**
 * @commment  Add user models to ModelManager.models if  subdomain is available
 */
module.exports = function () {
  return function (req, res, next) {

    var clean_path_spl = [];
      var orig_path_spl = req.path.split('/')

      // console.log(orig_path_spl, req.path)

      for (let i = 0; i < orig_path_spl.length; i++) {
        const element = orig_path_spl[i];
        if(element == '') continue;
        clean_path_spl.push(element)
      }

      var clean_path = '/' + clean_path_spl.join('/');

      var query_model;

      var url_param_value;

      var route_id;

      if(!Routes[clean_path] || !Routes[clean_path][req.method]) {
        // check for url param
        var partial_url = clean_path_spl.slice(0, clean_path_spl.length - 1).join('/')
        partial_url = partial_url +  '/:';
        var all_paths = Object.keys(Routes)
        for (let i = 0; i < all_paths.length; i++) {
          const element = all_paths[i];
          if(element.indexOf(partial_url) > -1) {
            query_model = JSON.parse(
              JSON.stringify(
                Routes[element][req.method])
            );
            query_model = JSON.parse(JSON.stringify(Routes[element][req.method]));
            route_id = Routes[element][req.method]
            url_param_value = clean_path_spl[clean_path_spl.length - 1];
            break;
          }
        }

      } else {
        route_id = Routes[clean_path][req.method]
        query_model = JSON.parse(JSON.stringify(Routes[clean_path][req.method]));
      }

      if(!route_id) {
        return res.status(404).send({error: "Invalid route"})
      }

      query_model = JSON.parse(
        JSON.stringify(
          require.main.require(`./lib/api/${route_id}.js`)
        )
      )
      
      let currentModel = {
        idToName: Models.idToName,
        models: Models.models 
      };

      var session = {}

      if (query_model.auth_required === true) {
        if(!process.env.QD_JWT_SECRET) return res.status(500).send({ error: "Auth not setup correctly" });

        const authorization = req.get('authorization')
        if (!authorization) {
          return res.status(403).send({ error: "Login required" })
        }

        try {
          session = jwt.verify(
            authorization,
            process.env.QD_JWT_SECRET,
            {
              ignoreExpiration: true,
              algorithms: process.env.QD_JWT_TYPE
            }); //TODO: set expiration time 

        } catch (err) {
          // console.error(err?.message || err)
          return res.status(403).send({ error: err?.message || "Invalid auth_token" });
        }

      }
      var res_status = 200;

      executeClientRequest({
        query_model: query_model,
        request: {
          body: req.body || {},
          query: req.query || {},
          session: session
        },
        currentModel: currentModel,
        db: db.query
      }, function(err, data) {
        if(err) {
          res_status = err.response_code;
          if(process.env.PROJECT_ENV !== 'prod') {
            console.log(err)
          }
          res.status((res_status ? res_status : 500)).send({error: err})
        } else {
          res.send(data)
        }
      })
    
  };
};
