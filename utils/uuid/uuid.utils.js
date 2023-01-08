import { v4 as uuidv4, validate as validateId, v1 as uuidv1, v3 as uuidv3 } from "uuid";
import shortUuid from "short-uuid";
class uuidUtil {

      v4Options = {}

     generateCustomDocumentId() {
          return uuidv4(this.v4Options);
     }

     generateNameSpaceId(name, nameSpace) {
          return uuidv3(name, nameSpace);
     }

     generateUudiV1() {
          return uuidv1(this.v4Options);
     }

     generateRandomNumber() {
          return Math.floor(100000 + Math.random() * 900000);
     }

     generateEpocTimeId() {
          return Math.floor(new Date().getTime() / 1000);
     }
     validateUuid(uuid) {
          return validateId(uuid);
     }

     generateShortUuid() {
          return shortUuid.generate();
     }

     generateRandomAlphanumeric() {
          return Math.random().toString(36).slice(-8);
     }

}


export default new uuidUtil();