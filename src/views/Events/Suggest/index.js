export const profileSuggest = ['check_whitelist_blacklist', 'check_user_network', 'check_velocity'];

export const profileFilterSuggest = ['AND', 'OR'];

export const operationSuggest = ["COMPARE", "COUNT", "SUM","SCORE"]

export const fieldSuggest = ["requestID", "transID", "reqDate","userID","phonenumber","platform","deviceID","deviceModel","campaignID","campaignCode","appID","appTransID","appVer","osVer","amount","discountAmount","pmcID","transType","fullcardnumberhash","hashCardNumber","bankCode","ccBankCode","atmReturnCode","description","zpSystem","requestStatus","transStatus","userLevel","first6CardNo","last4CardNo","firstAccountNo","lastAccountNo","subAppID","subAppUser","appUser","tpeBankCode","bankconnectorcode","zpCardId","userIP","mno","zpAccountId"]

export const fieldTypeSuggest = ["INTEGER", "LONG","FLOAT","DOUBLE", "STRING","BOOLEAN"]

export const operatorSuggest = [">",">=", "<","<=", "==","!=","IN","NOT IN"]

export const valueSuggest = []

export const clients = ['none','tpe', 'promotion', 'zpi', 'account']
export const eventTypes = [1,2,3]
export const status = ['ON', 'OFF']
export const domainsSuggest = ['domain_user', 'domain_device', 'domain_velocity'];

export const tierNameSuggest = ['user in whitelist', 'user in blacklist']

export const prioritySuggest = ['1', '2', '3', '4', '5']

export const decisionSuggest = ['APPROVE', 'REJECT', 'CHALLENGE', 'WHITELIST']

export const filterSuggest = ['AND', 'OR']