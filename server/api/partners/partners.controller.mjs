import {getPartnerInDb} from './partners.service.mjs';

export const getPartner = async (req, res, username) => {
	

    const result = await getPartnerInDb(req.params.username);
    if (result.ok){
        return result.value;
    } else {
        return res.status(result.error).json({error: result.errorMsg});
    }
    
};
