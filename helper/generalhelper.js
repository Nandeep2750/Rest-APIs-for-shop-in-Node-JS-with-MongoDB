const constants = require('../config/constants');

module.exports = {
	generateOtp() {
		let OTP = Math.floor(100000 + Math.random() * 900000);
		return OTP;
	},

	generateRandomFileName(prefix){
		var timestamp = Date.now()+Math.floor(Math.random() * 100);
		if(prefix){
			return constants.FILE_PREFIX_CODE +'_'+prefix+'_'+timestamp;
		}else{
			return constants.FILE_PREFIX_CODE +'_'+timestamp;
		}	
	}
};