import jwt from 'jsonwebtoken'

const bcrypt = require('bcryptjs')
const Crypto = require('crypto')

exports.issueSession = async (email: Text) => {

    const authToken = jwt.sign(
        {
            exp: Math.floor(Date.now() / 1000) + (60 *60*24*7),
            email: email 
        }, process.env.SESSIONKEY as string);

    return authToken;
    
}