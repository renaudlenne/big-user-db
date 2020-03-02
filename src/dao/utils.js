import {hashids} from '../config';

export const checkAndDecodeId = (id, prefix) => {
  if (!id || !id.startsWith(`${prefix}.`)) {
    throw new Error('Incorrect id')
  }
  return hashids.decode(id.substring(prefix.length+1))[0];
};
