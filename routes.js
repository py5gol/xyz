module.exports = fastify => {

    // Create constructor for mobile detect module.
    const Md = require('mobile-detect');

    // Set jsrender module for server-side templates.
    const jsr = require('jsrender');

    // 
    const nanoid = require('nanoid');

    // Add content type parser for octet stream.
    fastify.addContentTypeParser('*', (req, done) => done());

    fastify.register((fastify, opts, next) => {

        fastify.route({
            method: 'GET',
            url: '/',
            beforeHandler: fastify.auth([fastify.authAccess]),
            handler: async (req, res) => {

                const token = req.query.token ?
                    fastify.jwt.decode(req.query.token) :
                    {
                        access: 'public'
                    };

                let config = global.workspace[token.access].config;

                // Check whether request comes from a mobile platform and set template.
                let md = new Md(req.headers['user-agent']);

                let tmpl = (md.mobile() === null || md.tablet() !== null) ?
                    jsr.templates('./views/desktop.html') :
                    jsr.templates('./views/mobile.html');

                // Build the template with jsrender and send to client.
                res.type('text/html').send(tmpl.render({
                    dir: global.dir,
                    title: config.title || 'GEOLYTIX | XYZ',
                    nanoid: nanoid(6),
                    log: process.env.LOG_LEVEL ? 'data-log = true' : '',
                    bundle_js: 'build/xyz_bundle.js',
                    btnDocumentation: config.documentation ? '' : 'style="display: none;"',
                    hrefDocumentation: config.documentation ? config.documentation : '',
                    btnReport: config.report ? '' : 'style="display: none;"',
                    btnLogin: process.env.PRIVATE || process.env.PUBLIC ? '' : 'style="display: none;"',
                    btnLogin_style: token.email ? 'face' : 'lock_open',
                    btnLogin_text: token.email ? token.email : 'anonymous (public)',
                    btnAdmin: token.access === 'admin' ? '' : 'style="display: none;"',
                    btnLocate: config.locate ? '' : 'style="display: none;"'
                }));
            }
        });

        fastify.route({
            method: 'GET',
            url: '/proxy/image',
            beforeHandler: fastify.auth([fastify.authAPI]),
            handler: (req, res) => {
                var q = `${req.query.uri}${req.query.size?'&size='+req.query.size+'&':''}${global.KEYS[req.query.provider]}`;
                res.send(require('request')(q));
            }
        });

        fastify.route({
            method: 'GET',
            url: '/api/mvt/get/:z/:x/:y',
            beforeHandler: fastify.auth([fastify.authAPI]),
            handler: (req, res) => {
                require('./mod/mvt').get(req, res, fastify);
            }
        });

        fastify.route({
            method: 'GET',
            url: '/api/grid/get',
            beforeHandler: fastify.auth([fastify.authAPI]),
            handler: (req, res) => {
                require('./mod/grid').get(req, res, fastify);
            }
        });

        fastify.route({
            method: 'GET',
            url: '/api/geojson/get',
            beforeHandler: fastify.auth([fastify.authAPI]),
            handler: (req, res) => {
                require('./mod/geojson').get(req, res, fastify);
            }
        });

        fastify.route({
            method: 'GET',
            url: '/api/cluster/get',
            beforeHandler: fastify.auth([fastify.authAPI]),
            handler: (req, res) => {
                require('./mod/cluster').get(req, res, fastify);
            }
        });

        fastify.route({
            method: 'GET',
            url: '/api/cluster/select',
            beforeHandler: fastify.auth([fastify.authAPI]),
            handler: (req, res) => {
                require('./mod/cluster').select(req, res, fastify);
            }
        });

        fastify.route({
            method: 'GET',
            url: '/api/location/select',
            beforeHandler: fastify.auth([fastify.authAPI]),
            handler: (req, res) => {
                require('./mod/location').select(req, res, fastify);
            }
        });

        fastify.route({
            method: 'GET',
            url: '/api/location/select_ll',
            beforeHandler: fastify.auth([fastify.authAPI]),
            handler: (req, res) => {
                require('./mod/location').select_ll(req, res, fastify);
            }
        });

        fastify.route({
            method: 'GET',
            url: '/api/location/select_ll_nnearest',
            beforeHandler: fastify.auth([fastify.authAPI]),
            handler: (req, res) => {
                require('./mod/location').select_ll_nnearest(req, res, fastify);
            }
        });

        fastify.route({
            method: 'GET',
            url: '/api/location/select_ll_intersect',
            beforeHandler: fastify.auth([fastify.authAPI]),
            handler: (req, res) => {
                require('./mod/location').select_ll_intersect(req, res, fastify);
            }
        });

        // !!!should be taken from /select infoj
        fastify.route({
            method: 'POST',
            url: '/api/location/chart',
            beforeHandler: fastify.auth([fastify.authAPI]),
            handler: (req, res) => {
                require('./mod/location').chart_data(req, res, fastify);
            }
        });

        fastify.route({
            method: 'POST',
            url: '/api/location/new',
            beforeHandler: fastify.auth([fastify.authAPI]),
            handler: (req, res) => {
                require('./mod/edit').newRecord(req, res, fastify);
            }
        });

        fastify.route({
            method: 'POST',
            url: '/api/location/update',
            beforeHandler: fastify.auth([fastify.authAPI]),
            handler: (req, res) => {
                require('./mod/edit').updateRecord(req, res, fastify);
            }
        });

        fastify.route({
            method: 'GET',
            url: '/api/location/delete',
            beforeHandler: fastify.auth([fastify.authAPI]),
            handler: (req, res) => {
                require('./mod/edit').deleteRecord(req, res, fastify);
            }
        });

        fastify.route({
            method: 'GET',
            url: '/api/location/aggregate',
            beforeHandler: fastify.auth([fastify.authAPI]),
            handler: (req, res) => {
                require('./mod/edit').newAggregate(req, res, fastify);
            }
        });

        fastify.route({
            method: 'GET',
            url: '/api/gazetteer/autocomplete',
            beforeHandler: fastify.auth([fastify.authAPI]),
            handler: (req, res) => {
                require('./mod/gazetteer').autocomplete(req, res, fastify);
            }
        });

        fastify.route({
            method: 'GET',
            url: '/api/gazetteer/googleplaces',
            beforeHandler: fastify.auth([fastify.authAPI]),
            handler: (req, res) => {
                require('./mod/gazetteer').googleplaces(req, res, fastify);
            }
        });

        fastify.route({
            method: 'GET',
            url: '/api/catchments',
            beforeHandler: fastify.auth([fastify.authAPI]),
            handler: (req, res) => {
                require('./mod/catchments').get(req, res, fastify);
            }
        });

        fastify.route({
            method: 'POST',
            url: '/api/images/new',
            beforeHandler: fastify.auth([fastify.authAPI]),
            handler: (req, res) => {
                var data = [];
                req.req.on('data', chunk => data.push(chunk));
                req.req.on('end', () => {
                    req.body = Buffer.concat(data);
                    require('./mod/images').save(req, res, fastify);
                });
            }
        });

        fastify.route({
            method: 'GET',
            url: '/api/images/delete',
            beforeHandler: fastify.auth([fastify.authAPI]),
            handler: (req, res) => {
                require('./mod/images').remove(req, res, fastify);
            }
        });

        fastify.route({
            method: 'POST',
            url: '/api/idx',
            beforeHandler: fastify.auth([fastify.authAPI]),
            handler: (req, res) => {
                require('./mod/edit').setIndices(req, res, fastify);
            }
        });

        next();

    }, { prefix: global.dir });
}