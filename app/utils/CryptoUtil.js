import crypto from 'crypto'
import { SECRET_KEY } from 'config/client_config';

const algorithm = 'aes-256-ctr'

export function encrypt(string){
  let cipher = crypto.createCipher(algorithm, SECRET_KEY)
  let crypted = cipher.update(string, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
export function decrypt(string){
  let decipher = crypto.createDecipher(algorithm, SECRET_KEY)
  let dec = decipher.update(string, 'hex', 'utf8')
  dec += decipher.final('utf8');
  return dec;
}