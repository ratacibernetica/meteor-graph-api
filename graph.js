'use strict';

/* global
	HTTPResponse: true,
	_: false,
	GraphAPI: true,
	Meteor: false,
	HTTP: false
*/
HTTPResponse = function (response) {
	_.extend(this, response);
};


HTTPResponse.prototype = {
	constructor: HTTPResponse,

	ok: function () {
		return this.statusCode === 200;
	}
};


GraphAPI = function (data) {

	if (data && data.appId && data.secret) {
		this.appId = data.appId;
		this.secret = data.secret;
		this._accessToken = [this.appId, this.secret].join('|');
	}

	// TODO support other types of access tokens
	// and also enable no access token at all,
	// because some edges support that.

	this.version = data && data.version || 'v2.2';
	this.baseUrl = data && data.baseUrl || 'https://graph.facebook.com';
};

_.extend(GraphAPI.prototype, {

	_getEdgePath: function (edge) {

		// enable edge to be defined as array
		var edgeArray = _.isArray(edge) ? _.clone(edge) : [edge];

		// add baseUrl in front
		// [userId, 'pages'] => [this.baseUrl, userId, 'pages']
		edgeArray.unshift(this.baseUrl, this.version);

		// [userId, 'pages'] => 'userId/pages'
		return edgeArray.join('/');	
		
	},
	
	_call: function (method, edge, params) {

		var edgePath = this._getEdgePath(edge);

		return new HTTPResponse(HTTP.call(method, edgePath, {
			params: params
		}));
	},

	get: function (edge, params) {
		return this._call('GET', edge, params);
	},

	post: function (edge, params) {
		return this._call('POST', edge, params);
	},

	delete: function (edge, params) {
                return this._call('DELETE', edge, params);
        } 

});
