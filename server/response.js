function _httpCodeFromError(errorCode) {
	switch (errorCode) {
	// add other messages here when they are not server problems.
	default:
		return 503;
	}
}

module.exports.sendErrorResp = (res, httpStatus, code, message) => {
	if (res) {
		res.setHeader('Content-Type', 'application/json');
		if (httpStatus && code && message) {
			res.status(httpStatus).send(JSON.stringify({ error: code, message }));
		} else if (httpStatus && code) {
			res.status(httpStatus).send(JSON.stringify({ error: code.error, message: code.message }));
		} else if (httpStatus) {
			res.status(_httpCodeFromError(httpStatus.error))
				.send(JSON.stringify({ error: httpStatus.error, message: httpStatus.message }));
		}
		res.end();
	} else {
		console.error('sendErrorResp: You are doing it the wrong way');
		throw new Error('sendErrorResp called wrong-est-ly');
	}
};

module.exports.sendSuccessResp = (res, obj) => {
	res.setHeader('Content-Type', 'application/json');
	res.status(200).send(JSON.stringify(obj));
	res.end();
};


/**
 * Generates the domain based on host and port
 */

module.exports.getDomain = () => {
	if (process.env.PORT) {
		if (Number(process.env.PORT) === 80) {
			return process.env.HOST;
		}
		return `${process.env.HOST}:${process.env.PORT}`;
	}
	return process.env.HOST;
};
