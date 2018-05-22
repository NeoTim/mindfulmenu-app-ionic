"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const UserDTO_1 = require("./UserDTO");
const _ = require("lodash");
const IdentifiableDTO_1 = require("./IdentifiableDTO");
const DateUtil_1 = require("../../util/DateUtil");
class UserFDTO extends IdentifiableDTO_1.IdentifiableDTO {
    // --
    static fromDTO(dto) {
        let userFDTO = new UserFDTO();
        const copiedProperties = ['id', 'firstName', 'lastName', 'email', 'favoriteMealIds', 'emailVerified', 'lastLoginDate', 'lastAutomaticUpdateDate', 'automaticUpdateEnabled', 'isAdmin', 'isEnabled'];
        for (let copiedProperty of copiedProperties) {
            if (_.has(dto, copiedProperty)) {
                userFDTO[copiedProperty] = _.cloneDeep(dto[copiedProperty]);
            }
        }
        return userFDTO;
    }
    static toDTO(userFDTO) {
        let dto = new UserDTO_1.UserDTO();
        const copiedProperties = ['id', 'firstName', 'lastName', 'email', 'favoriteMealIds', 'emailVerified', 'lastLoginDate', 'lastAutomaticUpdateDate', 'automaticUpdateEnabled', 'isAdmin', 'isEnabled'];
        for (let copiedProperty of copiedProperties) {
            if (_.has(userFDTO, copiedProperty)) {
                dto[copiedProperty] = _.cloneDeep(userFDTO[copiedProperty]);
            }
        }
        return dto;
    }
}
__decorate([
    class_transformer_1.Transform(DateUtil_1.DateUtil.firebaseCloudFunctionDateConversion)
], UserFDTO.prototype, "lastLoginDate", void 0);
__decorate([
    class_transformer_1.Transform(DateUtil_1.DateUtil.firebaseCloudFunctionDateConversion)
], UserFDTO.prototype, "lastAutomaticUpdateDate", void 0);
exports.UserFDTO = UserFDTO;
//# sourceMappingURL=UserFDTO.js.map