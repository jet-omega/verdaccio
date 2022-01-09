import Search from '../../lib/search';
import { match, validateName, validatePackage, setSecurityWebHeaders } from '../middleware';
import { IAuth, IStorageHandler } from '../../../types';
import webApi from './endpoint';
import { Config } from '@verdaccio/types';
import bodyParser from 'body-parser';
import { Router } from 'express';

const route = Router(); /* eslint new-cap: 0 */

/*
 This file include all verdaccio only API(Web UI), for npm API please see ../endpoint/
*/
export default function (config: Config, auth: IAuth, storage: IStorageHandler): Router {
  Search.configureStorage(storage);
  // validate all of these params as a package name
  // this might be too harsh, so ask if it causes trouble
  route.param('package', validatePackage);
  route.param('filename', validateName);
  route.param('version', validateName);
  route.param('anything', match(/.*/));

  route.use(bodyParser.urlencoded({ extended: false }));
  route.use(auth.webUIJWTmiddleware());
  route.use(setSecurityWebHeaders);
  route.use(webApi(auth, storage, config));
  return route;
}
