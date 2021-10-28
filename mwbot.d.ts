import bluebird from "bluebird";

interface MWBot{

  loginGetEditToken(any);

  request(params: object, customRequestOptions:object): bluebird<any>;
}
