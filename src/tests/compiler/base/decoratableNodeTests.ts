﻿import {expect} from "chai";
import {DecoratableNode, ClassDeclaration} from "./../../../compiler";
import {getInfoFromText} from "./../testHelpers";

describe(nameof(DecoratableNode), () => {
    describe(nameof<DecoratableNode>(n => n.getDecorators), () => {
        it("should return an empty array for no decorators", () => {
            const {firstChild} = getInfoFromText<ClassDeclaration>("class Identifier {}");
            expect(firstChild.getDecorators().length).to.equal(0);
        });

        it("should get the decorators when they exist", () => {
            const {firstChild} = getInfoFromText<ClassDeclaration>("@decorator\n@decorator2()\n@decorator3('str')\nclass Identifier {}");
            expect(firstChild.getDecorators().length).to.equal(3);
        });
    });
});
